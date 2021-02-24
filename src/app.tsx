import React from 'react';

import { TodoContext } from './context/todo-context';
import { TodoItem, TodoMode } from './components/todo-item';
import { TodoAddItem } from './components/todo-add-item';
import { StatusBar } from './components/status-bar';
import { TodosDb, Todo } from './services/todos-db';
import './app.css';

function App() {
  const db = React.useRef(new TodosDb());
  const [idJustAdded, setIdJustAdded] = React.useState<number>(-1);
  const [idNextFocus, setIdNextFocus] = React.useState<number>(-1);
  const [todoStatus, setTodoStatus] = React.useState<{ id: number, mode: TodoMode } | null>(null);

  const [items, setItems] = React.useState<Todo[]>([]);

  function onTodoComplete(id: number, complete: boolean) {
    onUpdateItem(id, 'complete', complete);
  }

  function onTodoText(id: number, text: string) {
    onUpdateItem(id, 'text', text);
  }

  function onUpdateItem(id: number, prop: keyof Todo, value: string | boolean) {
    const newItems = items.slice(0);
    const item = newItems[items.findIndex(item => item.id === id)];
    if (prop === 'complete') {
      item.complete = value as boolean;
    } else if (prop === 'text') {
      item.text = value as string;
    }
    setItems(newItems);
    db.current.updateTodo(item.id, item);
  }

  function onTodoDelete(id: number) {
    const newItems = items.slice(0);
    const deleteIndex = newItems.findIndex(item => item.id === id);
    if (deleteIndex < newItems.length - 1) {
      setIdNextFocus(newItems[deleteIndex + 1].id);
    } else if (deleteIndex > 0) {
      setIdNextFocus(newItems[deleteIndex - 1].id);
    }
    setIdJustAdded(-1);
    newItems.splice(deleteIndex, 1);
    setItems(newItems);
    db.current.deleteTodo(id);
  }

  function onTodoModeChange(id: number, mode: TodoMode) {
    setTodoStatus({ id, mode });
  }

  function onAddItem() {
    db.current.createTodo({ text: 'What needs doing?' })
      .then((todo: Todo) => {
        setIdJustAdded(todo.id);
        setItems([ ...items, todo ]);
      })
      .catch(console.log);
  }

  function onReset() {
    db.current.reset();
    openDb();
  }

  const todoContext = React.useMemo(() => ({
    idJustAdded,
    idNextFocus,
    clearIdJustAdded: (id: number) => {
      if (id === idJustAdded) {
        setIdJustAdded(-1);
      }
    },
    clearNextFocus: (id: number) => {
      if (id === idNextFocus) {
        setIdNextFocus(-1);
      }
    },
  }), [
    idJustAdded,
    idNextFocus,
  ]);

  React.useEffect(openDb, []);

  function openDb() {
    db.current.open()
      .then(() => {
        db.current.readAllTodos()
          .then(todos => {
            setIdNextFocus(todos[0] ? todos[0].id : -1);
            setItems(todos);
          })
          .catch(console.log);
      })
      .catch(console.log);
  }

  return (
    <TodoContext.Provider value={todoContext}>
      <main className="app">
        <div className="app__content">
          {items.map(item => (
            <TodoItem
              key={`todo-${item.id}`}
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
          <button onClick={onReset}>Reset DB</button>
        </div>
        <StatusBar todoStatus={todoStatus} />
      </main>
    </TodoContext.Provider>
  );
}

export default App;
