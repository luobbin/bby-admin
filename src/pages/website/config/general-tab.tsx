import { App, Col, Form, Input, Row, Space } from 'antd';
import { useState, useEffect} from 'react';

import Card from '@/components/card';
import { UploadAvatar } from '@/components/upload';
import { ItemReq, PageList, SearchReq, usePage, useUpdate } from "@/api/services/configService";

type FieldType = {
  sys_app_name: string;
  sys_app_logo: string;
  sys_app_email: string;
  sys_app_phone: string;
  sys_app_address: string;
  sys_app_contact: string;
  sys_app_time: string;
  sys_app_identity: string;
};
export default function GeneralTab() {
  const [form] = Form.useForm();
  const [configList, setConfigList] = useState<PageList[]>([]);
  const getConfigList = usePage();
  useEffect(() => {
    //加载数据
    const handleList = async() => {
      try {
        // @ts-ignore
        const searchReq: SearchReq = {
          pageIndex: 1,
          pageSize: 10,
          isFrontend: "1",
        };
        await getConfigList(searchReq).then((res) => {
          if (!res){
            return;
          }
          // @ts-ignore
          const pageRes: PageRes = res;
          if (pageRes && Reflect.has(pageRes, 'list')) {
            const cfgList: PageList[] = pageRes.list;
            setConfigList(cfgList);
            cfgList.forEach((item) => {
              if (item.configValue !==''){
                form.setFieldValue(item.configKey,item.configValue);
              }
            })
          }
        });
      }finally {
        console.log('类目加载完成');
      }
    }
    handleList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = useUpdate();
  const { notification, message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const onChangeFinish = async (e: any) => {
    console.info("获取wc数据",e.target.id,e.target.value);
    const configItem = getConfigIdByKey(e.target.id);
    if (!configItem){
      message.warning({
        content: "操作失败，请稍后重试",
        duration: 3,
      });
      return;
    }
    try {
      const itemReq: ItemReq = configItem;
      itemReq.configValue = e.target.value;
      const res = await update(itemReq);
      if (res){
        notification.success({
          message: '成功',
          description: '修改成功',
          duration: 3,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  const setAppLogo = async (logo: string) => {
    console.info("获取到新图片",logo, loading);
    const configItem = getConfigIdByKey('sys_app_logo');
    if (!configItem){
      message.warning({
        content: "操作失败，请稍后重试",
        duration: 3,
      });
      return;
    }
    try {
      const itemReq: ItemReq = configItem;
      itemReq.configValue = logo;
      const res = await update(itemReq);
      if (res){
        form.setFieldValue('sys_app_logo',logo);
        notification.success({
          message: '成功',
          description: '修改成功',
          duration: 3,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  const getConfigIdByKey = (cfgKey:string) => {
    //单值 return configList.filter(item => item.configKey==cfgKey).map(value => {return value.id;}).at(0);
    return configList.filter(item => item.configKey==cfgKey).at(0);
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={24} lg={8}>
        <Card className="flex-col !px-6 !pb-10 !pt-20">
          <UploadAvatar helperText="" defaultAvatar={form.getFieldValue('sys_app_logo')} onChange={setAppLogo}/>
          <Space className="py-6">
            <div>网站LOGO</div>
          </Space>
        </Card>
      </Col>
      <Col span={24} lg={16}>
        <Card>
          <Form
            layout="vertical"
            form = {form}
            labelCol={{ span: 8 }}
            className="w-full"
          >
            <Form.Item<FieldType> label="网站名称" name="sys_app_name">
              <Input onBlur={onChangeFinish}/>
            </Form.Item>
            <Form.Item<FieldType> label="联系客服" name="sys_app_contact">
              <Input.TextArea onBlur={onChangeFinish}/>
            </Form.Item>
            <Form.Item<FieldType> label="工作时间" name="sys_app_time">
              <Input onBlur={onChangeFinish}/>
            </Form.Item>
            <Form.Item<FieldType> label="投诉Email" name="sys_app_email">
              <Input onBlur={onChangeFinish}/>
            </Form.Item>
            <Form.Item<FieldType> label="联系电话" name="sys_app_phone">
              <Input onBlur={onChangeFinish}/>
            </Form.Item>
            <Form.Item<FieldType> label="联系地址" name="sys_app_address">
              <Input onBlur={onChangeFinish}/>
            </Form.Item>

            <Form.Item<FieldType> label="备案号" name="sys_app_identity">
              <Input.TextArea onBlur={onChangeFinish}/>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}
