import { Form, Modal, Input, Radio, Button, Select } from 'antd';
import { useEffect, useState } from 'react';

import { ItemReq, useAdd, useUpdate } from "@/api/services/solutionBusinessService";
import { BusinessStatus} from "#/enum";

export type ItemModalProps = {
  formValue: ItemReq;
  title: string;
  show: boolean;
  onOk: VoidFunction;
  onCancel: VoidFunction;
};
export function SolutionBusinessModal({ title, show, formValue, onOk, onCancel }: ItemModalProps) {
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
        <Form.Item<ItemReq> label="客户" name="userId">
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

        <Form.Item<ItemReq> label="处理状态" name="status" required>
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio value={BusinessStatus.待处理}> 待处理 </Radio>
            <Radio value={BusinessStatus.对接中}> 对接中 </Radio>
            <Radio value={BusinessStatus.对接成功}> 对接成功 </Radio>
            <Radio value={BusinessStatus.对接失败}> 对接失败 </Radio>
          </Radio.Group>
        </Form.Item>

      </Form>
    </Modal>
  );
}
