import { useRequest } from '@umijs/max';
import { Modal as AntdModal, Form, Input, message } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import ActionBuilder from '../Builder/ActionBuilder';
import FormBuilder from '../Builder/FormBuilder';
import { setFieldsApadtor, submitFieldsAdaptor } from '../helper';

const Modal = ({
  isOpen,
  closeModal,
  modalUri,
}: {
  isOpen: boolean;
  closeModal: (reload?: boolean) => void;
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

  const init = useRequest<{ data: BasicListApi.PageData }>(
    `https://public-api-v2.aspirantzhang.com${modalUri}?X-API-KEY=antd`,
    {
      manual: true, // 手动模式，防止重复请求
    },
  );
  const request = useRequest(
    (data) => {
      // 显示 loading
      message.loading({ content: 'processing...', key: 'process', duration: 0 });
      // 发送请求
      const { uri, method, ...formValues } = data;
      return {
        url: `https://public-api-v2.aspirantzhang.com${uri}`,
        method: method,
        data: {
          ...submitFieldsAdaptor(formValues),
          'X-API-KEY': 'antd',
        },
      };
    },
    {
      manual: true, // 手动模式，防止重复请求
      onSuccess: (res) => {
        message.success({ content: res.message, key: 'process' });
        // 关闭 modal
        closeModal(true);
      },
      formatResult(res) {
        return res;
      },
    },
  );

  // 当 modalUri 发生变化，且 isOpen 为 true 时，重新请求数据
  useEffect(() => {
    if (isOpen) {
      // 清除原有的表单数据
      form.resetFields();
      // 请求数据
      init.run();
    }
  }, [isOpen]);

  // 弹窗打开时设置弹窗中的值
  useEffect(() => {
    if (init?.data?.dataSource) {
      form.setFieldsValue(setFieldsApadtor(init?.data));
    }
  }, [init?.data]);

  // 发送请求
  const onFinish = (formValues: BasicListApi.DataSource) => {
    request.run(formValues);
  };

  const actionHandler = (action: BasicListApi.Action) => {
    switch (action.action) {
      case 'submit':
        // 添加额外的 uri 和 method 字段
        form.setFieldsValue({ uri: action.uri, method: action.method });
        // 提交表单
        form.submit();
        break;
      case 'cancel':
        // 关闭弹窗
        closeModal();
        break;
      case 'reset':
        // 初始化弹窗内容.清空，如何原来有内容，添加上去
        form.resetFields();
        form.setFieldsValue(setFieldsApadtor(init?.data));
        break;
      default:
        console.log('暂不支持的操作', action);
        break;
    }
  };

  return (
    <AntdModal
      title={init?.data?.page?.title}
      open={isOpen}
      // closeModal 和 onCalcel 的类型不一样，解释思路，传递一个没有参数的函数，在这个函数中执行 closeModal
      onCancel={() => {
        closeModal();
      }}
      maskClosable={false} // 点击蒙层不允许关闭
      loading={init?.loading}
      footer={ActionBuilder(init?.data?.layout?.actions[0].data, actionHandler, request?.loading)}
      forceRender // 解决一些报错
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
  );
};

export default Modal;
