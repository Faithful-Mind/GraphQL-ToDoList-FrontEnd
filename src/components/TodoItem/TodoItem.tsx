import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';
import './todo-item.css';

import TodoEdit from '../TodoEdit/TodoEdit';

interface TodoProps extends Todo {
  handleClickDone: Function;
  handleRemove: Function;
  handleEdit: Function;
}

class TodoItem extends Component<TodoProps, { isEditing: boolean }> {
  constructor(props: Readonly<TodoProps>) {
    super(props);
    this.state = { isEditing: false };
  }

  handleEditClick() {
    this.setState({
      isEditing: !this.state.isEditing
    });
  }

  handleEditOk() {
    this.setState({
      isEditing: !this.state.isEditing
    });
  }

  render() {
    const { content, isDone, handleClickDone, handleRemove, handleEdit } = this.props;
    return (!isDone)
      ? (
        (!this.state.isEditing) ? (
          <Row>
            <Col span={18} onClick={()=>handleClickDone()}>
              {content}
            </Col>
            <Col span={2}>
              <Button onClick={this.handleEditClick.bind(this)}>Edit</Button>
            </Col>
            <Col span={4}>
              <Button onClick={() => handleRemove()}>-</Button>
            </Col>
          </Row>
        ) : (
          // layouts for editing
          <TodoEdit
            content={content}
            handleEdit={handleEdit}
            handleEditOk={this.handleEditOk.bind(this)}
          />
        )
      ) : (
        // layouts for done item
        <Row>
          <Col span={20} className='done' onClick={()=>handleClickDone()}>
            {content}
          </Col>
          <Col span={4}>
            <Button onClick={() => handleRemove()}>-</Button>
          </Col>
        </Row>
      );
  }
};

export interface Todo { content: string, isDone: boolean }

export default TodoItem;
