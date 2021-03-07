import 'fake-indexeddb/auto';
import { TodosDb } from './todos-db';

describe('TodosDb', () => {
  let todosDb: TodosDb;

  beforeEach(() => {
    if (todosDb) {
      todosDb.reset();
    }
    todosDb = new TodosDb();
  });

  it(`opens a database and returns a reference to the TodosDb instance`, async () => {
    await todosDb.open().then((result: TodosDb) => expect(result).toBe(todosDb));
  });
  it(`opens a database with one initial item`, async () => {
    await todosDb.open().then(async () => {
      await todosDb.readAllTodos().then(todos => expect(todos.length).toBe(1));
    });
  });
  it(`can read an item from the database`, async () => {
    await todosDb.open().then(async () => {
      await todosDb.readAllTodos().then(async todos => {
        await todosDb.readTodo(todos[0].id).then(todo => {
          expect(todo.id).toBe(todos[0].id);
          expect(todo.complete).toBe(false);
          expect(todo.text).toBeDefined();
        })
      });
    });
  });
  it(`returns an error message if it cannot read an item from the database`, async () => {
    await todosDb.open().then(async () => {
      await todosDb.readAllTodos().then(async todos => {
        // 0 cannot be an id because autoIncremeneted id's start at 1.
        await todosDb.readTodo(0).catch(error => {
          expect(typeof error).toBe('string');
        });
      });
    });
  });
  it(`creates an item in the database`, async () => {
    let id = -1;
    await todosDb.open();
    await todosDb.createTodo({ text: 'all new todo' }).then(todo => {
      expect(todo.text).toBe('all new todo');
      expect(todo.complete).toBe(false);
      expect(todo.id).toBeGreaterThan(0);
      id = todo.id;
    });
    await todosDb.readTodo(id).then(todo => {
      expect(todo.text).toBe('all new todo');
      expect(todo.complete).toBe(false);
      expect(todo.id).toBe(id);
    });
  });
  it(`updates an item in the database`, async () => {
    await todosDb.open();
    await todosDb.readAllTodos().then(async todos => {
      await todosDb.updateTodo(todos[0].id, { text: 'UPDATED' });
      await todosDb.readTodo(todos[0].id).then(todo => {
        expect(todo.id).toBe(todos[0].id);
        expect(todo.text).toBe('UPDATED');
      });
    });
  });
  it(`deletes an item in the database`, async () => {
    await todosDb.open();
    await todosDb.readAllTodos().then(async todos => {
      expect(todos.length).toBe(1);
      await todosDb.deleteTodo(todos[0].id);
      await todosDb.readTodo(todos[0].id).catch(error => {
        expect(typeof error).toBe('string');
      });
    });
    await todosDb.readAllTodos().then(async todos => {
      expect(todos.length).toBe(0);
    });
  });
});
