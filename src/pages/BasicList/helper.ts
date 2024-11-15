import moment from 'moment';

export const setFieldsApadtor = (data: BasicListApi.PageData | undefined) => {
  const fieldsValue: BasicListApi.DataSource = {};
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

export const submitFieldsAdaptor = (data: BasicListApi.DataSource) => {
  // TODO: data 为空时的处理
  // 1, 处理特定字段的时间格式 create_time, update_time
  // const { create_time, update_time, ...rest } = data;
  // return {
  //   ...rest,
  //   create_time: moment(create_time).format(),
  //   update_time: moment(update_time).format(),
  // };

  // 2, 处理任意字段的时间格式
  const result: BasicListApi.DataSource = { ...data };
  Object.keys(result).forEach((key) => {
    if (moment.isMoment(result[key])) {
      result[key] = moment(result[key]).format();
    }
  });
  return result;
};
