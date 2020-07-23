import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

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
