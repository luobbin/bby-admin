import { Form, Modal, Input, Radio, InputNumber, Button, Select } from 'antd';
import { useEffect, useState } from 'react';

import { Case, useAdd, useUpdate } from '@/api/services/caseService';
import { IfDelStatus } from '#/enum';

export type CaseModalProps = {
  formValue: Case;
  title: string;
  show: boolean;
  onOk: VoidFunction;
  onCancel: VoidFunction;
};
export function CaseModal({ title, show, formValue, onOk, onCancel }: CaseModalProps) {
  const [form] = Form.useForm();
  const [companyList, setCompanyList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [industryList, setIndustryList] = useState([]);
  useEffect(() => {
    form.setFieldsValue({ ...formValue });
    setCompanyList([]);
    setRegionList([]);
    setIndustryList([]);
  }, [formValue, form]);
  const add = useAdd();
  const update = useUpdate();
  const handleFinish = async () => {
    // @ts-ignore
    const item: Case = form.getFieldsValue();
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
        <Form.Item<Case> label="ID" name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item<Case> label="名称" name="name" required>
          <Input />
        </Form.Item>
        <Form.Item<Case> label="客户名称" name="customerName" required>
          <Input />
        </Form.Item>
        <Form.Item<Case> label="简介" name="info" required>
          <Input.TextArea />
        </Form.Item>
        <Form.Item<Case> label="成交额" name="dealAmount" required>
          <Input />
        </Form.Item>
        <Form.Item<Case> label="开始时间" name="beginTime" required>
          <Input />
        </Form.Item>
        <Form.Item<Case> label="结束时间" name="endTime" required>
          <Input />
        </Form.Item>
        <Form.Item<Case> label="所属公司" name="companyId">
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
        <Form.Item<Case> label="所属地区" name="regionId">
          <Select
            // defaultValue={pid}
            fieldNames={{
              label: 'name',
              value: 'id',
            }}
            style={{ width: 120 }}
            options={regionList}
          />
        </Form.Item>
        <Form.Item<Case> label="所属行业" name="industryId">
          <Select
            // defaultValue={pid}
            fieldNames={{
              label: 'name',
              value: 'id',
            }}
            style={{ width: 120 }}
            options={industryList}
          />
        </Form.Item>

        <Form.Item<Case> label="删除状态" name="ifDel" required>
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio value={IfDelStatus.NO}> 否 </Radio>
            <Radio value={IfDelStatus.YES}> 是 </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item<Case> label="排序" name="sort" required>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
