import { Form, Modal, Input, Radio, Button, App, Select } from 'antd';
import { useEffect, useState } from 'react';

import { ItemReq, useAdd, useUpdate } from '@/api/services/companyExamineService';
import { IfCheckStatus, IfDelStatus, IfServiceStatus, } from '#/enum';
import { usePage as useMemberPage, SearchReq as SearchMember} from '@/api/services/memberService';
import { UploadAvatar } from "@/components/upload";

export type ItemModalProps = {
  formValue: ItemReq;
  title: string;
  show: boolean;
  onOk: VoidFunction;
  onCancel: VoidFunction;
};
export function CompanyExamineModal({ title, show, formValue, onOk, onCancel }: ItemModalProps) {
  const [form] = Form.useForm();
  const [memberList, setMemberList] = useState([]);
  const getMemberList = useMemberPage();
  const [logo, setLogo] = useState('');
  const [indexImg, setIndexImg] = useState('');

  useEffect(() => {
    //加载类目
    const handleList = async() => {
      try {
        // @ts-ignore
        const memberReq: SearchMember = {
          pageIndex: 1,
          pageSize: 10,
          ifDel: IfDelStatus.否,
          ifService: IfServiceStatus.否,
        };
        await getMemberList(memberReq).then((res) => {
          // @ts-ignore
          const memberRes: PageRes = res;
          if (memberRes && Reflect.has(memberRes, 'list')) {
            // @ts-ignore
            memberRes.list.push({ id: 0, account: '未选择', });
            // @ts-ignore
            setMemberList(memberRes.list);
          }
        });
      }finally {
        console.log('类目加载完成');
      }

    }
    handleList();
  }, []);

  useEffect(() => {
    //初始化表单
    form.setFieldsValue({ ...formValue });
    setLogo(form.getFieldValue('logo'));
    setIndexImg(form.getFieldValue('indexImg'))
  }, [formValue,form]);

  function updateIndexImg(newImg: string): void {
    if (newImg && newImg !== ''){
      form.setFieldValue('indexImg',newImg);
      setIndexImg(newImg);
    }
    console.log("获取到新头像indexImg：",form.getFieldValue('indexImg'));
  }

  function updateLogo(newImg: string): void {
    if (newImg && newImg !== '') {
      form.setFieldValue('logo', newImg);
      setLogo(newImg);
    }
  }

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
        <Form.Item<ItemReq> label="申请用户" name="userId">
          {memberList.length > 0 && <Select
            fieldNames={{
              label: 'account',
              value: 'id',
            }}
            style={{ width: 120 }}
            options={memberList}
          />}
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
          <UploadAvatar helperText="" defaultAvatar={logo} onChange={updateLogo}/>
        </Form.Item>
        <Form.Item<ItemReq> label="公司展示图片" name="indexImg" required>
          <UploadAvatar helperText="" defaultAvatar={indexImg} onChange={updateIndexImg}/>
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
