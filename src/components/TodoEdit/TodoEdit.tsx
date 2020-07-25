import React, { FC } from 'react';
import {
  Row, Col, Button, Input,
} from 'antd';

type TodoProps = {
  id: string,
  content: string;
  handleEdit: (id: string, value: string) => void;
  handleEditOk: () => void;
};

const TodoEdit: FC<TodoProps> = ({
  id, content, handleEdit, handleEditOk,
}: TodoProps) => (
  <Row>
    <Col span={20}>
      <Input
        placeholder="Thing to do"
        value={content}
        onChange={(e) => handleEdit(id, e.target.value)}
      />
    </Col>
    <Col span={4}>
      <Button onClick={handleEditOk}>OK</Button>
    </Col>
  </Row>
);

export default TodoEdit;
