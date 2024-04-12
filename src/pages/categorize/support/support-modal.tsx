import { Form, Modal, Input, Radio, Tooltip, Button } from 'antd';
import { useEffect } from 'react';

import { SupportReq, useAdd, useUpdate } from '@/api/services/supportService';
import { Support } from '#/entity';
import { IfShowStatus } from '#/enum';

export type ItemModalProps = {
  formValue: Support;
  title: string;
  show: boolean;
  onOk: VoidFunction;
  onCancel: VoidFunction;
};
export function SupportModal({ title, show, formValue, onOk, onCancel }: ItemModalProps) {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({ ...formValue });
  }, [formValue, form]);
  const add = useAdd();
  const update = useUpdate();
  const handleFinish = async () => {
    // @ts-ignore
    const item: SupportReq = form.getFieldsValue();
    try {
      console.log('转换数据为', item);
      if (form.getFieldValue('id') === '') {
        const res = await add(item);
        console.log('新增的数据结果为', res);
      } else {
        const res = await update(item);
        console.log('修改的数据结果为', res);
      }
    } finally {
      // 提交到服务端
      onOk();
    }
  };
  return (
    <Modal
      title={title}
      open={show}
      onOk={onOk}
      onCancel={onCancel}
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
        <Form.Item<Support> label="ID" name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item<Support> label="名称" name="name" required>
          <Input />
        </Form.Item>

        <Form.Item<Support> label="显示状态" name="ifShow" required>
          <Radio.Group optionType="button" buttonStyle="solid">
            <Tooltip title="‘待定’表示用户提交的类目名称，需要设置成‘显示’或者‘禁用’">
              <Radio value={IfShowStatus.INIT} title="用户提交">
                待定
              </Radio>
            </Tooltip>
            <Radio value={IfShowStatus.ENABLE}> 显示 </Radio>
            <Radio value={IfShowStatus.DISABLE}> 禁用 </Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}
