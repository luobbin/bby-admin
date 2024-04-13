import { Form, Input, Radio, Button, App, Space } from 'antd';
import { useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';

import Editor from '@/components/editor';
import { ItemReq, useAdd, useUpdate } from '@/api/services/articleService.ts';
import { IfDelStatus } from '#/enum.ts';

const DEFAULE_VAL: ItemReq = {
  id: "",
  title: "",
  ifDel: IfDelStatus.否,
  info: "",
  content: ""
};

export default function ArticleEditPage()  {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [formValue, setFormValue] = useState<ItemReq>();
  const [submitTitle, setSubmitTitle] = useState("");
  const [content, setContent] = useState("");

  const currentLocation = useLocation();
  useEffect(() => {
    if (currentLocation.state){
      const { title, params } = currentLocation.state;
      setFormValue(params);
      setSubmitTitle(title);
      setContent(params.content);
    }
    form.setFieldsValue(formValue);
  }, [formValue, form]);

  const add = useAdd();
  const update = useUpdate();
  const { notification } = App.useApp();
  const handleFinish = async () => {
    setLoading(true);
    form.setFieldValue('content',content);
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
        message: "成功",
        description: "提交成功",
        duration: 3
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
        <div className="mb-10"></div>
        <Form.Item<ItemReq> label="ID" name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="标题" name="title" required>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="介绍" name="info" required>
          <Input.TextArea />
        </Form.Item>
        <Form.Item<ItemReq> label="主要内容" name="content" required>
          <Editor id="article-content-editor" value={content} onChange={setContent} />
        </Form.Item>
        <Form.Item<ItemReq> label="是否删除" name="ifDel" required>
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio value={IfDelStatus.否}> 否 </Radio>
            <Radio value={IfDelStatus.是}> 是 </Radio>
          </Radio.Group>
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
