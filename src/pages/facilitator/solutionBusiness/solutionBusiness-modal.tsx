import { Form, Modal, Input, Radio, Button, Select } from 'antd';
import { useEffect, useState } from 'react';

import { ItemReq, useAdd, useUpdate } from "@/api/services/solutionBusinessService";
import { usePage as useMemberPage, SearchReq as SearchMember} from '@/api/services/memberService';
import { usePage as useSolutionPage, SearchReq as SearchSolution} from '@/api/services/solutionService';
import { BusinessStatus, IfDelStatus } from '#/enum';
import { PageRes } from '#/entity';

export type ItemModalProps = {
  formValue: ItemReq;
  title: string;
  show: boolean;
  onOk: VoidFunction;
  onCancel: VoidFunction;
};
export function SolutionBusinessModal({ title, show, formValue, onOk, onCancel }: ItemModalProps) {
  const [form] = Form.useForm();
  const [memberList, setMemberList] = useState([]);
  const getMemberList = useMemberPage();
  const [solutionList, setSolutionList] = useState([]);
  const getSolutionList = useSolutionPage();
  useEffect(() => {
    //初始化表单
    form.setFieldsValue({ ...formValue });
    //加载类目
    const handleList = async () => {
      try {
        // @ts-ignore
        const memberReq: SearchMember = {
          pageIndex: 1,
          pageSize: 10,
          ifDel: IfDelStatus.否,
        };
        await getMemberList(memberReq).then((res) => {
          // @ts-ignore
          const memberRes: PageRes = res;
          if (memberRes && Reflect.has(memberRes, 'list')) {
            // @ts-ignore
            memberRes.list.push({ id: 0, account: '未选择',});
            // @ts-ignore
            setMemberList(memberRes.list);
          }
        });

        // @ts-ignore
        const solutionReq: SearchSolution = {
          pageIndex: 1,
          pageSize: 10,
        };
        await getSolutionList(solutionReq).then((res) => {
          // @ts-ignore
          const solutionRes: PageRes = res;
          if (solutionRes && Reflect.has(solutionRes, 'list')) {
            // @ts-ignore
            solutionRes.list.push({ id: 0, name: '未选择', });
            // @ts-ignore
            setSolutionList(solutionRes.list);
          }
        });
      } finally {
        console.log('类目加载完成');
      }
    };
    handleList();
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
            fieldNames={{
              label: 'account',
              value: 'id',
            }}
            style={{ width: 120 }}
            options={memberList}
          />
        </Form.Item>
        <Form.Item<ItemReq> label="解决方案" name="solutionId">
          <Select
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
