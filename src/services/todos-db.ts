export class TodosDb {
  private request: IDBOpenDBRequest;

  constructor() {
    TodosDb.confirmIndexedDb();
    this.request = window.indexedDB.open('todosDb', 1);
    this.request.onupgradeneeded = this.onUpgradeNeeded.bind(this);
    this.request.onerror = this.onRequestError.bind(this);
    this.request.onsuccess = this.onRequestSuccess.bind(this);
  }

  private onUpgradeNeeded(event: IDBVersionChangeEvent) {
    //
  }

  private onRequestError(event: Event) {
    console.warn('An error occurred while using IndexedDB.');
  }

  private onRequestSuccess(event: any) {
    console.log(event, event.target.result);
  }

  private static confirmIndexedDb() {
    if (!window.indexedDB) {
      throw new Error('Your browser does not support all features of IndexedDB.');
    }
  }
}
