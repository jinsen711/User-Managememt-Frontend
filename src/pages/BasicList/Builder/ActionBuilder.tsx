import { Button } from 'antd';

const ActionBuilder = (actions: any[] | undefined) => {
  return (actions || []).map((action) => {
    return (
      <Button key={action?.text} type={action.type as any}>
        {action?.text}
      </Button>
    );
  });
};

export default ActionBuilder;
