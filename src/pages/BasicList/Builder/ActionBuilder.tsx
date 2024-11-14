import { Button } from 'antd';

const ActionBuilder = (
  actions: any[] | undefined,
  actionHandler: (action: BasicListApi.Action) => void,
) => {
  return (actions || []).map((action: BasicListApi.Action) => {
    return (
      <Button key={action?.text} type={action.type as any} onClick={() => actionHandler(action)}>
        {action?.text}
      </Button>
    );
  });
};

export default ActionBuilder;
