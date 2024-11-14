import { useRequest } from '@umijs/max';
import { Modal as AntdModal, Form } from 'antd';
import moment from 'moment';
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
  // 使用 useForm, 在外部控制复制 modal 中呈现的数据
  const [form] = Form.useForm();

  const init = useRequest<{ data: PageApi.Data }>(`${modalUri}`, {
    manual: true, // 手动模式，防止重复请求
  });

  const setFieldsApadtor = (data: PageApi.Data | undefined) => {
    const fieldsValue = {};
    if (data?.dataSource && data.layout) {
      data.layout.tabs.forEach((tab) => {
        tab.data.forEach((field) => {
          switch (field.type) {
            // TODO: 给对象赋值时的警告问题
            case 'datetime':
              fieldsValue[field.dataIndex] = moment(data.dataSource[field.dataIndex]);
              break;
            default:
              fieldsValue[field.dataIndex] = data.dataSource[field.dataIndex];
          }
        });
      });
      return fieldsValue;
    }
    return {};
  };

  // 当 modalUri 发生变化，且 isOpen 为 true 时，重新请求数据
  useEffect(() => {
    if (isOpen) {
      // 清除原有的表单数据
      form.resetFields();
      // 请求数据
      init.run();
    }
  }, [isOpen]);

  useEffect(() => {
    if (init?.data?.dataSource) {
      form.setFieldsValue(setFieldsApadtor(init?.data));
    }
  }, [init?.data]);

  return (
    <div>
      <AntdModal
        title={init?.data?.page?.title}
        open={isOpen}
        onCancel={onCancleHandler}
        maskClosable={false} // 点击蒙层不允许关闭
        footer={ActionBuilder(init?.data?.layout?.actions[0].data)}
      >
        <Form
          {...formItemLayout}
          form={form}
          initialValues={{ create_time: moment(), update_time: moment(), status: false }}
        >
          {FormBuilder(init?.data?.layout?.tabs[0]?.data)}
        </Form>
      </AntdModal>
    </div>
  );
};

export default Modal;
