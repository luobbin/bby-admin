import { Form, Modal, Input, Radio, Button, App } from 'antd';
import { useEffect } from 'react';

import { IfDelStatus, IfServiceStatus } from '#/enum';
import { ItemReq, useAdd, useUpdate } from '@/api/services/memberService';
import { UploadAvatar } from '@/components/upload';

export type ItemModalProps = {
  formValue: ItemReq;
  title: string;
  show: boolean;
  onOk: VoidFunction;
  onCancel: VoidFunction;
};
// @ts-ignore
const DEFAULE_VAL: ItemReq = {
  id: '',
  account: '',
  avatar: '',
  mobile: '',
  realName: '',
  address: '',
  ifDel: IfDelStatus.否,
  ifService: 0,
};

export function MemberModal({ title, show, formValue, onOk, onCancel }: ItemModalProps) {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({ ...formValue });
    console.log('更新的表单数据', form.getFieldsValue());
  }, [formValue, form]);
  // 处理新增|更新
  const add = useAdd();
  const update = useUpdate();
  const { notification } = App.useApp();
  const handleFinish = async () => {
    // @ts-ignore
    const item: ItemReq = form.getFieldsValue();
    try {
      let res;
      if (form.getFieldValue('id') === '') {
        res = await add(item);
      } else {
        res = await update(item);
      }
      if (res){
        form.setFieldsValue(DEFAULE_VAL);
      }
    } finally {
      notification.success({
        message: '成功',
        description: '提交成功',
        duration: 3,
      });
      // 提交到服务端
      onOk();
    }
  };

  function setAvatar(newImg: string): void {
    formValue.avatar = newImg;
    console.log("获取到新头像：",formValue.avatar);
  }

  // @ts-ignore
  return (
    <Modal
      title={title}
      open={show}
      onOk={onOk}
      onCancel={onCancel}
      width={600}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" htmlType="submit" onClick={handleFinish}>
          提交
        </Button>,
      ]}
    >
      <Form
        initialValues={formValue}
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
      >
        <Form.Item<ItemReq> label="ID" name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq>
          label="账号"
          name="account"
          rules={[{ required: true, message: '请输入用户账号' }]}
        >
          <Input placeholder="用户账号" />
        </Form.Item>
        <Form.Item<ItemReq>
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入用户密码' }]}
        >
          <Input.Password type="password" placeholder="用户密码" />
        </Form.Item>
        <Form.Item<ItemReq> label="姓名" name="realName" required>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="手机号" name="mobile" required>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="头像" name="avatar">
          <UploadAvatar helperText="" defaultAvatar={form.getFieldValue('avatar')} onChange={setAvatar}/>
        </Form.Item>
        <Form.Item<ItemReq> label="地址" name="address">
          <Input />
        </Form.Item>

        <Form.Item<ItemReq> label="是否删除" name="ifDel" required>
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio value={IfDelStatus.否}> 否 </Radio>
            <Radio value={IfDelStatus.是}> 是 </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item<ItemReq> label="是否服务商" name="ifService" required>
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio value={IfServiceStatus.否}> 否 </Radio>
            <Radio value={IfServiceStatus.是}> 是 </Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}
