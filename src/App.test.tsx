import React from 'react';
import {
  render, cleanup, act, getByText as GetByText,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import App from './App';
import { TEST_API_URL, TEST_AUTH_URL } from './config';

let client: ApolloClient<any>;

const getElement = () => (
  <ApolloProvider client={client}>
    <App client={client} />
  </ApolloProvider>
);

afterEach(cleanup);

beforeAll(async () => {
  const authToken = await fetch(TEST_AUTH_URL).then((resp) => resp.text());
  client = new ApolloClient({
    uri: TEST_API_URL,
    headers: {
      authorization: `Bearer ${authToken || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjEwOGI2OWEyZDY0MDNjMzA5MjU5MjgiLCJpYXQiOjE1OTQ5MTk3ODV9.Bvwt6M1csG10_uR6Evo1rsADmDwqiPa5ib0NCsWiwdk'}`,
    },
    cache: new InMemoryCache(),
  });

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
  const { getByPlaceholderText } = render(getElement());
  const InputElement = getByPlaceholderText(/Thing to do/i);
  expect(InputElement).toBeInTheDocument();
});

describe('item list basic functions', () => {
  test('Adding todo works', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(getElement());
    expect(queryByText(/eat meat/i)).toBeNull();

    const inputElement = getByPlaceholderText(/Thing to do/i);
    await act(async () => {
      await userEvent.type(inputElement, 'eat meat');
    });

    const addBtnElement = getByText('+');
    await act(() => {
      userEvent.click(addBtnElement);
      // need to wait for requesting & updating jobs
      return new Promise((r) => setTimeout(r, 500));
    });

    const todoElement = getByText(/eat meat/i);
    expect(todoElement).toBeInTheDocument();

    expect(inputElement).toBeEmpty();
  });

  test('Removing todo works', async () => {
    const { getByText, queryByText } = render(getElement());
    // TODO: didn't find a good solution to check for query jobs
    await new Promise((r) => setTimeout(r, 500));

    const todoElement = getByText(/eat meat/i);
    expect(todoElement).toBeInTheDocument();

    if (todoElement.parentElement == null) throw new Error('null parent');

    const rmBtnElement = GetByText(todoElement.parentElement, '-');
    await act(async () => {
      userEvent.click(rmBtnElement);
      return new Promise((r) => setTimeout(r, 500));
    });

    expect(queryByText(/eat meat/i)).toBeNull();
  });
});
