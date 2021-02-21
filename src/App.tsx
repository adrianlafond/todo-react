import React from 'react';

import { TodoContext } from './context/todo-context';
import { TodoItem, TodoMode } from './components/todo-item';
import { TodoAddItem } from './components/todo-add-item';
import { StatusBar } from './components/status-bar';
import './app.css';

interface Item { id: string; complete: boolean; text: string; };

let uid = 0;

function App() {
  const [idJustAdded, setIdJustAdded] = React.useState<string | null>(null);
  const [idNextFocus, setIdNextFocus] = React.useState<string | null>(null);
  const [todoStatus, setTodoStatus] = React.useState<{ id: string, mode: TodoMode } | null>(null);

  const [items, setItems] = React.useState<Item[]>([]);

  function onTodoComplete(id: string, complete: boolean) {
    const newItems = items.slice(0);
    newItems[items.findIndex(item => item.id === id)].complete = complete;
    setItems(newItems);
  }

  function onTodoDelete(id: string) {
    const newItems = items.slice(0);
    const deleteIndex = newItems.findIndex(item => item.id === id);
    if (deleteIndex < newItems.length - 1) {
      setIdNextFocus(newItems[deleteIndex + 1].id);
    } else if (deleteIndex > 0) {
      setIdNextFocus(newItems[deleteIndex - 1].id);
    }
    setIdJustAdded(null);
    newItems.splice(deleteIndex, 1);
    setItems(newItems);
  }

  function onTodoText(id: string, text: string) {
    const newItems = items.slice(0);
    newItems[items.findIndex(item => item.id === id)].text = text;
    setItems(newItems);
  }

  function onTodoModeChange(id: string, mode: TodoMode) {
    setTodoStatus({ id, mode });
  }

  function onAddItem() {
    const id = `item${uid++}`;
    const newItems = items.slice(0);
    newItems.push({ id, complete: false, text: 'What needs doing?' });
    setItems(newItems);
    setIdJustAdded(id);
  }

  const todoContext = React.useMemo(() => ({
    idJustAdded,
    idNextFocus,
    clearIdJustAdded: (id: string) => {
      if (id === idJustAdded) {
        setIdJustAdded(null);
      }
    },
    clearNextFocus: (id: string) => {
      if (id === idNextFocus) {
        setIdNextFocus(null);
      }
    },
  }), [
    idJustAdded,
    idNextFocus,
  ]);

  return (
    <TodoContext.Provider value={todoContext}>
      <main className="app">
        {items.map(item => (
          <TodoItem
            key={item.id}
            id={item.id}
            complete={item.complete}
            text={item.text}
            onCompleteChange={onTodoComplete}
            onDelete={onTodoDelete}
            onTextChange={onTodoText}
            onModeChange={onTodoModeChange}
          />
        ))}
        <TodoAddItem onAdd={onAddItem} />
        <StatusBar todoStatus={todoStatus} />
      </main>
    </TodoContext.Provider>
  );
}

export default App;
