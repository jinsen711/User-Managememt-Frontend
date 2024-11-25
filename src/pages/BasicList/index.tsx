import { ExclamationCircleOutlined } from '@ant-design/icons';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import { useRequest } from '@umijs/max';
import { Modal as AntdModal, Card, Col, Pagination, Row, Space, Table, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import ActionBuilder from './Builder/ActionBuilder';
import ColumnBuilder from './Builder/ColumnBuilder';
import Modal from './components/Modal';
import styles from './index.less';

export type Key = React.Key;

const BasicList = () => {
  const [pageQuery, setPageQuery] = useState('');
  const [sorterQuery, setSorterQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalUri, setModalUri] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectedRows, setSelectRows] = useState<BasicListApi.DataSource[]>([]);
  const [tableColumns, setTableColumns] = useState<BasicListApi.Field[]>([]);
  const tableColumnsRef = useRef(tableColumns);
  const { confirm } = AntdModal;
  // useRequest 请求数据, 必须使用 localhost:8000 才能访问到输入，因为后端返回的 Access-Control-Allow-Origin 是 http://localhost:8000
  const init = useRequest<{ data: BasicListApi.ListData }>(
    `https://public-api-v2.aspirantzhang.com/api/admins?X-API-KEY=antd${pageQuery}${sorterQuery}`,
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

  // 删除弹窗上渲染的列表
  const batchVoerview = (dataSource: BasicListApi.DataSource[]) => {
    return (
      <Table
        size="small"
        rowKey={'id'}
        dataSource={dataSource} // 表格数据
        columns={[tableColumnsRef.current[0], tableColumnsRef.current[1]]}
        pagination={false} // 关闭默认分页
      />
    );
  };

  // 按钮功能
  const actionHandler = (action: BasicListApi.Action, record: BasicListApi.DataSource) => {
    switch (action?.action) {
      case 'modal':
        setModalUri(
          (action?.uri || '').replace(/:\w+/g, (field) => {
            return record[field.replace(':', '')];
          }),
        );
        break;
      case 'reload':
        init.run();
        break;
      // TODO: 未做文本区分, 都是使用 delete 的文本
      case 'delete':
      case 'restore':
      case 'deletePermanently':
        confirm({
          icon: <ExclamationCircleOutlined />,
          title: '是否删除一下内容',
          content: batchVoerview(Object.keys(record).length ? [record] : selectedRows),
          okText: action.text,
          okType: action.type as any,
          onOk() {
            return request.run({
              uri: action.uri,
              method: action.method,
              type: action.action,
              ids: Object.keys(record).length ? [record.id] : selectedRowKeys,
            });
          },
        });
        break;
      case 'batchDisable':
        setSelectedRowKeys([]);
        break;
      default:
        console.log(`当前未做处理 ${action.action}`);
    }
  };

  // 分页-表格排序
  useEffect(() => {
    init.run();
  }, [pageQuery, sorterQuery]);

  // 自动构建 TableColumns
  useEffect(() => {
    if (init.data?.layout.tableColumn) {
      setTableColumns(ColumnBuilder(init?.data?.layout?.tableColumn, actionHandler));
    }
  }, [init.data?.layout.tableColumn]);

  // 保存 tableColumns, 防止出现闭包问题
  useEffect(() => {
    if (tableColumns) {
      tableColumnsRef.current = tableColumns;
    }
  }, [tableColumns]);

  // 当 modalUri 改变且不为空时打开弹窗
  useEffect(() => {
    if (modalUri) {
      setIsModalOpen(true);
    }
  }, [modalUri]);

  // 分页
  const paginationChangeHandler = (page: number, per_page: number) => {
    setPageQuery(`&page=${page}&per_page=${per_page}`);
  };

  // 排序
  const sorterChangeHandler = (_: any, __: any, sorter: any) => {
    if (sorter.order === undefined) {
      setSorterQuery('');
    } else {
      const orderBy = sorter.order === 'ascend' ? 'asc' : 'desc';
      setSorterQuery(`&sorter=${sorter.field}&order=${orderBy}`);
    }
  };

  // 关闭弹窗
  const closeModal = (reload: boolean = false) => {
    setIsModalOpen(false); // 关闭弹窗
    setModalUri(''); // 重置 modalUri
    // 根据 reload 参数判断是否刷新页面
    if (reload) {
      init.run();
    }
  };

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

  // 多选删除按钮渲染
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
          onChange={sorterChangeHandler}
          rowSelection={rowSelection}
        />
        {afterTableLayout()}
      </Card>

      {/* 底部工具栏 */}
      <FooterToolbar>{batchToolBar()}</FooterToolbar>

      {/* 弹窗，默认是关闭状态，通过按钮等方式触发显示 */}
      {Modal({
        isOpen: isModalOpen,
        closeModal: closeModal,
        modalUri: modalUri,
      })}
    </PageContainer>
  );
};

export default BasicList;
