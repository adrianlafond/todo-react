import React from 'react';
import { TodoMode } from '../todo-item';

import './style.css';

export interface StatusBarProps {
  todoMode: TodoMode;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  todoMode,
}) => {
  return (
    <div className="status-bar">
      <p>{todoMode}</p>
    </div>
  );
}