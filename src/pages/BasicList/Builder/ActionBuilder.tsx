import { Button } from 'antd';

const ActionBuilder = (
  actions: BasicListApi.Action[] | undefined,
  actionHandler: (action: BasicListApi.Action) => void,
  loading: boolean,
) => {
  return (actions || []).map((action: BasicListApi.Action) => {
    return (
      <Button
        key={action?.text}
        type={action?.type as any}
        loading={loading}
        onClick={() => actionHandler(action)}
      >
        {action?.text}
      </Button>
    );
  });
};

export default ActionBuilder;
