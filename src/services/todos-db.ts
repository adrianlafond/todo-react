const DB_NAME = 'todos';
const STORE_NAME = 'todos';

/**
 *
 */
export class TodosDb {
  private db?: IDBDatabase;

  constructor() {
    TodosDb.confirmIndexedDb();
  }

  public reset() {
    this.db?.close();
    window.indexedDB.deleteDatabase(DB_NAME);
  }

  public open(): Promise<TodosDb> {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = this.onUpgradeNeeded.bind(this);
      request.onblocked = function () {
        console.log('Please close all other tabs with this site open so the database can be updated. Thank you.');
      };
      request.onerror = () => {
        reject('Todos will not be saved or restored because database failed to open.');
      };
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this);
      }
    });
  }

  public createTodo(todo: Partial<Todo>): Promise<Todo> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        const request = this.db.transaction([DB_NAME], 'readwrite')
          .objectStore(STORE_NAME)
          .add({ complete: false, text: '', ...todo });
        request.onsuccess = (event: any) => {
          this.readTodo(event.target.result)
            .then(resolve)
            .catch(console.log);
        };
        request.onerror = () => {
          reject('Todo was not created because a database error occurred.');
        }
      } else {
        reject(`Request to store a todo failed because database does not exist`);
      }
    });
  }

  public readTodo(id: number): Promise<Todo> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        const request = this.db.transaction([DB_NAME])
          .objectStore(STORE_NAME)
          .get(id);
        request.onsuccess = (event: any) => {
          if (event.target.result) {
            resolve(event.target.result as Todo);
          } else {
            reject(`No todo with id ${id} was found.`);
          }
        };
        request.onerror = () => {
          reject(`Todo with id ${id} could not be retrieved because a database error occurred.`);
        };
      } else {
        reject(`Request to read todo ${id} failed because database does not exist`);
      }
    });
  }

  public readAllTodos(): Promise<Todo[]> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        const request = this.db.transaction([DB_NAME]).objectStore(STORE_NAME).getAll();
        request.onsuccess = (event: any) => {
          resolve(event.target.result);
        };
        request.onerror = () => {
          reject(`Todos could not be retrieved because a database error occurred.`);
        };
      } else {
        reject(`Request to read all todos failed because database does not exist.`);
      }
    });
  }

  public updateTodo(id: number, update: Partial<Todo>): Promise<Todo['id']> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.readTodo(id)
          .then((todo: Todo) => {
            if (this.db) {
              const store = this.db.transaction([DB_NAME], 'readwrite').objectStore(STORE_NAME);
              const storeUpdate = store.put({ ...todo, ...update, id: todo.id });
              storeUpdate.onsuccess = (event: any) => {
                resolve(event.target.result);
              };
              storeUpdate.onerror = () => {
                reject(`Todo with id ${id} could not be updated because a database error occurred.`);
              };
            }
          })
          .catch(error => {
            reject(error);
          });
      } else {
        reject(`Request to read todo ${id} failed because database does not exist`);
      }
    });
  }

  public deleteTodo(id: number) {
    return new Promise((resolve, reject) => {
      if (this.db) {
        const request = this.db.transaction([DB_NAME], 'readwrite')
          .objectStore(STORE_NAME)
          .delete(id);
        request.onsuccess = () => {
          resolve(id);
        };
        request.onerror = (event: any) => {
          reject(event.target.result);
        }
      } else {
        reject(`Request to delete todo ${id} failed because database does not exist`);
      }
    });
  }

  // event is `any` because event, target, and result are all possibly null for
  // IDBVersionChangeEvent!
  private onUpgradeNeeded(event: any) {
    this.db = event.target.result;
    console.log('onUpgradeNeeded');

    // Version 1
    const objectStore = this.db!.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
    objectStore.createIndex('id', 'id', { unique: true });
    objectStore.createIndex('text', 'text', { unique: false });
    objectStore.createIndex('complete', 'complete', { unique: false });
    objectStore.createIndex('due', 'due', { unique: false });

    objectStore.add({ text: 'What do you need to do?', complete: false, due: 'Tuesday' });
  }

  private static confirmIndexedDb() {
    if (!window.indexedDB) {
      throw new Error('Todos will not be saved because your browser does not support IndexedDB.');
    }
  }
}

export interface Todo {
  id: number;
  text: string;
  complete: boolean;
  due: string;
}
