import React from 'react';
import { render } from '@testing-library/react';
import { TodoContext } from './todo-context';

describe('TodoContext', () => {
  it(`creates a context`, () => {
    const C: React.FC = () => {
      const context = React.useContext(TodoContext);
      expect(context.idJustAdded).toBe(-1);
      expect(context.idNextFocus).toBe(-1);
      expect(context.clearIdJustAdded(1)).toBe(undefined);
      expect(context.clearNextFocus(1)).toBe(undefined);
      return (<p>test component</p>);
    };
    render(<C />);
  });
});
