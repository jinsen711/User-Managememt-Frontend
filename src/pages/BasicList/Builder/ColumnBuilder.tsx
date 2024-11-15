import { Space, Tag } from 'antd';
import moment from 'moment';
import ActionBuilder from './ActionBuilder';

const ColumnBuilder = (
  columns: BasicListApi.Field[] | undefined,
  actionHandler: (action: BasicListApi.Action, record: BasicListApi.DataSource) => void,
) => {
  const result: any[] = [];

  (columns || []).forEach((column) => {
    if (column?.hideInColumn !== true) {
      switch (column.type) {
        case 'datetime':
          column.render = (value: any) => {
            return moment(value).format('YYYY-MM-DD HH:mm:ss');
          };
          break;
        case 'switch':
          column.render = (value: any) => {
            const option = (column.data || []).find((item: any) => item.value === value);
            return <Tag color={value ? 'blue' : 'red'}>{option?.title}</Tag>;
          };
          break;
        case 'actions':
          column.render = (_: any, record: BasicListApi.DataSource) => {
            return <Space>{ActionBuilder(column.actions, actionHandler, false, record)}</Space>;
          };
          break;
        default:
          break;
      }
      result.push(column);
    }
  });

  const idColumn = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
    },
  ];

  return idColumn.concat(result);
};

export default ColumnBuilder;
