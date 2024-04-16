import { App, Button, Form, Input } from 'antd';
import { useState } from 'react';

import Card from '@/components/card';
import { PwdSetReq, usePwdSet } from '@/api/services/userService';

type FieldType = {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};
export default function OthersTab() {
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const initFormValues = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const [loading, setLoading] = useState(false);
  const pwdSet = usePwdSet();
  const handleClick = async() => {
    const passwordSet: PwdSetReq = form.getFieldsValue();
    try {
      const res = await pwdSet(passwordSet);
      if (res){
        notification.success({
          message: '成功',
          description: '更新成功',
          duration: 3,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="!h-auto flex-col">
      <Form
        layout="vertical"
        initialValues={initFormValues}
        form={form}
        labelCol={{ span: 8 }}
        className="w-full"
      >
        <Form.Item<FieldType> label="旧密码" name="oldPassword">
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType> label="新密码" name="newPassword">
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          label="确认新密码"
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            {
              required: true,
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('输入的新密码不匹配!'));
              },
            }),
          ]}>
          <Input.Password />
        </Form.Item>
      </Form>
      <div className="flex w-full justify-end">
        <Button type="primary" onClick={handleClick} loading={loading}>
          保存
        </Button>
      </div>
    </Card>
  );
}
