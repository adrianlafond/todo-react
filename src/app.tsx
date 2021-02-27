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
  const focussedTodoId = React.useRef(-1);
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
    if (mode === 'none' && id === focussedTodoId.current) {
      focussedTodoId.current = -1;
    } else if (mode !== 'none') {
      focussedTodoId.current = id;
    }
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

  function onAddFocus() {
    focussedTodoId.current = 0;
    if (idNextFocus === 0) {
      setIdNextFocus(-1);
    }
  }

  function onAddBlur() {
    if (focussedTodoId.current === 0) {
      focussedTodoId.current = -1;
    }
  }

  // function onKeyDown(event: KeyboardEvent) {
  //   const up = event.key === 'ArrowUp';
  //   const down = event.key === 'ArrowDown';
  //   if (up || down) {
  //     const currentIndex = items.findIndex(item => item.id === focussedTodoId.current);
  //     document.body.focus();
  //     if (up && currentIndex > 0) {
  //       setIdNextFocus(items[currentIndex - 1].id);
  //     } else if (down && currentIndex < items.length - 1) {
  //       setIdNextFocus(items[currentIndex + 1].id);
  //     }
  //   }
  // }

  // function onReset() {
  //   db.current.reset();
  //   openDb();
  // }

  React.useEffect(openDb, []);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const up = event.key === 'ArrowUp';
      const down = event.key === 'ArrowDown';
      if (up || down) {
        const currentIndex = items.findIndex(item => item.id === focussedTodoId.current);
        document.body.focus();
        if (up) {
          if (focussedTodoId.current === 0) {
            setIdNextFocus(items[items.length - 1].id);
          } else if (currentIndex > 0) {
            setIdNextFocus(items[currentIndex - 1].id);
          } else {
            setIdNextFocus(focussedTodoId.current);
          }
        } else if (down) {
          if (currentIndex < items.length - 1 && currentIndex !== -1) {
            setIdNextFocus(items[currentIndex + 1].id);
          } else if (currentIndex === items.length - 1) {
            setIdNextFocus(0);
          } else {
            setIdNextFocus(focussedTodoId.current);
          }
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [items]);

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
          <TodoAddItem onAdd={onAddItem} onFocus={onAddFocus} onBlur={onAddBlur} />
          {/* <button onClick={onReset}>Reset DB</button> */}
        </div>
        <StatusBar todoStatus={todoStatus} />
      </main>
    </TodoContext.Provider>
  );
}

export default App;
