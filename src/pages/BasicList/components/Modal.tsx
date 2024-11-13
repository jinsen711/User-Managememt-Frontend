import { useRequest } from '@umijs/max';
import { Modal as AntdModal, Form } from 'antd';
import { useEffect } from 'react';
import ActionBuilder from '../Builder/ActionBuilder';
import FormBuilder from '../Builder/FormBuilder';

const Modal = ({
  isOpen,
  onCancleHandler,
  modalUri,
}: {
  isOpen: boolean;
  onCancleHandler: () => void;
  modalUri: string;
}) => {
  // 表单布局
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };

  // TODO: 每次加载时，modalUri 是空，导致请求失败，需要优化
  const init = useRequest<{ data: PageApi.Data }>(`${modalUri}`);
  // 当 modalUri 发生变化，且 isOpen 为 true 时，重新请求数据
  useEffect(() => {
    if (isOpen) {
      init.run();
    }
  }, [isOpen]);
  return (
    <div>
      <AntdModal
        title={init?.data?.page?.title}
        open={isOpen}
        onCancel={onCancleHandler}
        footer={ActionBuilder(init?.data?.layout?.actions[0].data)}
      >
        <Form {...formItemLayout}>{FormBuilder(init?.data?.layout?.tabs[0]?.data)}</Form>
      </AntdModal>
    </div>
  );
};

export default Modal;
