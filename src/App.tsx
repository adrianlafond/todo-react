import React from 'react';

import { TodoItem } from './components/todo-item';
import { TodoAddItem } from './components/todo-add-item';
import './app.css';

interface Item { id: string; complete: boolean; text: string; };

let uid = 2;

function App() {
  const [items, setItems] = React.useState<Item[]>([
    { id: 'item0', complete: false, text: 'Hello, world' },
    { id: 'item1', complete: false, text: 'Buy milk' },
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

  function onAddItem() {
    const newItems = items.slice(0);
    newItems.push({ id: `item${uid++}`, complete: false, text: '' });
    setItems(newItems);
  }

  return (
    <main className="app">
      {items.map(item => (
        <TodoItem
          key={item.id}
          id={item.id}
          complete={item.complete}
          onCompleteChange={onTodoComplete}
          onDelete={onTodoDelete}
          onTextChange={onTodoText}
        >
          {item.text}
        </TodoItem>
      ))}
      <TodoAddItem onAdd={onAddItem} />
    </main>
  );
}

export default App;
