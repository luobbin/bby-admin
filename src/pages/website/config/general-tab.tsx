import { faker } from '@faker-js/faker';
import { App, Button, Col, Form, Input, Row, Space } from 'antd';
import { useState} from 'react';

import Card from '@/components/card';
import { UploadAvatar } from '@/components/upload';

type FieldType = {
  name?: string;
  logo?: string;
  email?: string;
  phone?: string;
  address?: string;
  contact?: string;
  workTime?: string;
  identity: string;
};
export default function GeneralTab() {
  const { notification } = App.useApp();
  // const logo = 'https://pub-files.baishuyun.com/logo.png';
  const initFormValues = {
    name: '百数云',
    email: 'bsy@baishuyun.com',
    phone: faker.phone.number(),
    address: faker.location.county(),
    city: faker.location.city(),
    contact: faker.location.zipCode(),
    identity: faker.lorem.paragraphs(),
  };
  const [logo, setLogo] = useState('https://pub-files.baishuyun.com/logo.png');

  const handleClick = () => {
    console.log("获取到图片:",logo);
    notification.success({
      message: 'Update success!',
      duration: 3,
    });
  };
  return (
    <Row gutter={[16, 16]}>
      <Col span={24} lg={8}>
        <Card className="flex-col !px-6 !pb-10 !pt-20">
          <UploadAvatar helperText="" defaultAvatar={logo} onChange={setLogo}/>
          <Space className="py-6">
            <div>网站LOGO</div>
          </Space>
        </Card>
      </Col>
      <Col span={24} lg={16}>
        <Card>
          <Form
            layout="vertical"
            initialValues={initFormValues}
            labelCol={{ span: 8 }}
            className="w-full"
          >
            <Form.Item<FieldType> label="网站名称" name="name">
              <Input />
            </Form.Item>
            <Form.Item<FieldType> label="联系客服" name="contact">
              <Input.TextArea />
            </Form.Item>
            <Form.Item<FieldType> label="工作时间" name="workTime">
              <Input />
            </Form.Item>
            <Form.Item<FieldType> label="投诉Email" name="email">
              <Input />
            </Form.Item>
            <Form.Item<FieldType> label="联系电话" name="phone">
              <Input />
            </Form.Item>
            <Form.Item<FieldType> label="联系地址" name="address">
              <Input />
            </Form.Item>

            <Form.Item<FieldType> label="备案号" name="identity">
              <Input.TextArea />
            </Form.Item>

            <div className="flex w-full justify-end">
              <Button type="primary" onClick={handleClick}>
                保存
              </Button>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}
