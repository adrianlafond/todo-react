import React from 'react';

import './style.css';

export interface TodoItemProps {
  children?: React.ReactText;
  complete: boolean;
  id: string;
  onCompleteChange?: (id: string, complete: boolean) => void;
  onDelete?: (id: string) => void;
  onTextChange?: (id: string, text: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  children,
  complete = false,
  id,
  onCompleteChange = () => undefined,
  onDelete = () => undefined,
  onTextChange = () => undefined,
}) => {
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

  function onInputRef(el: HTMLInputElement) {
    if (el) {
      el.focus();
    }
  }

  function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    onTextChange(id, event.target.value);
  }

  return (
    <div className="todo-item">
      {isConfirmingDelete ? (
        <>
          <button onClick={onCancelDelete}>Cancel</button>
          <button onClick={onConfirmDelete}>Yes, delete</button>
        </>
      ) : (
        <>
            <input type="checkbox" checked={complete} onChange={onChange} className="todo-item__complete" />
            <input type="text" className="todo-item__text" value={children} ref={onInputRef} onChange={onInputChange} />
            <button className="todo-item__delete" onClick={onDeleteClick}>&#x1f5d1;</button>
        </>
      )}
    </div>
  );
}
