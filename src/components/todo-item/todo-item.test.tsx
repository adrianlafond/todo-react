import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { TodoItem } from './todo-item';

describe('TodoItem >', () => {
  it(`calls onCompleteChange() when checkbox is clicked`, () => {
    const onCompleteChange = jest.fn();
    const itemEl = render(<TodoItem id={1} onCompleteChange={onCompleteChange} />);
    const checkbox = itemEl.getByTestId('todo-item__complete');
    expect(onCompleteChange.mock.calls.length).toBe(0);
    fireEvent.click(checkbox);
    expect(onCompleteChange.mock.calls.length).toBe(1);
    expect(onCompleteChange.mock.calls[0]).toEqual([1, true]);
  });

  it(`calls onDelete() when delete button and delete confirm button are clicked`, () => {
    const onDelete = jest.fn();
    const itemEl = render(<TodoItem id={1} onDelete={onDelete} />);
    expect(onDelete.mock.calls.length).toBe(0);
    fireEvent.click(itemEl.getByTestId('todo-item__delete'));
    fireEvent.click(itemEl.getByTestId('todo-item__delete-confirm'));
    expect(onDelete.mock.calls.length).toBe(1);
    expect(onDelete.mock.calls[0]).toEqual([1]);
  });

  it(`does not call onDelete() when delete button and delete cancel button are clicked`, () => {
    const onDelete = jest.fn();
    const itemEl = render(<TodoItem id={1} onDelete={onDelete} />);
    expect(onDelete.mock.calls.length).toBe(0);
    fireEvent.click(itemEl.getByTestId('todo-item__delete'));
    fireEvent.click(itemEl.getByTestId('todo-item__delete-cancel'));
    expect(onDelete.mock.calls.length).toBe(0);
  });
});
