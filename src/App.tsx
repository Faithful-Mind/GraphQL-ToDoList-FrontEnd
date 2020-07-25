import React, { useState, useEffect } from 'react';
import {
  Button, Input, Row, Col,
} from 'antd';
import { ApolloClient, NormalizedCacheObject, useQuery } from '@apollo/client';

import './App.css';
import TodoItem, { Todo } from './components/TodoItem/TodoItem';
import { AUTH_URL } from './config';
import {
  TODOS_QUERY, CREATE_TODO, REMOVE_TODO, UPDATE_TODO_ISDONE, UPDATE_TODO_CONTENT,
} from './graphql-client';

function App({ client }: { client: ApolloClient<NormalizedCacheObject> }) {
  const [newTodo, setNewTodo] = useState('');
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      fetch(AUTH_URL)
        .then((resp) => resp.text())
        .then((token) => localStorage.setItem('token', token));
    }
  }, []);
  async function handleAdd() {
    await client.mutate({
      mutation: CREATE_TODO,
      variables: { content: newTodo },
      update: (cache, { data: { createTodo } }) => {
        const { todos } = cache.readQuery({ query: TODOS_QUERY }) as { todos: Todo[] };
        cache.writeQuery({
          query: TODOS_QUERY,
          // createTodo only has a id, but it worked as if there is content
          data: { todos: todos.concat([createTodo]) },
        });
      },
    });
    setNewTodo('');
  }
  function handleRemove(id: string) {
    return client.mutate({
      mutation: REMOVE_TODO,
      variables: { id },
      update: (cache, { data: { removeTodo } }) => {
        if (!removeTodo) throw new Error('remove failed');
        const { todos } = cache.readQuery({ query: TODOS_QUERY }) as { todos: Todo[] };
        cache.writeQuery({
          query: TODOS_QUERY,
          data: { todos: todos.filter((e) => e.id !== id) },
        });
      },
    });
  }
  function handleClickDone(id: string) {
    const todo = (client.cache.readQuery({ query: TODOS_QUERY }) as { todos: Todo[] })
      .todos.find((e) => e.id === id);
    return client.mutate({
      mutation: UPDATE_TODO_ISDONE,
      variables: { id, isDone: !todo!.isDone },
      update: (cache, { data: { updateTodo } }) => {
        if (!updateTodo) throw new Error('update failed');
        const { todos } = cache.readQuery({ query: TODOS_QUERY }) as { todos: Todo[] };
        cache.writeQuery({
          query: TODOS_QUERY,
          data: {
            todos: todos.map((e) => (e.id === id ? { ...e, isDone: !e.isDone } : e)),
          },
        });
      },
    });
  }
  function handleEdit(id: string, value: string) {
    return client.mutate({
      mutation: UPDATE_TODO_CONTENT,
      variables: { id, content: value },
      update: (cache, { data: { updateTodo } }) => {
        if (!updateTodo) throw new Error('update failed');
        const { todos } = cache.readQuery({ query: TODOS_QUERY }) as { todos: Todo[] };
        cache.writeQuery({
          query: TODOS_QUERY,
          data: {
            todos: todos.map((e) => (e.id === id ? { ...e, content: value } : e)),
          },
        });
      },
    });
  }

  // todo item list
  const { loading, error, data } = useQuery(TODOS_QUERY);
  let itemList: JSX.Element;
  if (loading) {
    itemList = <span>Loading...</span>;
  } else if (error) {
    itemList = <span>{`Error! ${error.message}`}</span>;
  } else {
    itemList = (
      <div className="todo-box">
        {data.todos.map((e: Todo) => (
          <TodoItem
            id={e.id}
            content={e.content}
            isDone={e.isDone}
            key={e.id}
            handleClickDone={handleClickDone}
            handleRemove={handleRemove}
            handleEdit={handleEdit}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="App">
      <Row>
        <Col span={20}>
          <Input
            placeholder="Thing to do"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
        </Col>
        <Col span={4}>
          <Button type="primary" onClick={handleAdd}>+</Button>
        </Col>
      </Row>
      {itemList}
    </div>
  );
}

export default App;
