import React from 'react';
import { Table, Button, Space, Popconfirm, Tag, Spin, Empty, Typography } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import type { TableProps } from 'antd';
import { Task, TaskExecution } from '../types';

const { Text, Paragraph } = Typography;

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  runningTaskId: string | null;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onRun: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading,
  runningTaskId,
  onEdit,
  onDelete,
  onRun,
}) => {
  const columns: TableProps<Task>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      sorter: (a, b) => a.owner.localeCompare(b.owner),
    },
    {
      title: 'Command',
      dataIndex: 'command',
      key: 'command',
      render: (cmd) => <Tag color="blue">{cmd}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (status ? <Tag>{status}</Tag> : <Text type="secondary">N/A</Text>),
    },
    {
      title: 'History',
      dataIndex: 'taskExecutions',
      key: 'history',
      render: (executions: TaskExecution[]) => (
        <Space>
          <HistoryOutlined />
          {executions.length} {executions.length === 1 ? 'run' : 'runs'}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={runningTaskId === record.id ? <Spin /> : <PlayCircleOutlined />}
            onClick={() => onRun(record.id)}
            disabled={runningTaskId === record.id}
            aria-label={`Run task ${record.name}`}
          >
            Run
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            aria-label={`Edit task ${record.name}`}
          />
          <Popconfirm
            title="Delete this task?"
            description="Are you sure you want to delete this task? This action cannot be undone."
            onConfirm={() => onDelete(record.id)}
            okText="Yes, Delete"
            cancelText="No"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              aria-label={`Delete task ${record.name}`}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  
  const expandedRowRender = (record: Task) => {
    const nestedColumns: TableProps<TaskExecution>['columns'] = [
      {
        title: 'Start Time',
        dataIndex: 'startTime',
        key: 'startTime',
        render: (time) => new Date(time).toLocaleString(),
      },
      {
        title: 'End Time',
        dataIndex: 'endTime',
        key: 'endTime',
        render: (time) => new Date(time).toLocaleString(),
      },
      {
        title: 'Output (Preview)',
        dataIndex: 'output',
        key: 'output',
        render: (output: string) => (
          <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{output}</pre>
          </Paragraph>
        ),
      },
    ];

    return (
      <Table
        columns={nestedColumns}
        dataSource={record.taskExecutions}
        rowKey="startTime"
        pagination={false}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No execution history for this task."
            />
          ),
        }}
      />
    );
  };

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={tasks}
      loading={loading}
      expandable={{ expandedRowRender, rowExpandable: (record) => record.taskExecutions.length > 0 }}
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No tasks found. Click 'Create Task' to get started."
          />
        ),
      }}
    />
  );
};

export default TaskList;