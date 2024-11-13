import { Form, Input } from 'antd';

const FormBuilder = (data: PageApi.Datum2[] | undefined) => {
  return (
    <div>
      {(data || []).map((field: PageApi.Datum2) => {
        return (
          <Form.Item label={field.title} key={field.key} name={field.dataIndex}>
            <Input></Input>
          </Form.Item>
        );
      })}
    </div>
  );
};

export default FormBuilder;
