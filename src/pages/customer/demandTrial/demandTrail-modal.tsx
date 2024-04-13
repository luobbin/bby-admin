import { Form, Modal, Input, Button, Select } from 'antd';
import { useEffect, useState } from 'react';

import { ItemReq, useAdd, useUpdate } from '@/api/services/demandTrailService';
import { usePage as useCompanyPage, SearchReq as SearchCompany} from '@/api/services/companyService';
import { usePage as useDemandPage, SearchReq as SearchDemand} from '@/api/services/demandService';

export type ItemModalProps = {
  formValue: ItemReq;
  title: string;
  show: boolean;
  onOk: VoidFunction;
  onCancel: VoidFunction;
};
export function DemandTrailModal({ title, show, formValue, onOk, onCancel }: ItemModalProps) {
  const [form] = Form.useForm();
  const [companyList, setCompanyList] = useState([]);
  const getCompanyList = useCompanyPage();
  const [demandList, setDemandList] = useState([]);
  const getDemandList = useDemandPage();

  useEffect(() => {
    //类目获取
    const handleList = async () => {
      try {
        // @ts-ignore
        const companyReq: SearchCompany = {
          pageIndex: 1,
          pageSize: 10,
        };
        await getCompanyList(companyReq).then((res) => {
          // @ts-ignore
          const companyRes: PageRes = res;
          if (companyRes && Reflect.has(companyRes, 'list')) {
            // @ts-ignore
            companyRes.list.push({ id: 0, name: '未选择',});
            // @ts-ignore
            setCompanyList(companyRes.list);
          }
        });

        // @ts-ignore
        const demandReq: SearchDemand = {
          pageIndex: 1,
          pageSize: 10,
        };
        await getDemandList(demandReq).then((res) => {
          // @ts-ignore
          const demandRes: PageRes = res;
          if (demandRes && Reflect.has(demandRes, 'list')) {
            // @ts-ignore
            demandRes.list.push({ id: 0, name: '未选择', });
            // @ts-ignore
            setDemandList(demandRes.list);
          }
        });
      } finally {
        console.log('类目加载完成');
      }
    };
    handleList();
  }, []);

  useEffect(() => {
    form.setFieldsValue({ ...formValue });
  }, [formValue, form]);

  //更新|新增
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
        <Form.Item<ItemReq> label="客户ID" name="userId" hidden>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="对接公司" name="companyId">
          <Select
            fieldNames={{
              label: 'name',
              value: 'id',
            }}
            style={{ width: 120 }}
            options={companyList}
          />
        </Form.Item>
        <Form.Item<ItemReq> label="需求" name="demandId">
          <Select
            fieldNames={{
              label: 'name',
              value: 'id',
            }}
            style={{ width: 120 }}
            options={demandList}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
