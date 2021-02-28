import React from 'react';
import classnames from 'classnames';
import { TodoContext } from '../../context/todo-context';

import './style.css';

export interface TodoItemProps {
  complete?: boolean;
  id: number;
  onCompleteChange?: (id: number, complete: boolean) => void;
  onDelete?: (id: number) => void;
  onTextChange?: (id: number, text: string) => void;
  onModeChange?: (id: number, mode: TodoMode) => void;
  text?: string;
}

export type TodoMode = 'focus' | 'edit-text' | 'confirm-delete' | 'none';

export const TodoItem: React.FC<TodoItemProps> = React.memo(({
  complete = false,
  id,
  text = '',
  onCompleteChange = () => undefined,
  onDelete = () => undefined,
  onTextChange = () => undefined,
  onModeChange = () =>  undefined,
}) => {
  const todoContext = React.useContext(TodoContext);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const tempText = React.useRef(text);
  const [stateText, setStateText] = React.useState(text);
  const [isConfirmingDelete, setIsConfirmingDelete] = React.useState(false);
  const [mode, setMode] = React.useState('none');

  function updateMode(mode: TodoMode) {
    setMode(mode);
    onModeChange(id, mode);
  }

  function onCheckboxChange() {
    onCompleteChange(id, !complete);
  }

  function onDeleteClick() {
    setIsConfirmingDelete(true);
    updateMode('confirm-delete');
  }

  function onCancelDelete() {
    setIsConfirmingDelete(false);
    updateMode('focus');
  }

  function onConfirmDelete() {
    onDelete(id);
    updateMode('none');
  }

  function onRootFocus() {
    updateMode('focus');
  }

  function onRootBlur(event: React.FocusEvent) {
    setTimeout(() => {
      const el = rootRef.current;
      if (el && el !== document.activeElement && !el.contains(document.activeElement)) {
        if (isConfirmingDelete) {
          setIsConfirmingDelete(false);
        }
        updateMode('none');
      }
    }, 0);
  }

  function onInputBlur() {
    saveText();
  }

  function onInputFocus(event: React.FocusEvent) {
    // prevent bubbling up to onRootFocus():
    event.stopPropagation();
    startEditingText();
    updateMode('edit-text');
  }

  function onItemTextChange(event: React.ChangeEvent<HTMLInputElement>) {
    todoContext.clearIdJustAdded(id);
    setStateText(event.target.value);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (isConfirmingDelete) {
      switch (event.key) {
        case 'Escape':
          onCancelDelete();
          break;
        case 'Enter':
        case 'Space':
          onConfirmDelete();
          break;
        default:
          break;
      }
    } else if (isEditingText()) {
      switch (event.key) {
        case 'Enter':
          stopEditingText();
          saveText();
          break;
        case 'Escape':
          stopEditingText();
          resetText();
          break;
        default:
          break;
      }
    } else {
      switch (event.key) {
        case 'Enter':
        case ' ':
          onCheckboxChange();
          break;
        case 'Backspace':
        case 'Delete':
          onDeleteClick();
          break;
        case 'i':
        case 'I':
          // preventDefault to prevent "Search for text when you start typing"
          // in Firefox:
          event.preventDefault();
          startEditingText();
          break;
        default:
          break;
      }
    }
  }

  function saveText() {
    onTextChange(id, stateText);
  }

  function resetText() {
    setStateText(tempText.current);
  }

  const startEditingText = React.useCallback(() => {
    if (inputRef.current) {
      tempText.current = stateText;
      inputRef.current.focus();
      inputRef.current.setSelectionRange(0, inputRef.current.value.length, 'forward');
    }
  }, [inputRef, stateText]);

  function stopEditingText() {
    if (rootRef.current) {
      rootRef.current.focus();
    }
  }

  function isEditingText() {
    return document.activeElement === inputRef.current;
  }

  React.useEffect(() => {
    if (todoContext.idJustAdded === id) {
      startEditingText();
    }
  }, [id, todoContext, startEditingText]);

  React.useEffect(() => {
    if (rootRef.current && todoContext.idNextFocus === id) {
      rootRef.current.focus();
      todoContext.clearNextFocus(id);
    }
  }, [id, todoContext, rootRef]);

  const isFocused = mode !== 'none';

  return (
    <div
      className={classnames(
        'todo-item',
        {
          'todo-item--complete': complete,
          'todo-item--focus': isFocused,
        }
      )}
      tabIndex={0}
      onKeyDown={onKeyDown}
      ref={rootRef}
      onFocus={onRootFocus}
      onBlur={onRootBlur}
    >
      <div className={classnames('todo-item__content', { 'todo-item__content--focus': isFocused })}>
        {isConfirmingDelete ? (
          <>
            <button
              tabIndex={-1}
              data-testid="todo-item__delete-cancel"
              className="todo-item__delete-cancel todo-item__child"
              aria-label="Cancel delete"
              onClick={onCancelDelete}
            >
              Cancel
            </button>
            <button
              tabIndex={-1}
              data-testid="todo-item__delete-confirm"
              className="todo-item__delete-confirm todo-item__child"
              aria-label="Confirm delete"
              onClick={onConfirmDelete}
            >
              Yes, delete
            </button>
          </>
        ) : (
          <>
            <div className="todo-item__complete todo-item__child">
              <div className="todo-item__complete-checkbox">
                <div className={classnames(
                  'todo-item__complete-checkbox-hit',
                  {
                    'todo-item__complete-checkbox-hit--focus': isFocused,
                    'todo-item__complete-checkbox-hit--complete': complete,
                  }
                )}>
                  <div className={classnames(
                    'todo-item__complete-checkbox-hit-check',
                    {
                      'todo-item__complete-checkbox-hit-check--focus': isFocused && complete,
                      'todo-item__complete-checkbox-hit-check--complete': complete,
                    }
                  )}/>
                </div>
              </div>
              <label className="todo-item__complete-label">
                  {`Mark ${stateText} as complete`}
                <input
                  tabIndex={-1}
                  type="checkbox"
                  data-testid="todo-item__complete"
                  className="todo-item__complete-input"
                  checked={complete}
                  onChange={onCheckboxChange}
                />
              </label>
            </div>
            <label className="todo-item__text-label">
              <input
                tabIndex={-1}
                data-testid="todo-item__text"
                className={classnames(
                  'todo-item__text',
                  'todo-item__child',
                  {
                    'todo-item__text--complete': complete,
                    'todo-item__text--focus': isFocused,
                  }
                )}
                ref={inputRef}
                value={stateText}
                onInput={onItemTextChange}
                onBlur={onInputBlur}
                onFocus={onInputFocus}
              />
            </label>
            <button
              tabIndex={-1}
              data-testid="todo-item__delete"
              className="todo-item__delete todo-item__child"
              aria-label="Delete"
              onClick={onDeleteClick}
            >
              <div className={classnames(
                'todo-item__delete-swipe',
                'todo-item__delete-swipe-1',
                {
                  'todo-item__delete-swipe--complete': complete,
                  'todo-item__delete-swipe--focus': isFocused,
                }
              )} />
              <div className={classnames(
                'todo-item__delete-swipe',
                'todo-item__delete-swipe-2',
                {
                  'todo-item__delete-swipe--complete': complete,
                  'todo-item__delete-swipe--focus': isFocused,
                }
              )} />
            </button>
          </>
        )}
      </div>
    </div>
  );
});
