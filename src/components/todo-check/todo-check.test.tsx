import React from 'react';
import { render } from '@testing-library/react';
import { TodoCheck } from './todo-check';

describe('TodoCheck >', () => {
  let onChange: (checked: boolean) => void;

  beforeEach(() => {
    onChange = jest.fn();
  })

  it('renders an <input type="checkbox">', () => {
    render(<TodoCheck onChange={onChange} />);
    const inputEl = document.querySelector('input[type=checkbox]');
    expect(inputEl).toBeInTheDocument();
  });

  it('displays as checked if prop "checked" is true', () => {
    render(<TodoCheck checked onChange={onChange} />);
    const checkEl = document.querySelector('.todo-check');
    expect(checkEl).toHaveClass('todo-check--checked');
  });
  it('does not display as checked if prop "checked" not true', () => {
    render(<>
      <TodoCheck checked={false} onChange={onChange} />
      <TodoCheck onChange={onChange} />
    </>);
    const checkEls = document.querySelectorAll('.todo-check');
    expect(checkEls[0]).not.toHaveClass('todo-check--checked');
    expect(checkEls[1]).not.toHaveClass('todo-check--checked');
  });

  it('calls onChange with correct checked on click', () => {
    render(<TodoCheck onChange={onChange} />);
    const checkbox = document.querySelector<HTMLInputElement>('[data-component=todo-check] input');

    // Toggle true:
    checkbox!.click();
    expect(onChange).toHaveBeenCalledWith(true);

    // Toggle false:
    checkbox!.click();
    expect(onChange).toHaveBeenCalledWith(false);
  });
});
