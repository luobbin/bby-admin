import { Form, Modal, Input, Radio, Button, App } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemReq, useIfShow } from '@/api/services/companyExamineService';
import { IfCheckStatus} from '#/enum';

export type ItemModalProps = {
  formValue: ItemReq;
  title: string;
  show: boolean;
  onOk: VoidFunction;
  onCancel: VoidFunction;
};
export function CompanyExamineModal({ title, show, formValue, onOk, onCancel }: ItemModalProps) {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  useEffect(() => {
    //初始化表单
    form.setFieldsValue({ ...formValue });
  }, [formValue]);

  const update = useIfShow();
  const { notification } = App.useApp();
  const handleFinish = async () => {
    // @ts-ignore
    const item: ItemReq = form.getFieldsValue();
    try {
      const res = await update(item);
      console.log('修改的数据结果为', res);
      if (res){
        notification.success({
          message: '成功',
          description: '提交成功',
          duration: 3,
        });// 提交到服务端
        onOk();
        navigate('/facilitator/companyExamine')
      }
    } catch (e) {
      console.log('操作失败原因',e);
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
        <Form.Item<ItemReq> label="审核" name="ifCheck" required>
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio value={IfCheckStatus.待定}> 待定 </Radio>
            <Radio value={IfCheckStatus.通过}> 通过 </Radio>
            <Radio value={IfCheckStatus.驳回}> 驳回 </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item<ItemReq> label="驳回原因" name="reason">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
