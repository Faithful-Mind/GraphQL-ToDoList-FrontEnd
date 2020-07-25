import React, { useState } from 'react';
import { Row, Col, Button } from 'antd';
import './todo-item.css';

import TodoEdit from '../TodoEdit/TodoEdit';

type TodoProps = {
  handleClickDone: (id: string) => void;
  handleRemove: (id: string) => void;
  handleEdit: (id: string, value: string) => void;
} & Todo;

function TodoItem({
  id, content, isDone, handleClickDone, handleRemove, handleEdit,
}: TodoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState('');
  function handleEditClick() {
    setIsEditing(!isEditing);
    setNewContent(content);
  }
  function handleEditOk() {
    if (newContent) handleEdit(id, newContent);
    setIsEditing(!isEditing);
    setNewContent('');
  }
  function handleEditing(value: string) {
    setNewContent(value);
  }

  if (!isDone) {
    if (!isEditing) {
      return (
        <Row>
          <Col span={18} onClick={() => handleClickDone(id)}>
            {content}
          </Col>
          <Col span={2}>
            <Button onClick={handleEditClick}>Edit</Button>
          </Col>
          <Col span={4}>
            <Button onClick={() => handleRemove(id)}>-</Button>
          </Col>
        </Row>
      );
    }
    return (
      // layouts for editing
      <TodoEdit
        newContent={newContent}
        handleEditing={handleEditing}
        handleEditOk={handleEditOk}
      />
    );
  }
  return (
    // layouts for done item
    <Row>
      <Col span={20} className="done" onClick={() => handleClickDone(id)}>
        {content}
      </Col>
      <Col span={4}>
        <Button onClick={() => handleRemove(id)}>-</Button>
      </Col>
    </Row>
  );
}

export interface Todo {
  id: string;
  content: string;
  isDone: boolean;
}

export default TodoItem;
