import React, { Component } from 'react';
import { Button, Input, Row, Col } from 'antd';
import './App.css';
import TodoItem, { Todo } from './components/TodoItem/TodoItem';

interface State {
  todos: Todo[];
  newTodo: string;
}

class App extends Component<{}, State> {
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      todos: JSON.parse(localStorage.getItem('todos') ?? '[]'),
      newTodo: ''
    };
  }

  handleClickDone(index: number) {
    console.log('i: ' + index);
    this.setState({
      todos: this.state.todos.map((e, i) => i === index ? {...e, isDone: !e.isDone } : e)
    }, () => localStorage.setItem('todos', JSON.stringify(this.state.todos)));
  }

  handleAdd() {
    this.setState({
      todos: [{ content: this.state.newTodo, isDone: false }, ...this.state.todos],
      newTodo: ''
    }, () => localStorage.setItem('todos', JSON.stringify(this.state.todos)));
  }

  handleRemove(index: number) {
    this.setState({
      todos: this.state.todos.filter((e, i) => i !== index)
    }, () => localStorage.setItem('todos', JSON.stringify(this.state.todos)));
  }

  render() {
    return (
      <div className="App">
        <Row>
          <Col span={20}>
            <Input
              placeholder="Thing to do"
              value={this.state.newTodo}
              onChange={e => this.setState({ newTodo: e.target.value})}
            />
          </Col>
          <Col span={4}>
            <Button type="primary" onClick={() => this.handleAdd()}>+</Button>
          </Col>
        </Row>
        <div className="todo-box">
          {this.state.todos.map((e, i) =>
            <TodoItem
              {...e}
              key={i}
              handleClickDone={this.handleClickDone.bind(this, i)}
              handleRemove={this.handleRemove.bind(this, i)}
            />
          )}
        </div>
      </div>
    );
  }
}

export default App;
