import React, { FC } from 'react';
import {
  Row, Col, Button, Input,
} from 'antd';

type TodoProps = {
  content: string;
  handleEdit: Function;
  handleEditOk: Function;
};

const TodoEdit: FC<TodoProps> = ({ content, handleEdit, handleEditOk }: TodoProps) => (
  <Row>
    <Col span={20}>
      <Input
        placeholder="Thing to do"
        value={content}
        onChange={(e) => handleEdit(e.target.value)}
      />
    </Col>
    <Col span={4}>
      <Button onClick={() => handleEditOk()}>OK</Button>
    </Col>
  </Row>
);

export default TodoEdit;
