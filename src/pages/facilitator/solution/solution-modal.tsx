import { Form, Modal, Input, Radio, Tooltip, Button, InputNumber, App } from 'antd';
import { useEffect } from 'react';

import { ItemReq, useIfShow } from "@/api/services/solutionService";
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
  useEffect(() => {
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
      }else {
        notification.error({
          message: '操作失败',
          description: '操作失败，请稍后重试',
          duration: 3,
        })
      }
    } catch (e) {
      notification.error({
        message: '操作失败',
        description: '操作失败，请稍后重试',
        duration: 3,
      })
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
            <Radio value={IfHotStatus.是}> 是 </Radio>
            <Radio value={IfHotStatus.否}> 否 </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item<ItemReq> label="页面浏览数" name="viewCount" required>
          <InputNumber />
        </Form.Item>
        <Form.Item<ItemReq> label="方案安装数" name="demoCount" required>
          <InputNumber />
        </Form.Item>
        <Form.Item<ItemReq> label="咨询次数" name="contactCount" required>
          <InputNumber />
        </Form.Item>
        <Form.Item<ItemReq> label="排序" name="sort" required>
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  );
}
