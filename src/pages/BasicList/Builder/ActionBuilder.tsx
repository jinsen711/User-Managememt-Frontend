import { Button } from 'antd';

const ActionBuilder = (actions: BasicListApi.Action[] | undefined) => {
  return (actions || []).map((action) => {
    return <Button type={action.type as any}>{action?.text}</Button>;
  });
};

export default ActionBuilder;
