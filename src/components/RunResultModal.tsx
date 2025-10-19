import React from 'react';
import { Modal, Descriptions, Typography } from 'antd';
import { TaskExecution } from '../types';

const { Paragraph } = Typography;

interface RunResultModalProps {
  visible: boolean;
  onClose: () => void;
  execution: TaskExecution | null;
}

const RunResultModal: React.FC<RunResultModalProps> = ({ visible, onClose, execution }) => {
  if (!execution) return null;

  return (
    <Modal
      title="Task Execution Result"
      open={visible}
      onCancel={onClose}
      onOk={onClose}
      width={720}
      footer={(_, { OkBtn }) => <OkBtn />}
    >
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Start Time">
          {new Date(execution.startTime).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="End Time">
          {new Date(execution.endTime).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>
      <Paragraph style={{ marginTop: 16, marginBottom: 8, fontWeight: 500 }}>
        Command Output:
      </Paragraph>
      <pre
        style={{
          backgroundColor: '#0e0c33ff',
          border: '1px solid #e8e8e8',
          padding: '12px',
          borderRadius: '4px',
          maxHeight: '400px',
          overflowY: 'auto',
          whiteSpace: 'pre-wrap', 
          wordBreak: 'break-all',
        }}
      >
        <code>{execution.output}</code>
      </pre>
    </Modal>
  );
};

export default RunResultModal;