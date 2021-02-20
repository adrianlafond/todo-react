import React from 'react';
import { TodoContext } from '../../context/todo-context';

import './style.css';

export interface TodoItemProps {
  complete: boolean;
  id: string;
  onCompleteChange?: (id: string, complete: boolean) => void;
  onDelete?: (id: string) => void;
  onTextChange?: (id: string, text: string) => void;
  text?: string;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  complete = false,
  id,
  text = '',
  onCompleteChange = () => undefined,
  onDelete = () => undefined,
  onTextChange = () => undefined,
}) => {
  const todoContext = React.useContext(TodoContext);
  const inputRef = React.useRef<HTMLParagraphElement>(null);
  const focusOffset = React.useRef<number>(0);
  const [isConfirmingDelete, setIsConfirmingDelete] = React.useState(false);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    onCompleteChange(id, event.target.checked);
  }

  function onDeleteClick() {
    setIsConfirmingDelete(true);
  }

  function onCancelDelete() {
    setIsConfirmingDelete(false);
  }

  function onConfirmDelete() {
    onDelete(id);
  }

  function onItemTextChange(event: React.ChangeEvent<HTMLParagraphElement>) {
    const selection = window.getSelection();
    if (selection) {
      focusOffset.current = selection.focusOffset;
    }
    todoContext.clearIdJustAdded(id);
    onTextChange(id, event.target.textContent || '');
  }

  React.useEffect(() => {
    if (inputRef.current && todoContext.idJustAdded === id) {
      const el = inputRef.current as HTMLInputElement;
      const range = document.createRange();
      const selection = window.getSelection();
      range.setStart(el.firstChild!, 0);
      range.setEnd(el.firstChild!, `${el.textContent ? el.textContent : ''}`.length);
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, [id, todoContext.idJustAdded]);

  // When `text is updated and the contentEditable element re-rendered, the
  // cursor is reset to 0. To fix, the focus is updated whenever `text` changes
  // (while checking that the field already has focus) to whatever it was
  // prior to the change.
  // `useLayoutEffect` is used instead of `useEffect` to prevent the cursor from
  // flashing from position 0 to new position in Firefox.
  React.useLayoutEffect(() => {
    if (inputRef.current && todoContext.idJustAdded !== id) {
      const el = inputRef.current as HTMLInputElement;
      const selection = window.getSelection();
      if (selection && (selection && el.contains(selection!.focusNode))) {
        const range = document.createRange();
        range.setStart(el.firstChild!, focusOffset.current);
        range.setEnd(el.firstChild!, focusOffset.current);
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }
  }, [id, todoContext.idJustAdded, text]);

  const justAdded = todoContext.idJustAdded === id;

  return (
    <div className="todo-item">
      {isConfirmingDelete ? (
        <>
          <button className="todo-item__delete-cancel" onClick={onCancelDelete}>Cancel</button>
          <button className="todo-item__delete-confirm" onClick={onConfirmDelete}>Yes, delete</button>
        </>
      ) : (
        <>
            <input type="checkbox" checked={complete} onChange={onChange} className="todo-item__complete" />
            <p
              contentEditable
              suppressContentEditableWarning
              className={`todo-item__text ${justAdded ? ' todo-item__text--just-added' : ''}`}
              ref={inputRef}
              onInput={onItemTextChange}
            >
              {text}
            </p>
            <button className="todo-item__delete" onClick={onDeleteClick}>&#x1f5d1;</button>
        </>
      )}
    </div>
  );
}
