import React from 'react';
import { TodoCheck } from '../todo-check';

import './style.css';

export interface TodoItemProps {
  complete?: boolean;
  id: string;
  onCompleteChange: (args: CompleteChangeEvent) => void;
}

export interface CompleteChangeEvent {
  id: string;
  complete: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
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
      {/* <div className="todo-item__text">Text</div> */}
      <div className="todo-item__text">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. </div>
    </div>
  );
}
