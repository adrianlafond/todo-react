import React from 'react';

import './style.css';

export interface TodoCheckProps {
  checked?: boolean;
  onChange: (checked: boolean) => void;
}

export const TodoCheck: React.FC<TodoCheckProps> = ({
  checked = false,
  onChange,
}) => {
  function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange(event.target.checked);
  }

  return (
    <div data-component="todo-check" className={`todo-check${checked ? ' todo-check--checked' : ''}`}>
      <span className="todo-check__mark">
        &#x2713;
      </span>
      <input type="checkbox" className="todo-check__input" onChange={onInputChange} />
    </div>
  )
};
