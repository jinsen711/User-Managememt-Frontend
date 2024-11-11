import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Pagination, Row, Space, Table } from 'antd';
// Card 把 Col Row 包裹起来，使底色变成白色
// Col Row 分栏布局
import { useRequest } from '@umijs/max';
import styles from './index.less';

const BasicList = () => {
  // useRequest 请求数据, 必须使用 localhost:8000 才能访问到输入，因为后端返回的 Access-Control-Allow-Origin 是 http://localhost:8000
  const init = useRequest<{ data: BasicListApi.Data }>(
    'https://public-api-v2.aspirantzhang.com/api/admins?X-API-KEY=antd',
  );
  console.log(init);

  const beforeTableLayout = () => {
    return (
      <Row>
        <Col xs={24} sm={12}>
          ...
        </Col>
        <Col xs={24} sm={12} className={styles.tableToolbar}>
          <Space>
            <Button type="primary">Add</Button>
            <Button type="primary">Add2</Button>
          </Space>
        </Col>
      </Row>
    );
  };
  const afterTableLayout = () => {
    return (
      <Row>
        <Col xs={24} sm={12}>
          ...
        </Col>
        <Col xs={24} sm={12} className={styles.tableToolbar}>
          <Pagination
            align="end"
            total={init?.data?.meta?.total || 0}
            current={init?.data?.meta?.page || 1}
            pageSize={init?.data?.meta?.per_page || 10}
            showSizeChanger
            showTotal={(total) => `总计${total}项`}
          />
        </Col>
      </Row>
    );
  };

  return (
    // PageContainer 添加页面小标题
    <PageContainer>
      <Card>
        {beforeTableLayout()}
        <Table
          dataSource={init?.data?.dataSource}
          columns={init?.data?.layout?.tableColumn.filter((item: any) => {
            return item.hideInColumn !== true;
          })}
          pagination={false}
          loading={init?.loading}
        />
        {afterTableLayout()}
      </Card>
    </PageContainer>
  );
};

export default BasicList;
