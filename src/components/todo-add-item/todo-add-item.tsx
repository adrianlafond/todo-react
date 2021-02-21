import React from 'react';

import './style.css';

export const TodoAddItem: React.FC<{ onAdd: () => void }> = ({ onAdd }) => {
  function onClick() {
    onAdd();
  }

  return (
    <button className="todo-add-item" onClick={onClick}>+</button>
  )
};
