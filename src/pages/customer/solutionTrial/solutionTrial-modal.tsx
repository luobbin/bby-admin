import { Form, Modal, Input, Button, Select } from 'antd';
import { useEffect, useState } from 'react';

import { ItemReq, useAdd, useUpdate } from "@/api/services/solutionTrialService";

export type ItemModalProps = {
  formValue: ItemReq;
  title: string;
  show: boolean;
  onOk: VoidFunction;
  onCancel: VoidFunction;
};
export function SolutionTrialModal({ title, show, formValue, onOk, onCancel }: ItemModalProps) {
  const [form] = Form.useForm();
  const [userList, setUserList] = useState([]);
  const [solutionList, setSolutionList] = useState([]);
  useEffect(() => {
    form.setFieldsValue({ ...formValue });
    setUserList([]);
    setSolutionList([]);
  }, [formValue, form]);
  const add = useAdd();
  const update = useUpdate();
  const handleFinish = async () => {
    // @ts-ignore
    const item: ItemReq = form.getFieldsValue();
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
      width={1000}
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
        <Form.Item<ItemReq> label="公司ID" name="companyId" hidden>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="试用客户" name="userId">
          <Select
            // defaultValue={pid}
            fieldNames={{
              label: 'account',
              value: 'id',
            }}
            style={{ width: 120 }}
            options={userList}
          />
        </Form.Item>
        <Form.Item<ItemReq> label="解决方案" name="solutionId">
          <Select
            // defaultValue={pid}
            fieldNames={{
              label: 'name',
              value: 'id',
            }}
            style={{ width: 120 }}
            options={solutionList}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
