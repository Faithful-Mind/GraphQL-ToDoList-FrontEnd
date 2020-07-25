import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';
import './todo-item.css';

import TodoEdit from '../TodoEdit/TodoEdit';

type TodoProps = {
  handleClickDone: () => void;
  handleRemove: () => void;
  handleEdit: (value: string) => void;
} & Todo;

class TodoItem extends Component<TodoProps, { isEditing: boolean }> {
  constructor(props: Readonly<TodoProps>) {
    super(props);
    this.state = { isEditing: false };
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleEditOk = this.handleEditOk.bind(this);
  }

  handleEditClick() {
    this.setState((prevState) => ({
      isEditing: !prevState.isEditing,
    }));
  }

  handleEditOk() {
    this.setState((prevState) => ({
      isEditing: !prevState.isEditing,
    }));
  }

  render() {
    const {
      content, isDone, handleClickDone, handleRemove, handleEdit,
    } = this.props;
    if (!isDone) {
      if (!this.state.isEditing) {
        return (
          <Row>
            <Col span={18} onClick={handleClickDone}>
              {content}
            </Col>
            <Col span={2}>
              <Button onClick={this.handleEditClick}>Edit</Button>
            </Col>
            <Col span={4}>
              <Button onClick={handleRemove}>-</Button>
            </Col>
          </Row>
        );
      }
      return (
        // layouts for editing
        <TodoEdit
          content={content}
          handleEdit={handleEdit}
          handleEditOk={this.handleEditOk}
        />
      );
    }
    return (
      // layouts for done item
      <Row>
        <Col span={20} className="done" onClick={handleClickDone}>
          {content}
        </Col>
        <Col span={4}>
          <Button onClick={handleRemove}>-</Button>
        </Col>
      </Row>
    );
  }
}

export interface Todo {
  content: string;
  isDone: boolean;
}

export default TodoItem;
