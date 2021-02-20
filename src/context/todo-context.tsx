import React from 'react';

export interface TodoContextProps {
  idJustAdded: string | null;
  clearIdJustAdded: (id: string) => void;
}

export const TodoContext = React.createContext<TodoContextProps>({
  idJustAdded: null,
  clearIdJustAdded: () => undefined,
});
