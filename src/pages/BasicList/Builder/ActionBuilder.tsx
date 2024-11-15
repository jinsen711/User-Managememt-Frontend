import { Button } from 'antd';

const ActionBuilder = (
  actions: BasicListApi.Action[] | undefined,
  actionHandler: (action: BasicListApi.Action, record: BasicListApi.DataSource) => void,
  loading: boolean = false,
  record: BasicListApi.DataSource = {},
) => {
  return (actions || []).map((action: BasicListApi.Action) => {
    return (
      <Button
        key={action?.text}
        type={action?.type as any}
        loading={loading}
        onClick={() => actionHandler(action, record)}
      >
        {action?.text}
      </Button>
    );
  });
};

export default ActionBuilder;
