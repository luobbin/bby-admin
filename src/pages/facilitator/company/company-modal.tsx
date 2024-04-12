import { Form, Modal, Input, Radio, Tooltip, Button, App, InputNumber } from 'antd';
import { useEffect } from 'react';

import { ItemReq, useAdd, useUpdate } from '@/api/services/companyService';
import { IfHotStatus, IfShowStatus } from '#/enum';

export type ItemModalProps = {
  formValue: ItemReq;
  title: string;
  show: boolean;
  onOk: VoidFunction;
  onCancel: VoidFunction;
};
export function CompanyModal({ title, show, formValue, onOk, onCancel }: ItemModalProps) {
  const [form] = Form.useForm();
  // const [infoValue, setInfoValue] = useState('aaa');
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
        <Form.Item<ItemReq> label="公司名称" name="name" required>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="公司电话" name="mobile" required>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="公司地址" name="address" required>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="公司LOGO" name="logo" required>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="公司展示图片" name="indexImg" required>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="介绍" name="info">
          <Input.TextArea />
        </Form.Item>
        <Form.Item<ItemReq> label="资质认证" name="qualificationSet">
          <Input.TextArea />
        </Form.Item>
        <Form.Item<ItemReq> label="能力" name="abilitySet">
          <Input.TextArea />
        </Form.Item>
        <Form.Item<ItemReq> label="在线咨询" name="contactSet">
          <Input.TextArea />
        </Form.Item>
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
