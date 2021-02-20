import React from 'react';
import { TodoCheck } from '../todo-check';

import './style.css';

export interface TodoItemProps {
  children?: React.ReactNode | React.ReactNode[];
  complete?: boolean;
  id: string;
  onCompleteChange: (args: CompleteChangeEvent) => void;
}

export interface CompleteChangeEvent {
  id: string;
  complete: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  children,
  complete = false,
  id,
  onCompleteChange,
}) => {
  function onChange(checked: boolean) {
    onCompleteChange({ id, complete: checked });
  }

  return (
    <div className="todo-item">
      <TodoCheck checked={complete} onChange={onChange} />
      <div className="todo-item__text">
        {children}
      </div>
    </div>
  );
}
