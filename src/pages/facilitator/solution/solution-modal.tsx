import { Form, Modal, Input, Radio, Tooltip, Button, Select, InputNumber } from 'antd';
import { useEffect, useState } from 'react';

import { ItemReq, useAdd, useUpdate } from "@/api/services/solutionService";
import { IfHotStatus, IfShowStatus } from '#/enum';

export type ItemModalProps = {
  formValue: ItemReq;
  title: string;
  show: boolean;
  onOk: VoidFunction;
  onCancel: VoidFunction;
};
export function SolutionModal({ title, show, formValue, onOk, onCancel }: ItemModalProps) {
  const [form] = Form.useForm();
    const [companyList, setCompanyList] = useState([]);
  useEffect(() => {
    form.setFieldsValue({ ...formValue });
    setCompanyList([]);
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
        <Form.Item<ItemReq> label="名称" name="name" required>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="所属公司" name="companyId">
          <Select
            // defaultValue={pid}
            fieldNames={{
              label: 'name',
              value: 'id',
            }}
            style={{ width: 120 }}
            options={companyList}
          />
        </Form.Item>
        <Form.Item<ItemReq> label="首图" name="indexImg" required>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="PC端体验地址" name="demoPcLink" required>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="手机端体验地址" name="demoMobLink" required>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="体验账号" name="demoCount" required>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="名称" name="name" required>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="方案简介" name="info" required>
          <Input.TextArea />
        </Form.Item>
        <Form.Item<ItemReq> label="主要内容" name="content" required>
          <Input.TextArea />
        </Form.Item>
        <Form.Item<ItemReq> label="优势" name="advantage" required>
          <Input.TextArea />
        </Form.Item>
        <Form.Item<ItemReq> label="功能列表" name="functionSet" required>
          <Input.TextArea />
        </Form.Item>

        <Form.Item<ItemReq> label="显示状态" name="ifShow" required>
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
        <Form.Item<ItemReq> label="是否热门" name="ifHot" required>
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio value={IfHotStatus.ENABLE}> 是 </Radio>
            <Radio value={IfHotStatus.DISABLE}> 否 </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item<ItemReq> label="排序" name="sort" required>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
