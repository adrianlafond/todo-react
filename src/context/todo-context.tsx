import React from 'react';

export interface TodoContextProps {
  idJustAdded: string | null;
  idNextFocus: string | null;
  clearIdJustAdded: (id: string) => void;
  clearNextFocus: (id: string) => void;
}

export const TodoContext = React.createContext<TodoContextProps>({
  idJustAdded: null,
  idNextFocus: null,
  clearIdJustAdded: () => undefined,
  clearNextFocus: () => undefined,
});
