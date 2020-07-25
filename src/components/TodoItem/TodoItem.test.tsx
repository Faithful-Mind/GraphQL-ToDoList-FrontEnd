import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';

import TodoItem from './TodoItem';

let e = {
  id: '123456789012345678901234',
  content: 'eat meat',
  isDone: false,
};
function handleClickDone() {
  e.isDone = !e.isDone;
}
function handleEdit(id:string, content: string) {
  e.content = content;
}

const theElement = () => (
  <TodoItem
    id={e.id}
    content={e.content}
    isDone={e.isDone}
    handleClickDone={handleClickDone}
    handleRemove={jest.fn()}
    handleEdit={handleEdit}
  />
);

beforeEach(() => {
  e = {
    id: '123456789012345678901234',
    content: 'eat meat',
    isDone: false,
  };
});

afterEach(cleanup);

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

test('renders todo content', () => {
  const { getByText } = render(theElement());
  const contentElement = getByText(/eat meat/i);
  expect(contentElement).toBeInTheDocument();
});

test('todo content editing works', () => {
  const { getByText, getByDisplayValue, rerender } = render(theElement());

  const editBtnElement = getByText('Edit');
  fireEvent.click(editBtnElement);

  const editingElement = getByDisplayValue(/eat meat/i);
  fireEvent.change(editingElement, { target: { value: 'eat vegetables' } });

  const okBtnElement = getByText('OK');
  fireEvent.click(okBtnElement);
  rerender(theElement()); // miraculously works after manually rerender -_-!

  const contentElement = getByText(/eat vegetables/i);
  expect(contentElement).toBeInTheDocument();
});

test('click todo to mark as done', () => {
  const { getByText, rerender } = render(theElement());

  const contentElement = getByText(e.content);
  expect(contentElement).not.toHaveClass('done');
  fireEvent.click(contentElement);

  expect(e.isDone).toBe(true);
  rerender(theElement());
  expect(contentElement).toHaveClass('done');
});
