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
    <div className="todo-check">
      <span className={`todo-check__mark${checked ? ' todo-check__mark--checked' : ''}`}>
        &#x2713;
      </span>
      <input type="checkbox" className="todo-check__input" onChange={onInputChange} />
    </div>
  )
};
