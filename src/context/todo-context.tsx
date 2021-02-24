import React from 'react';

export interface TodoContextProps {
  idJustAdded: number;
  idNextFocus: number;
  clearIdJustAdded: (id: number) => void;
  clearNextFocus: (id: number) => void;
}

export const TodoContext = React.createContext<TodoContextProps>({
  idJustAdded: -1,
  idNextFocus: -1,
  clearIdJustAdded: () => undefined,
  clearNextFocus: () => undefined,
});
