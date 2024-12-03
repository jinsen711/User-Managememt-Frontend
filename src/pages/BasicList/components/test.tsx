import { Button } from 'antd';
import { useState } from 'react';

const TestFn = () => {
  const [isOpen, setIsOpen] = useState(false);

  const hello = () => {
    console.log(isOpen);
    return <div>{isOpen ? 'isOpen 为 True' : 'isOpen 为 False'}</div>;
  };

  const world = () => {
    return (
      <div>
        {hello()}
        <Button
          type={isOpen ? 'primary' : 'default'}
          key="test"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          {'点击'}
        </Button>
      </div>
    );
  };

  return <div>{world()}</div>;
};

export default TestFn;
