import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Pagination, Row, Space, Table } from 'antd';
// Card 把 Col Row 包裹起来，使底色变成白色
// Col Row 分栏布局
import { useRequest } from '@umijs/max';
import { useEffect, useState } from 'react';

import ActionBuilder from './Builder/ActionBuilder';
import ColumnBuilder from './Builder/ColumnBuilder';
import Modal from './components/Modal';
import styles from './index.less';

const BasicList = () => {
  const [page, setPage] = useState(1);
  const [per_page, setPerPage] = useState(10);
  const [sort, setSort] = useState('id');
  const [order, setOrder] = useState('desc'); // 排序方式，asc 升序，desc 降序
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalUri, setModalUri] = useState(
    'https://public-api-v2.aspirantzhang.com/api/admins/add?X-API-KEY=antd',
  );

  // useRequest 请求数据, 必须使用 localhost:8000 才能访问到输入，因为后端返回的 Access-Control-Allow-Origin 是 http://localhost:8000
  const init = useRequest<{ data: BasicListApi.Data }>(
    `https://public-api-v2.aspirantzhang.com/api/admins?X-API-KEY=antd&page=${page}&per_page=${per_page}&sort=${sort}&order=${order}`,
  );

  // 分页-表格排序, 当 page 或者 per_page 变化时，重新请求数据
  useEffect(() => {
    init.run();
  }, [page, per_page, sort, order]);

  const paginationChangeHandler = (_page: number, _per_page: number) => {
    setPage(_page);
    setPerPage(_per_page);
  };

  const beforeTableLayout = () => {
    return (
      <Row>
        <Col xs={24} sm={12}>
          ...
        </Col>
        <Col xs={24} sm={12} className={styles.tableToolbar}>
          <Space>{ActionBuilder(init?.data?.layout?.tableToolBar)}</Space>
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
            showTotal={(total) => `${total}项`}
            onChange={paginationChangeHandler}
            onShowSizeChange={paginationChangeHandler}
          />
        </Col>
      </Row>
    );
  };

  const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    if (sorter.columnKey) {
      // 重置分页
      setPage(1);
      // 设置排序
      setSort(sorter.columnKey);
      setOrder(sorter.order === 'ascend' ? 'asc' : 'desc');
    }
  };

  return (
    // PageContainer 添加页面小标题
    <PageContainer>
      <Button
        type="primary"
        onClick={() => {
          setModalUri('https://public-api-v2.aspirantzhang.com/api/admins/add?X-API-KEY=antd');
          setIsModalOpen(true);
        }}
      >
        新增
      </Button>
      <Button
        type="primary"
        onClick={() => {
          setModalUri('https://public-api-v2.aspirantzhang.com/api/admins/206?X-API-KEY=antd');
          setIsModalOpen(true);
        }}
      >
        编辑
      </Button>
      <Card>
        {beforeTableLayout()}
        <Table
          rowKey="id" // 设置行的唯一标识
          dataSource={init?.data?.dataSource} // 表格数据
          columns={ColumnBuilder(init?.data?.layout.tableColumn)} // 表格列配置
          pagination={false} // 关闭默认分页
          loading={init?.loading} // 显示加载中效果
          onChange={onChange}
        />
        {afterTableLayout()}
      </Card>
      {Modal({
        isOpen: isModalOpen,
        onCancleHandler: () => setIsModalOpen(false),
        modalUri: modalUri,
      })}
    </PageContainer>
  );
};

export default BasicList;
