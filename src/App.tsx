import React, { Component } from 'react';
import {
  Button, Input, Row, Col,
} from 'antd';
import { QueryResult, ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { Query } from '@apollo/react-components';

import './App.css';
import TodoItem, { Todo } from './components/TodoItem/TodoItem';
import { AUTH_URL } from './config';
import {
  TODOS_QUERY, CREATE_TODO, REMOVE_TODO, UPDATE_TODO_ISDONE, UPDATE_TODO_CONTENT,
} from './graphql-client';

class App extends Component<{ client: ApolloClient<NormalizedCacheObject> }, { newTodo: string }> {
  constructor(props: Readonly<{ client: ApolloClient<NormalizedCacheObject>; }>) {
    super(props);
    this.state = {
      newTodo: '',
    };
    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleClickDone = this.handleClickDone.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  async componentDidMount() {
    if (!localStorage.getItem('token')) {
      fetch(AUTH_URL)
        .then((resp) => resp.text())
        .then((token) => localStorage.setItem('token', token));
    }
  }

  async handleAdd() {
    await this.props.client.mutate({
      mutation: CREATE_TODO,
      variables: { content: this.state.newTodo },
      update: (cache, { data: { createTodo } }) => {
        const { todos } = cache.readQuery({ query: TODOS_QUERY }) as { todos: Todo[] };
        cache.writeQuery({
          query: TODOS_QUERY,
          // createTodo only has a id, but it worked as if there is content
          data: { todos: todos.concat([createTodo]) },
        });
      },
    });
    this.setState({
      newTodo: '',
    });
  }

  handleRemove(id: string) {
    return this.props.client.mutate({
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

  handleClickDone(id: string) {
    return this.props.client.query({ query: TODOS_QUERY })
      .then(({ data: { todos } }) => (todos as Todo[]).find((e) => e.id === id))
      .then((todo) => this.props.client.mutate({
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
      }));
  }

  handleEdit(id: string, value: string) {
    return this.props.client.mutate({
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

  render() {
    return (
      <div className="App">
        <Row>
          <Col span={20}>
            <Input
              placeholder="Thing to do"
              value={this.state.newTodo}
              onChange={(e) => this.setState({ newTodo: e.target.value })}
            />
          </Col>
          <Col span={4}>
            <Button type="primary" onClick={this.handleAdd}>+</Button>
          </Col>
        </Row>
        <Query query={TODOS_QUERY}>
          {({ loading, error, data }: QueryResult) => {
            if (loading) return <span>Loading...</span>;
            if (error) return <span>{`Error! ${error.message}`}</span>;
            return (
              <div className="todo-box">
                {data.todos.map((e: Todo) => (
                  <TodoItem
                    id={e.id}
                    content={e.content}
                    isDone={e.isDone}
                    key={e.id}
                    handleClickDone={this.handleClickDone}
                    handleRemove={this.handleRemove}
                    handleEdit={this.handleEdit}
                  />
                ))}
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default App;
