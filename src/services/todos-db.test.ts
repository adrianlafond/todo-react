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
});
