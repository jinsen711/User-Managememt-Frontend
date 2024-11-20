import { ExclamationCircleOutlined } from '@ant-design/icons';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import { useRequest } from '@umijs/max';
import { Modal as AntdModal, Card, Col, Pagination, Row, Space, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import ActionBuilder from './Builder/ActionBuilder';
import ColumnBuilder from './Builder/ColumnBuilder';
import Modal from './components/Modal';
import styles from './index.less';

export type Key = React.Key;

const BasicList = () => {
  const [page, setPage] = useState(1);
  const [per_page, setPerPage] = useState(10);
  const [sort, setSort] = useState('id');
  const [order, setOrder] = useState('desc'); // 排序方式，asc 升序，desc 降序
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalUri, setModalUri] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectedRows, setSelectRows] = useState<BasicListApi.DataSource[]>([]);
  const [tableColumns, setTableColumns] = useState<BasicListApi.Field[]>([]);

  const { confirm } = AntdModal;

  // useRequest 请求数据, 必须使用 localhost:8000 才能访问到输入，因为后端返回的 Access-Control-Allow-Origin 是 http://localhost:8000
  const init = useRequest<{ data: BasicListApi.ListData }>(
    `https://public-api-v2.aspirantzhang.com/api/admins?X-API-KEY=antd&page=${page}&per_page=${per_page}&sort=${sort}&order=${order}`,
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
          ...formValues,
          'X-API-KEY': 'antd',
        },
      };
    },
    {
      manual: true, // 手动模式，防止重复请求
      onSuccess: (res) => {
        message.success({ content: res.message, key: 'process' });
      },

      formatResult(res) {
        return res;
      },
    },
  );

  // 删除弹窗时显示的列表
  const batchVoerview = () => {
    return (
      <Table
        size="small"
        rowKey={'id'}
        dataSource={selectedRows} // 表格数据
        columns={[tableColumns[0], tableColumns[1]]} // 表格列配置
        pagination={false} // 关闭默认分页
      />
    );
  };

  // 按钮功能
  const actionHandler = (action: BasicListApi.Action, record: BasicListApi.DataSource) => {
    switch (action.action) {
      case 'modal':
        setModalUri(
          action.uri.replace(/:\w+/g, (field) => {
            return record[field.replace(':', '')];
          }),
        );
        setIsModalOpen(true);
        break;
      case 'reload':
        init.run();
        break;
      case 'delete':
        confirm({
          icon: <ExclamationCircleOutlined />,
          title: '是否删除一下内容',
          content: batchVoerview(),
          okText: '删除',
          okType: 'danger',
          onOk() {
            return request.run({
              uri: action.uri,
              method: action.method,
              type: 'delete',
              ids: selectedRowKeys,
            });
          },
        });
        break;
      default:
        console.log(`当前未做处理 ${action.action}`);
    }
  };

  // 分页-表格排序, 当 page 或者 per_page 变化时，重新请求数据
  useEffect(() => {
    init.run();
  }, [page, per_page, sort, order]);
  const paginationChangeHandler = (_page: number, _per_page: number) => {
    setPage(_page);
    setPerPage(_per_page);
  };
  const onChange = (_: any, __: any, sorter: any) => {
    if (sorter.columnKey) {
      // 重置分页
      setPage(1);
      // 设置排序
      setSort(sorter.columnKey);
      setOrder(sorter.order === 'ascend' ? 'asc' : 'desc');
    }
  };

  // 自动构建 Table Column
  useEffect(() => {
    if (init.data?.layout.tableColumn) {
      setTableColumns(ColumnBuilder(init?.data?.layout?.tableColumn, actionHandler));
    }
  }, [init.data?.layout.tableColumn]);

  // 多选功能
  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (_selectedRowKeys: Key[], _selectedRows: BasicListApi.DataSource[]) => {
      setSelectedRowKeys(_selectedRowKeys);
      setSelectRows(_selectedRows);
    },
  };

  const beforeTableLayout = () => {
    return (
      <Row>
        <Col xs={24} sm={12}>
          ...
        </Col>
        <Col xs={24} sm={12} className={styles.tableToolbar}>
          <Space>{ActionBuilder(init?.data?.layout?.tableToolBar, actionHandler)}</Space>
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

  // 多选删除功能
  const batchToolBar = () => {
    return (
      selectedRowKeys.length > 0 && (
        <Space>{ActionBuilder(init?.data?.layout?.batchToolBar, actionHandler)}</Space>
      )
    );
  };

  return (
    // PageContainer 添加页面小标题
    <PageContainer>
      <Card>
        {beforeTableLayout()}
        <Table
          rowKey="id" // 设置行的唯一标识
          dataSource={init?.data?.dataSource} // 表格数据
          columns={tableColumns} // 表格列配置
          pagination={false} // 关闭默认分页
          loading={init?.loading} // 显示加载中效果
          onChange={onChange}
          rowSelection={rowSelection}
        />
        {afterTableLayout()}
      </Card>

      {/* 底部工具栏 */}
      <FooterToolbar>{batchToolBar()}</FooterToolbar>

      {/* 弹窗，默认是关闭状态，通过按钮等方式触发显示 */}
      {Modal({
        isOpen: isModalOpen,
        closeModal: (reload: boolean = false) => {
          setIsModalOpen(false);
          // 根据 reload 参数判断是否刷新页面
          if (reload) {
            init.run();
          }
        },
        modalUri: modalUri,
      })}
    </PageContainer>
  );
};

export default BasicList;
