import React from 'react';
import { render } from '@testing-library/react';
import { TodoItem, CompleteChangeEvent } from './todo-item';
import { TodoCheckTestHarness } from '../todo-check/todo-check-test-harness';

describe('TodoItem >', () => {
  let onCompleteChange: (args: CompleteChangeEvent) => void;

  beforeEach(() => {
    onCompleteChange = jest.fn();
  })

  it('renders with a <TodoCheck>', () => {
    const itemEl = render(<TodoItem id="item0" onCompleteChange={onCompleteChange} />);
    const todoCheck = new TodoCheckTestHarness(itemEl.baseElement as HTMLElement);
    expect(todoCheck.hasTodoCheck()).toBe(true);
  });

  it(`calls onCompleteChange() when TodoCheck is clicked`, () => {
    const itemEl = render(<TodoItem id="item0" onCompleteChange={onCompleteChange} />);
    const todoCheck = new TodoCheckTestHarness(itemEl.baseElement as HTMLElement);
    expect(onCompleteChange).toHaveBeenCalledTimes(0);

    // toggle on
    todoCheck.click();
    expect(onCompleteChange).toHaveBeenCalledWith({ id: 'item0', complete: true });

    // toggle off
    todoCheck.click();
    expect(onCompleteChange).toHaveBeenCalledWith({ id: 'item0', complete: false });
  });
});
