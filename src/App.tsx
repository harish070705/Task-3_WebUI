
import React, { useState, useEffect, useCallback } from 'react';
import {
  Layout,
  Typography,
  Input,
  Button,
  Space,
  message,
  notification,
  ConfigProvider,
  theme,
} from 'antd';
import { PlusOutlined, ThunderboltFilled } from '@ant-design/icons';
import * as api from './services/api';
import { Task, NewTask, TaskExecution } from './types';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import RunResultModal from './components/RunResultModal';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;
const { Search } = Input;

const App: React.FC = () => {
  // --- State ---
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningTaskId, setRunningTaskId] = useState<string | null>(null);

  // Form Modal State
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Execution Result Modal State
  const [isExecModalVisible, setIsExecModalVisible] = useState(false);
  const [executionResult, setExecutionResult] = useState<TaskExecution | null>(null);

  //  Data Fetching 
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (error) {
      notification.error({
        message: 'Failed to fetch tasks',
        description: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  //  Event Handlers 
  const handleSearch = async (value: string) => {
    setLoading(true);
    try {
      const data = value ? await api.searchTasks(value) : await api.getTasks();
      setTasks(data);
    } catch (error) {
      message.error(`Search failed: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (task: Task | NewTask) => {
    try {
      await api.saveTask(task);
      setIsFormModalVisible(false);
      fetchTasks(); 
    } catch (error: any) {
      // The backend sends a 400 with a clear message
      const errorMsg = error.response?.data?.message || 'Failed to save task';
      notification.error({
        message: 'Save Failed',
        description: errorMsg,
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteTask(id);
      message.success('Task deleted successfully');
      fetchTasks(); 
    } catch (error) {
      notification.error({
        message: 'Failed to delete task',
        description: (error as Error).message,
      });
    }
  };

  const handleRun = async (id: string) => {
    setRunningTaskId(id);
    try {
      const result = await api.runTask(id);
      setExecutionResult(result);
      setIsExecModalVisible(true);
      fetchTasks(); // Refresh list to get new execution history
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to run task';
      notification.error({
        message: 'Execution Failed',
        description: errorMsg,
      });
    } finally {
      setRunningTaskId(null);
    }
  };

  //  Modal Triggers 
  const showCreateModal = () => {
    setSelectedTask(null);
    setIsFormModalVisible(true);
  };

  const showEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsFormModalVisible(true);
  };

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <Layout className="app-layout">
        <Header className="app-header">
          <Title level={2} style={{ color: 'white', margin: 0 }}>
            
            Task Runner Application
          </Title>
        </Header>

        <Content className="app-content">
          <div className="content-container">
            <div className="toolbar">
              <Search
                placeholder="Search tasks by name..."
                onSearch={handleSearch}
                enterButton
                style={{ width: 400 }}
                aria-label="Search tasks by name"
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={showCreateModal}
              >
                Create Task
              </Button>
            </div>

            <TaskList
              tasks={tasks}
              loading={loading}
              runningTaskId={runningTaskId}
              onEdit={showEditModal}
              onDelete={handleDelete}
              onRun={handleRun}
            />
          </div>
        </Content>

        
      </Layout>

      {/* --- Modals --- */}
      <TaskForm
        visible={isFormModalVisible}
        onCancel={() => setIsFormModalVisible(false)}
        onSave={handleSave}
        initialData={selectedTask}
      />

      <RunResultModal
        visible={isExecModalVisible}
        onClose={() => setIsExecModalVisible(false)}
        execution={executionResult}
      />
    </ConfigProvider>
  );
};

export default App;