import React from 'react';

import { TodoContext } from './context/todo-context';
import { TodoItem, TodoMode } from './components/todo-item';
import { TodoAddItem } from './components/todo-add-item';
import { StatusBar } from './components/status-bar';
import './app.css';

interface Item { id: string; complete: boolean; text: string; };

let uid = 2;

function App() {
  const [idJustAdded, setIdJustAdded] = React.useState<string | null>(null);

  const [items, setItems] = React.useState<Item[]>([
    { id: 'item0', complete: false, text: 'Hello, world' },
    { id: 'item1', complete: false, text: 'Buy milk' },
  ]);

  const todoContext = React.useMemo(() => ({
    idJustAdded,
    clearIdJustAdded: (id: string) => {
      if (id === idJustAdded) {
        setIdJustAdded(null);
      }
    },
  }), [
    idJustAdded,
  ]);

  function onTodoComplete(id: string, complete: boolean) {
    const newItems = items.slice(0);
    newItems[items.findIndex(item => item.id === id)].complete = complete;
    setItems(newItems);
  }

  function onTodoDelete(id: string) {
    const newItems = items.slice(0);
    newItems.splice(items.findIndex(item => item.id === id), 1);
    setItems(newItems);
  }

  function onTodoText(id: string, text: string) {
    const newItems = items.slice(0);
    newItems[items.findIndex(item => item.id === id)].text = text;
    setItems(newItems);
  }

  function onTodoModeChange(id: string, mode: TodoMode) {
    console.log(id, mode);
  }

  function onAddItem() {
    const id = `item${uid++}`;
    const newItems = items.slice(0);
    newItems.push({ id, complete: false, text: 'What needs doing?' });
    setItems(newItems);
    setIdJustAdded(id);
  }

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
        <StatusBar todoMode="none" />
      </main>
    </TodoContext.Provider>
  );
}

export default App;
