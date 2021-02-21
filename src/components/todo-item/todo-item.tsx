import React from 'react';
import { TodoContext } from '../../context/todo-context';

import './style.css';

export interface TodoItemProps {
  complete?: boolean;
  id: string;
  onCompleteChange?: (id: string, complete: boolean) => void;
  onDelete?: (id: string) => void;
  onTextChange?: (id: string, text: string) => void;
  onModeChange?: (id: string, mode: TodoMode) => void;
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
  // const focusOffset = React.useRef<number>(0);
  const [isConfirmingDelete, setIsConfirmingDelete] = React.useState(false);

  function onCheckboxChange() {
    onCompleteChange(id, !complete);
  }

  function onDeleteClick() {
    setIsConfirmingDelete(true);
    onModeChange(id, 'confirm-delete');
  }

  function onCancelDelete() {
    setIsConfirmingDelete(false);
    onModeChange(id, 'focus');
  }

  function onConfirmDelete() {
    onDelete(id);
    onModeChange(id, 'none');
  }

  function onRootFocus() {
    onModeChange(id, 'focus');
  }

  function onRootBlur(event: React.FocusEvent) {
    setTimeout(() => {
      const el = rootRef.current;
      if (el && el !== document.activeElement && !el.contains(document.activeElement)) {
        onModeChange(id, 'none');
      }
    }, 0);
  }

  function onInputFocus(event: React.FocusEvent) {
    // prevent bubbling up to onRootFocus():
    event.stopPropagation();
    onModeChange(id, 'edit-text');
  }

  function onItemTextChange(event: React.ChangeEvent<HTMLInputElement>) {
    // const selection = window.getSelection();
    // if (selection) {
    //   focusOffset.current = selection.focusOffset;
    // }
    // let newText = event.target.textContent || '';
    // if (text.length === newText.length && text.endsWith(' ') && !newText.endsWith(' ')) {
    //   newText = text + newText[newText.length - 1];
    //   focusOffset.current += 1;
    // }
    // console.log(`event: {${text}} -> [${newText}]`);
    todoContext.clearIdJustAdded(id);
    onTextChange(id, event.target.value);
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
        case 'Escape':
          stopEditingText();
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

  function startEditingText() {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  function stopEditingText() {
    if (rootRef.current) {
      rootRef.current.focus();
    }
  }

  function isEditingText() {
    return document.activeElement === inputRef.current;
  }

  React.useEffect(() => {
    if (inputRef.current && todoContext.idJustAdded === id) {
      const el = inputRef.current as HTMLInputElement;
      el.focus();
      // const range = document.createRange();
      // const selection = window.getSelection();
      // range.setStart(el.firstChild!, 0);
      // range.setEnd(el.firstChild!, `${el.textContent ? el.textContent : ''}`.length);
      // if (selection) {
      //   selection.removeAllRanges();
      //   selection.addRange(range);
      // }
    }
  }, [id, todoContext.idJustAdded]);

  // When `text is updated and the contentEditable element re-rendered, the
  // cursor is reset to 0. To fix, the focus is updated whenever `text` changes
  // (while checking that the field already has focus) to whatever it was
  // prior to the change.
  // `useLayoutEffect` is used instead of `useEffect` to prevent the cursor from
  // flashing from position 0 to new position in Firefox.
  // React.useLayoutEffect(() => {
  //   if (inputRef.current && todoContext.idJustAdded !== id) {
  //     const el = inputRef.current as HTMLInputElement;
  //     const selection = window.getSelection();
  //     if (selection && el.contains(selection!.focusNode)) {
  //       const range = document.createRange();
  //       const maxOffset = Math.max(0, (inputRef.current.textContent || '').length - 1);
  //       const offset = Math.min(maxOffset, focusOffset.current);
  //       if (el.firstChild) {
  //         range.setStart(el.firstChild, offset);
  //         range.setEnd(el.firstChild, offset);
  //       }
  //       if (selection) {
  //         selection.removeAllRanges();
  //         selection.addRange(range);
  //       }
  //     }
  //   }
  // }, [id, todoContext.idJustAdded, text]);

  // const justAdded = todoContext.idJustAdded === id;

  return (
    <div
      className="todo-item"
      tabIndex={0}
      onKeyDown={onKeyDown}
      ref={rootRef}
      onFocus={onRootFocus}
      onBlur={onRootBlur}
      >
      {isConfirmingDelete ? (
        <>
          <button
            tabIndex={-1}
            data-testid="todo-item__delete-cancel"
            className="todo-item__delete-cancel todo-item__child"
            onClick={onCancelDelete}
          >
            Cancel
          </button>
          <button
            tabIndex={-1}
            data-testid="todo-item__delete-confirm"
            className="todo-item__delete-confirm todo-item__child"
            onClick={onConfirmDelete}
          >
            Yes, delete
          </button>
        </>
      ) : (
        <>
            <input
              tabIndex={-1}
              type="checkbox"
              data-testid="todo-item__complete"
              className="todo-item__complete todo-item__child"
              checked={complete}
              onChange={onCheckboxChange}
            />
            <input
              tabIndex={-1}
              data-testid="todo-item__text"
              className="todo-item__text todo-item__child"
              ref={inputRef}
              onInput={onItemTextChange}
              value={text}
              onFocus={onInputFocus}
            />
            <button
              tabIndex={-1}
              data-testid="todo-item__delete"
              className="todo-item__delete todo-item__child"
              onClick={onDeleteClick}
            >
              &#x1f5d1;
            </button>
        </>
      )}
    </div>
  );
});
