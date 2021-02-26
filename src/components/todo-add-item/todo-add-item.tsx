import React from 'react';

import './style.css';

export const TodoAddItem: React.FC<{ onAdd: () => void }> = ({ onAdd }) => {
  function onClick() {
    onAdd();
  }

  return (
    <div className="todo-add-item">
      <button className="todo-add-item__button" onClick={onClick}>+</button>
    </div>
  )
};
