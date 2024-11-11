import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Pagination, Row, Space, Table } from 'antd';
// Card 把 Col Row 包裹起来，使底色变成白色
// Col Row 分栏布局
import styles from './index.less';

const BasicList = () => {
  const dataSource = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
  ];

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    },
  ];

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
          <Pagination align="end" />
        </Col>
      </Row>
    );
  };
  return (
    // PageContainer 添加页面小标题
    <PageContainer>
      <Card>
        {beforeTableLayout()}
        {/* 关闭默认分页 */}
        <Table dataSource={dataSource} columns={columns} pagination={false} />
        {afterTableLayout()}
      </Card>
    </PageContainer>
  );
};

export default BasicList;
