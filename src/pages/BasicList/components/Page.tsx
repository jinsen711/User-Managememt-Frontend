import { FooterToolbar, PageContainer } from '@ant-design/pro-components';
import { history, useLocation, useRequest } from '@umijs/max';
import { Card, Col, Form, Input, message, Row, Space, Tabs } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import ActionBuilder from '../Builder/ActionBuilder';
import FormBuilder from '../Builder/FormBuilder';
import { setFieldsApadtor, submitFieldsAdaptor } from '../helper';

const Page = () => {
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

  // Tab 页
  const { TabPane } = Tabs;

  // 使用 useForm, 在外部控制复制 modal 中呈现的数据
  const [form] = Form.useForm();

  // 获取接口 uri
  const location = useLocation();
  const pageUri = location.pathname.replace('/basic-list', '');

  const init = useRequest<{ data: BasicListApi.PageData }>(
    `https://public-api-v2.aspirantzhang.com${pageUri}?X-API-KEY=antd`,
    {
      // 发送错误时返回
      onError: () => {
        history.back();
      },
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
        history.back();
      },
      formatResult(res) {
        return res;
      },
    },
  );

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
        // 返回上一页
        history.back();
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
    // TODO: 加载中...
    <div>
      <PageContainer title={init?.data?.page?.title} loading={init?.loading}>
        <Row gutter={24}>
          <Col xs={24} sm={18}>
            <Form
              {...formItemLayout}
              form={form}
              onFinish={onFinish}
              initialValues={{ create_time: moment(), update_time: moment(), status: false }}
            >
              <Tabs type="card">
                {(init?.data?.layout?.tabs || []).map((tab) => {
                  return (
                    <TabPane tab={tab.title} key={tab.title}>
                      <Card>
                        {FormBuilder(tab.data)}
                        <Form.Item key="uri" name="uri" hidden>
                          <Input />
                        </Form.Item>
                        <Form.Item key="method" name="method" hidden>
                          <Input />
                        </Form.Item>
                      </Card>
                    </TabPane>
                  );
                })}
              </Tabs>
            </Form>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Space>
                {(init?.data?.layout?.actions || []).map((action) => {
                  return ActionBuilder(action.data, actionHandler);
                })}
              </Space>
            </Card>
          </Col>
        </Row>

        <FooterToolbar>
          <Space>
            {(init?.data?.layout?.actions || []).map((action) => {
              return ActionBuilder(action.data, actionHandler);
            })}
          </Space>
        </FooterToolbar>
      </PageContainer>
    </div>
  );
};

export default Page;
