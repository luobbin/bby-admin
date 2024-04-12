import { Form, Modal, Input, Tooltip, Radio, Select, Button, App } from 'antd';
import { useEffect, useState } from 'react';

import { IfShowStatus } from '#/enum';
import { ItemReq, SearchReq, useAdd, useList, useUpdate } from '@/api/services/regionService';

export type ItemModalProps = {
  formValue: ItemReq;
  title: string;
  show: boolean;
  onOk: VoidFunction;
  onCancel: VoidFunction;
};
export function RegionModal({ title, show, formValue, onOk, onCancel }: ItemModalProps) {
  const [form] = Form.useForm();
  // 查询所有父级类目
  const [data, setData] = useState([]);
  const getList = useList();
  useEffect(() => {
    const handlePage = async () => {
      try {
        // @ts-ignore
        const param: SearchReq = {
          pageIndex: 1,
          pageSize: 10,
          pid: 0,
        };
        await getList(param).then((res) => {
          // @ts-ignore
          const listRes: Region[] = res;
          if (listRes) {
            // @ts-ignore
            listRes.push({ id: 0, pid: 0, name: '顶级', ifShow: 1, createdAt: '' });
            console.log('初始化转换', listRes);
            // @ts-ignore
            setData(listRes);
          }
        });
      } finally {
        console.log('加载完成');
      }
    };
    handlePage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    form.setFieldsValue({ ...formValue });
    form.setFieldValue('label', formValue.name);
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
        description: '操作成功',
        duration: 3,
      });
      // 提交到服务端
      onOk();
    }
  };
  // @ts-ignore
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
        <Form.Item<ItemReq> label="ID" name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="名称" name="name" required>
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

        <Form.Item<ItemReq> label="父级地区" name="pid">
          <Select
            // defaultValue={pid}
            fieldNames={{
              label: 'name',
              value: 'id',
            }}
            style={{ width: 120 }}
            options={data}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
