import { useRequest } from '@umijs/max';
import { Modal as AntdModal, Form, Input } from 'antd';
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

  const request = useRequest(
    (data) => {
      const { uri, method, ...formValues } = data;
      return {
        url: `https://public-api-v2.aspirantzhang.com${uri}`,
        method: method,
        data: { ...formValues, 'X-API-KEY': 'antd' },
      };
    },
    {
      manual: true, // 手动模式，防止重复请求
    },
  );

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

  // TODO: 不知道这里的 values 是什么类型
  const onFinish = (values: any) => {
    const formValues = {
      ...values,
      create_time: moment(values.create_time).format(),
      update_time: moment(values.updated_time).format(),
    };
    request.run(formValues);
  };

  const actionHandler = (action: BasicListApi.Action) => {
    console.log(action);
    switch (action.action) {
      case 'submit':
        form.setFieldsValue({ uri: action.uri, method: action.method });
        form.submit();
        break;
      case 'update':
        break;
    }
  };

  return (
    <div>
      <AntdModal
        title={init?.data?.page?.title}
        open={isOpen}
        onCancel={onCancleHandler}
        maskClosable={false} // 点击蒙层不允许关闭
        footer={ActionBuilder(init?.data?.layout?.actions[0].data, actionHandler)}
      >
        <Form
          {...formItemLayout}
          form={form}
          onFinish={onFinish}
          initialValues={{ create_time: moment(), update_time: moment(), status: false }}
        >
          {FormBuilder(init?.data?.layout?.tabs[0]?.data)}
          <Form.Item key="uri" name="uri" hidden>
            <Input />
          </Form.Item>
          <Form.Item key="method" name="method" hidden>
            <Input />
          </Form.Item>
        </Form>
      </AntdModal>
    </div>
  );
};

export default Modal;
