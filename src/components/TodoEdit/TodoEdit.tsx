import React, { FC } from 'react';
import {
  Row, Col, Button, Input,
} from 'antd';

type TodoProps = {
  newContent?: string;
  handleEditing: (value: string) => void;
  handleEditOk: () => void;
};

const TodoEdit: FC<TodoProps> = ({
  newContent, handleEditing, handleEditOk,
}: TodoProps) => (
  <Row>
    <Col span={20}>
      <Input
        placeholder="Thing to do"
        value={newContent}
        onChange={(e) => handleEditing(e.target.value)}
      />
    </Col>
    <Col span={4}>
      <Button onClick={handleEditOk}>OK</Button>
    </Col>
  </Row>
);

export default TodoEdit;
