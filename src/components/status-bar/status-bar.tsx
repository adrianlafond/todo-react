import React from 'react';
import classnames from 'classnames';
import { TodoMode } from '../todo-item';

import './style.css';

export interface TodoStatus {
  id: number;
  mode: TodoMode;
}

export interface StatusBarProps {
  todoStatus: TodoStatus | null;
  errorMessage?: string;
}

export const StatusBar: React.FC<StatusBarProps> = React.memo(({
  todoStatus,
  errorMessage,
}) => {
  const todo = React.useRef<StatusBarProps['todoStatus']>(null);

  const [stateErrorMessage, setStateErrorMessage] = React.useState<string | undefined>();
  const errorTimeout = React.useRef(0);
  React.useEffect(() => {
    setStateErrorMessage(errorMessage);
    if (errorMessage) {
      window.clearTimeout(errorTimeout.current);
      errorTimeout.current = window.setTimeout(() => {
        setStateErrorMessage(undefined);
      }, 5000);
    }
    return () => window.clearTimeout(errorTimeout.current);
  }, [errorMessage]);

  if (todoStatus) {
    const { id, mode } = todoStatus;
    if (mode === 'none' && todo.current && todo.current.id !== id) {
      // An existing todo has a mode other than 'none', so do not update
      // the status for this todo's 'none' mode.
    } else {
      todo.current = mode === 'none' ? null : todoStatus;
    }
  }

  let todoOutput: React.ReactNode = '';
  if (todo.current) {
    switch (todo.current.mode) {
      case 'focus':
        todoOutput = (
          <>
            Press <strong>enter</strong> to toggle the complete state, <strong>i</strong> to edit text, <strong>delete</strong> to delete this todo.
          </>
        );
        break;
      case 'edit-text':
        todoOutput = (
          <>
            Press <strong>enter</strong> to finish editing, <strong>esc</strong> to cancel.
          </>
        );
        break;
      case 'confirm-delete':
        todoOutput = (
          <>
            Press <strong>esc</strong> to cancel or <strong>enter</strong> to confirm.
          </>
        );
        break;
      default:
        break;
    }
  }

  return (
    <div className="status-bar">
      <p className={classnames(
        'status-bar__text',
        'status-bar__error',
        { 'status-bar__text--active': stateErrorMessage },
      )}>{stateErrorMessage}</p>
      <p className={classnames(
        'status-bar__text',
        'status-bar__info',
        { 'status-bar__text--active': todoOutput },
      )}>{todoOutput}</p>
    </div>
  );
});
