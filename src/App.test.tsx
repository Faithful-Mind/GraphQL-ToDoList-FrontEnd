import React from 'react';
import { render, cleanup } from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import App from './App';

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

test('renders todo input box', () => {
  const { getByPlaceholderText } = render(<App />);
  const InputElement = getByPlaceholderText(/Thing to do/i);
  expect(InputElement).toBeInTheDocument();
});

describe('item list basic functions', () => {
  test('Adding todo works', () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<App />);
    expect(queryByText(/eat meat/i)).toBeNull();

    const inputElement = getByPlaceholderText(/Thing to do/i);
    userEvent.type(inputElement, 'eat meat');

    const addBtnElement = getByText('+');
    userEvent.click(addBtnElement);

    const todoElement = getByText(/eat meat/i);
    expect(todoElement).toBeInTheDocument();

    expect(inputElement).toBeEmpty();
  });

  test('Removing todo works', () => {
    const { getByText, queryByText } = render(<App />);

    const todoElement = getByText(/eat meat/i);
    expect(todoElement).toBeInTheDocument();

    const rmBtnElement = getByText('-');
    userEvent.click(rmBtnElement);

    expect(queryByText(/eat meat/i)).toBeNull();
  });
});
