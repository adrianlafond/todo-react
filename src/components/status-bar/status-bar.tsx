import React from 'react';
import { TodoMode } from '../todo-item';

import './style.css';

export interface TodoStatus {
  id: number;
  mode: TodoMode;
}

export interface StatusBarProps {
  todoStatus: TodoStatus | null;
}

export const StatusBar: React.FC<StatusBarProps> = React.memo(({
  todoStatus
}) => {
  const [todoOutput, setTodoOutput] = React.useState('');
  const todo = React.useRef<StatusBarProps['todoStatus']>(null);

  React.useEffect(() => {
    if (todoStatus) {
      const { id, mode } = todoStatus;
      if (mode === 'none' && todo.current && todo.current.id !== id) {
        // An existing todo has a mode other than 'none', so do not update
        // the status for this todo's 'none' mode.
      } else {
        todo.current = mode ==='none' ? null : todoStatus;
      }
      updateTodoOutput();
    }
  }, [todoStatus]);

  function updateTodoOutput() {
    if (todo.current) {
      switch (todo.current.mode) {
        case 'focus':
          setTodoOutput(`Press "enter" to toggle the complete state, "i" to edit text, 'delete' to delete this todo.`);
          return;
        case 'edit-text':
          setTodoOutput(`Press "enter" to finish editing.`);
          return;
        case 'confirm-delete':
          setTodoOutput(`Press "esc" to cancel, "enter" to confirm.`);
          return;
        default:
          break;
      }
    }
    setTodoOutput('');
  }

  return (
    <div className="status-bar">
      <p className="status-bar__text">{todoOutput}</p>
    </div>
  );
});
