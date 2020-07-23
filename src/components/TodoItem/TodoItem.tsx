import React, { FC } from 'react';
import { Row, Col, Button } from 'antd';
import './todo-item.css';

interface TodoProps extends Todo {
  handleClickDone: Function;
  handleRemove: Function;
}

const TodoItem: FC<TodoProps> = ({ content, isDone, handleClickDone, handleRemove }) => {
  return isDone
    ? (
      <Row>
        <Col span={20} className='done' onClick={()=>handleClickDone()}>
          {content}
        </Col>
        <Col span={4}>
          <Button onClick={() => handleRemove()}>-</Button>
        </Col>
      </Row>
    ) : (
      <Row>
        <Col span={18} onClick={()=>handleClickDone()}>
          {content}
        </Col>
        <Col span={2}>
          <Button>Edit</Button>
        </Col>
        <Col span={4}>
          <Button onClick={() => handleRemove()}>-</Button>
        </Col>
      </Row>
    );
};

export interface Todo { content: string, isDone: boolean }

export default TodoItem;
