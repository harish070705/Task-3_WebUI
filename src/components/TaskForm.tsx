import React, { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { Task, NewTask } from '../types';
import { validateCommand } from '../utils/validators';

interface TaskFormProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (task: Task | NewTask) => void;
  initialData: Task | null; 
}

const TaskForm: React.FC<TaskFormProps> = ({ visible, onCancel, onSave, initialData }) => {
  const [form] = Form.useForm();
  const isEditing = !!initialData;

  
  useEffect(() => {
    if (visible) {
      if (isEditing) {
        form.setFieldsValue(initialData);
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialData, form, isEditing]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const taskData = {
          ...initialData,
          ...values,
        };
        onSave(taskData);
        message.success(isEditing ? 'Task updated!' : 'Task created!');
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
        message.error('Please correct the form errors.');
      });
  };

  return (
    <Modal
      title={isEditing ? 'Edit Task' : 'Create New Task'}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText={isEditing ? 'Save Changes' : 'Create'}
      cancelText="Cancel"
      forceRender // Ensures form is available even when modal is not visible
    >
      <Form form={form} layout="vertical" name="task_form">
        <Form.Item
          name="name"
          label="Task Name"
          rules={[{ required: true, message: 'Please input the task name!' }]}
        >
          <Input placeholder="e.g., 'Check server uptime'" />
        </Form.Item>
        <Form.Item
          name="owner"
          label="Owner"
          rules={[{ required: true, message: "Please input the owner's name!" }]}
        >
          <Input placeholder="e.g., 'Admin Team'" />
        </Form.Item>
        <Form.Item
          name="command"
          label="Command"
          rules={[
            { required: true, message: 'Please input the command!' },
            { validator: validateCommand },
          ]}
          help={`Allowed: ${['echo', 'date', 'whoami', 'uptime', 'ls', 'cat', 'hostname'].join(', ')}`}
        >
          <Input placeholder="e.g., 'uptime' or 'ls -l /tmp'" />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status (Optional)"
        >
          <Input placeholder="e.g., 'Active', 'Pending'" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskForm;