import {
  createHttpLink, ApolloClient, InMemoryCache, gql,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { APOLLO_URL } from './config';

const httpLink = createHttpLink({
  uri: APOLLO_URL,
});

// pull the login token from localStorage every time a request is sent
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export const TODOS_QUERY = gql`
  query {
    todos {
      id
      content
      isDone
    }
  }
`;

export const CREATE_TODO = gql`
  mutation createTodo($content: String!) {
    createTodo(content: $content) {
      id
    }
  }
`;

export const REMOVE_TODO = gql`
  mutation removeTodo($id: String!) {
    removeTodo(id: $id)
  }
`;

export const UPDATE_TODO_ISDONE = gql`
  mutation updateTodo($id:String!, $isDone: Boolean) {
    updateTodo(id: $id, isDone: $isDone)
  }
`;

export const UPDATE_TODO_CONTENT = gql`
  mutation updateTodo($id:String!, $content: String) {
    updateTodo(id: $id, content: $content)
  }
`;
