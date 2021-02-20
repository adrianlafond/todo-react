import React from 'react';
import { TodoContext } from '../../context/todo-context';

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
  const todoContext = React.useContext(TodoContext);
  const inputRef = React.useRef<HTMLInputElement>(null);
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

  function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    onTextChange(id, event.target.value);
  }

  React.useEffect(() => {
    if (inputRef.current && todoContext.idJustAdded === id) {
      inputRef.current.focus();
      todoContext.clearIdJustAdded(id);
    }
  }, [id, todoContext]);

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
            <input type="text" className="todo-item__text" value={children} ref={inputRef} onChange={onInputChange} />
            <button className="todo-item__delete" onClick={onDeleteClick}>&#x1f5d1;</button>
        </>
      )}
    </div>
  );
}
