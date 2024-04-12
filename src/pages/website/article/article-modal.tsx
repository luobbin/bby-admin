import { Form, Modal, Input, Radio, Button, App, Card } from 'antd';
import { useEffect, useState } from 'react';

import Editor from '@/components/editor';
import { ItemReq, useAdd, useUpdate } from '@/api/services/articleService';
import { IfDelStatus } from "#/enum";

export type ItemModalProps = {
  formValue: ItemReq;
  title: string;
  show: boolean;
  onOk: VoidFunction;
  onCancel: VoidFunction;
};
export function ArticleModal({ title, show, formValue, onOk, onCancel }: ItemModalProps) {
  const [form] = Form.useForm();
  const [quillSimple, setQuillSimple] = useState('');
  // const [abilitySetValue, setAbilitySetValue] = useState('');
  // const [contactSetValue, setContactSetValue] = useState('');
  // const [qualificationSetValue, setQualificationSetValue] = useState('');
  useEffect(() => {
    form.setFieldsValue({ ...formValue });
  }, [formValue, form]);
  const add = useAdd();
  const update = useUpdate();
  const { notification } = App.useApp();
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
      notification.success({
        message: '成功',
        description: '提交成功',
        duration: 3,
      });
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
        <Form.Item<ItemReq> label="标题" name="title" required>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="介绍" name="info">
          <Input.TextArea />
        </Form.Item>
        <Form.Item<ItemReq> label="主要内容" name="content">
          <Input.TextArea />
        </Form.Item>
        <Card title="Editor Simple">
          <Editor id="sample-editor" sample value={quillSimple} onChange={setQuillSimple} />
        </Card>
        {/* <Form.Item<ItemReq> label="介绍" name="info">
          <Card title="Editor Simple">
            <Editor id="info-editor" sample value={infoValue} onChange={setInfoValue} />
          </Card>
        </Form.Item>
       <Form.Item<ItemReq> label="资质认证" name="qualificationSet" required>
          <Editor
            id="qualificationSet-editor"
            sample
            value={qualificationSetValue}
            onChange={setQualificationSetValue}
          />
        </Form.Item>
        <Form.Item<ItemReq> label="能力" name="abilitySet" required>
          <Editor
            id="abilitySet-editor"
            sample
            value={abilitySetValue}
            onChange={setAbilitySetValue}
          />
        </Form.Item>
        <Form.Item<ItemReq> label="在线咨询" name="contactSet" required>
          <Editor
            id="contactSet-editor"
            sample
            value={contactSetValue}
            onChange={setContactSetValue}
          />
        </Form.Item> */}
        <Form.Item<ItemReq> label="是否删除" name="ifDel" required>
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio value={IfDelStatus.NO}> 否 </Radio>
            <Radio value={IfDelStatus.YES}> 是 </Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}
