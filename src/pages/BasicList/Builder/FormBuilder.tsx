import { DatePicker, Form, Input, Switch, TreeSelect } from 'antd';

const FormBuilder = (data: BasicListApi.Field[] | undefined) => {
  return (
    <div>
      {(data || []).map((field: BasicListApi.Field) => {
        // 对不同类型字段进行不同的处理
        switch (field.type) {
          case 'datetime':
            return (
              <Form.Item label={field.title} key={field.key} name={field.dataIndex}>
                <DatePicker
                  disabled={field?.disabled}
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                ></DatePicker>
              </Form.Item>
            );
          case 'switch':
            return (
              <Form.Item
                label={field.title}
                key={field.key}
                name={field.dataIndex}
                valuePropName="checked"
              >
                <Switch disabled={field?.disabled}></Switch>
              </Form.Item>
            );
          case 'tree':
            return (
              <Form.Item label={field.title} key={field.key} name={field.dataIndex}>
                <TreeSelect
                  disabled={field?.disabled}
                  treeData={field?.data}
                  treeCheckable={true} // 支持多选，单选情况下 treeData 为数组会报警告
                ></TreeSelect>
              </Form.Item>
            );
          default:
            return (
              <Form.Item label={field.title} key={field.key} name={field.dataIndex}>
                <Input disabled={field?.disabled}></Input>
              </Form.Item>
            );
        }
      })}
    </div>
  );
};

export default FormBuilder;
