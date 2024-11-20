import { Button } from 'antd';

const ActionBuilder = (
  actions: BasicListApi.Action[] | undefined,
  actionHandler: (action: BasicListApi.Action, record: BasicListApi.DataSource) => void,
  loading: boolean = false,
  record: BasicListApi.DataSource = {},
) => {
  return (actions || []).map((action: BasicListApi.Action) => {
    switch (action.type) {
      case 'default':
        return (
          <Button
            key={action?.text}
            loading={loading}
            onClick={() => actionHandler(action, record)}
          >
            {action?.text}
          </Button>
        );
      case 'primary':
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
      case 'danger':
        return (
          <Button
            key={action?.text}
            type="primary"
            danger
            loading={loading}
            onClick={() => actionHandler(action, record)}
          >
            {action?.text}
          </Button>
        );
      case 'dashed':
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
      default:
        return (
          <Button key={action?.text} loading={loading}>
            `未处理的按钮{action?.type}`
          </Button>
        );
    }
  });
};

export default ActionBuilder;
