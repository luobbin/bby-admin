import { Form, Space, Input, Radio, Tooltip, Button, App, InputNumber } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { ItemReq, useAdd, useUpdate } from '@/api/services/companyService';
import { IfHotStatus, IfShowStatus } from '#/enum';
import Editor from '@/components/editor';
import { UploadAvatar } from "@/components/upload";

const DEFAULE_VAL: ItemReq = {
  id: '',
  userId: 0,
  name: '',
  ifShow: IfShowStatus.ENABLE,
  logo: '',
  indexImg: '',
  info: '',
  qualificationSet: '',
  abilitySet: '',
  mobile: '',
  address: '',
  contactSet: '',
  ifHot: 0,
  sort: 0,
  supportIds: [],
  regionIds: [],
  industryIds: [],
};

export default function CompanyEditPage() {
  const [form] = Form.useForm();
  // 初始化数据
  const currentLocation = useLocation();
  const [formValue, setFormValue] = useState<ItemReq>();
  const [loading, setLoading] = useState(false);
  const [submitTitle, setSubmitTitle] = useState('');
  const [contactSet, setContactSet] = useState('');
  useEffect(() => {
    if (currentLocation.state){
      const { title, params } = currentLocation.state;
      setFormValue(title === '创建'? DEFAULE_VAL : params);
      setSubmitTitle(title);
    }
    console.log("初始化数据", formValue);
    if (formValue){
      console.log('formValue',formValue);
      form.setFieldsValue(formValue);
    }
  }, [formValue, form]);

  function setIndexImg(newImg: string): void {
    console.log("获取到新头像：",newImg);
    form.setFieldValue('indexImg',newImg);
  }

  function setLogo(newImg: string): void {
    console.log("获取到新头像：",newImg);
    form.setFieldValue('logo',newImg);
  }

  //更新|新增
  const add = useAdd();
  const update = useUpdate();
  const { notification } = App.useApp();
  const handleFinish = async () => {
    setLoading(true);
    // @ts-ignore
    const item: ItemReq = form.getFieldsValue();
    try {
      console.log('转换数据为', item);
      let res;
      if (form.getFieldValue("id") === "") {
        res = await add(item);
        console.log('新增的数据结果为', res);
      } else {
        res = await update(item);
        console.log('修改的数据结果为', res);
      }
      if (res){
        form.setFieldsValue(DEFAULE_VAL);
      }
    } finally {
      notification.success({
        message: '成功',
        description: '提交成功',
        duration: 3,
      });
      setLoading(false);
    }
  };
  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <Form
        initialValues={formValue}
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
        onFinish={handleFinish}
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
          <UploadAvatar helperText="" defaultAvatar={form.getFieldValue('logo')} onChange={setLogo}/>
        </Form.Item>
        <Form.Item<ItemReq> label="公司展示图片" name="indexImg" required>
          <UploadAvatar helperText="" defaultAvatar={form.getFieldValue('indexImg')} onChange={setIndexImg}/>
        </Form.Item>
        <Form.Item<ItemReq> label="介绍" name="info">
          <Input.TextArea />
        </Form.Item>
        <Form.Item<ItemReq> label="资质认证" name="qualificationSet">
          <Input.TextArea placeholder="待处理。文件上传" />
        </Form.Item>
        <Form.Item<ItemReq> label="能力" name="abilitySet">
          <Input.TextArea placeholder="待处理：先用逗号分隔" />
        </Form.Item>
        <Form.Item<ItemReq> label="在线咨询" name="contactSet">
          <Editor id="article-content-editor" value={contactSet} onChange={setContactSet} />
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
        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
            {submitTitle}
          </Button>
        </Form.Item>
      </Form>
    </Space>
  );
}
