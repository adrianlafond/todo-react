export class TodoCheckTestHarness {
  component: HTMLElement;

  constructor(parent: HTMLElement) {
    const el = parent.querySelector<HTMLElement>('[data-component=todo-check]');
    if (!el) {
      throw new Error(`TodoCheck component not found on ${parent}`);
    }
    this.component = el;
  }

  hasTodoCheck() {
    return !!this.component;
  }

  click() {
    this.component.querySelector<HTMLInputElement>('input[type=checkbox]')!.click();
  }
}