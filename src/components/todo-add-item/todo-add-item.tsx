import React from 'react';
import { TodoContext } from '../../context/todo-context';

import './style.css';

export interface TodoAddItemProps {
  onAdd: () => void;
  onFocus: () => void;
  onBlur: () => void;
}

export const TodoAddItem: React.FC<TodoAddItemProps> = ({ onAdd, onFocus, onBlur }) => {
  const context = React.useContext(TodoContext);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (context.idNextFocus === 0 && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [context, buttonRef]);

  return (
    <div className="todo-add-item">
      <button
        className="todo-add-item__button"
        onClick={onAdd}
        onFocus={onFocus}
        onBlur={onBlur}
        ref={buttonRef}
      >
        +
      </button>
    </div>
  )
};
