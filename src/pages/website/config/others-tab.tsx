import { App, Button, Form, Input } from 'antd';

import Card from '@/components/card';

type FieldType = {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};
export default function OthersTab() {
  const { notification } = App.useApp();
  const initFormValues = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
  const handleClick = () => {
    notification.success({
      message: 'Update success!',
      duration: 3,
    });
  };

  return (
    <Card className="!h-auto flex-col">
      <Form
        layout="vertical"
        initialValues={initFormValues}
        labelCol={{ span: 8 }}
        className="w-full"
      >
        <Form.Item<FieldType> label="旧密码" name="oldPassword">
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType> label="新密码" name="newPassword">
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType> label="确认新密码" name="confirmPassword">
          <Input.Password />
        </Form.Item>
      </Form>
      <div className="flex w-full justify-end">
        <Button type="primary" onClick={handleClick}>
          保存
        </Button>
      </div>
    </Card>
  );
}
