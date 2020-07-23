import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TodoItem from './TodoItem';

let e = { content: 'eat meat', isDone: false };
function handleClickDone() {
  e.isDone = !e.isDone;
}
function handleRemove() {
  e = { content: '', isDone: false };
}
function handleEdit(content: string) {
  e.content = content;
}

const theElement = () => (
  <TodoItem
    content={e.content}
    isDone={e.isDone}
    handleClickDone={handleClickDone}
    handleRemove={handleRemove}
    handleEdit={handleEdit}
  />
);

beforeEach(() => {
  e = { content: 'eat meat', isDone: false };
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
  userEvent.type(editingElement, 'eat vegetables');
  // miraculously works after manually rerender -_-!
  rerender(theElement());
  const okBtnElement = getByText('OK');
  fireEvent.click(okBtnElement);
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
