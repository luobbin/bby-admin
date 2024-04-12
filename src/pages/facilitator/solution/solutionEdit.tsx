import { Form, Space, Input, Radio, Tooltip, Button, Select, InputNumber, App } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import {
  ItemReq,
  useAdd,
  useUpdate
} from '@/api/services/solutionService';
import { IfHotStatus, IfShowStatus } from '#/enum';
import { usePage as useCompanyPage, SearchReq as SearchCompany, } from '@/api/services/companyService';
import { useList as useIndustryPage, SearchReq as SearchIndustry} from '@/api/services/industryService';
import { useList as useScenePage, SearchReq as SearchScene} from '@/api/services/sceneService';

import { Industry, Scene, PageRes } from '#/entity';
import Editor from '@/components/editor';
import { UploadAvatar } from '@/components/upload';


const DEFAULE_VAL: ItemReq = {
  id: '',
  name: '',
  ifShow: IfShowStatus.ENABLE,
  companyId: 0,
  info: '',
  demoPcLink: '',
  demoMobLink: '',
  demoAccountSet: '',
  demoCount: 0,
  contactCount: 0,
  content: '',
  advantage: '',
  functionSet: '',
  sort: 0,
  ifHot: IfHotStatus.DISABLE,
  indexImg: "",
  sceneIds: [],
  industryIds: [],
};

export default function SolutionEditPage() {
  const [form] = Form.useForm();
  const [companyList, setCompanyList] = useState([]);
  const getCompanyList = useCompanyPage();
  const [industryList, setIndustryList] = useState([]);
  const getIndustryList = useIndustryPage();
  const [sceneList, setSceneList] = useState([]);
  const getSceneList = useScenePage();
  useEffect(() => {
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
            console.log('获取公司列表', companyRes.list);
            // @ts-ignore
            setCompanyList(companyRes.list);
          }
        });
        // @ts-ignore
        const industryReq: SearchIndustry = {
          pageIndex: 1,
          pageSize: 10,
        };
        await getIndustryList(industryReq).then((res) => {
          // @ts-ignore
          const industryRes: Industry[] = res;
          if (industryRes) {
            // @ts-ignore
            industryRes.push({ id: 0, name: '未选择',});
            console.log('获取行业列表', industryRes);
            // @ts-ignore
            setIndustryList(industryRes);
          }
        });
        // @ts-ignore
        const sceneReq: SearchScene = {
          pageIndex: 1,
          pageSize: 10,
        };
        await getSceneList(sceneReq).then((res) => {
          // @ts-ignore
          const sceneRes: Scene[] = res;
          if (sceneRes) {
            // @ts-ignore
            sceneRes.push({ id: 0, name: '未选择',});
            console.log('获取场景列表', sceneRes);
            // @ts-ignore
            setSceneList(sceneRes);
          }
        });
      } finally {
        console.log('加载完成');
      }
    };
    handleList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentLocation = useLocation();
  const [formValue, setFormValue] = useState<ItemReq>();
  const [loading, setLoading] = useState(false);
  const [submitTitle, setSubmitTitle] = useState('');
  const [content, setContent] = useState('');
  const [advantage, setAdvantage] = useState('');
  const [functionSet, setFunctionSet] = useState('');
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

  const add = useAdd();
  const update = useUpdate();
  const { notification } = App.useApp();
  const handleFinish = async () => {
    setLoading(true);
    console.log("提交表单",form.getFieldsValue())
    const item: ItemReq = form.getFieldsValue();
    // @ts-ignore
    item.sceneIds = [item.sceneIds];
    // @ts-ignore
    item.industryIds = [item.industryIds];
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
        <Form.Item<ItemReq> label="ID" name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="名称" name="name" required>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="所属公司" name="companyId">
          <Select
            fieldNames={{
              label: 'name',
              value: 'id',
            }}
            style={{ width: 120 }}
            options={companyList}
          />
        </Form.Item>
        <Form.Item<ItemReq> label="所属行业" name="industryIds">
          <Select
            fieldNames={{
              label: 'name',
              value: 'id',
            }}
            style={{ width: 120 }}
            options={industryList}
          />
        </Form.Item>
        <Form.Item<ItemReq> label="所属场景" name="sceneIds">
          <Select
            fieldNames={{
              label: 'name',
              value: 'id',
            }}
            style={{ width: 120 }}
            options={sceneList}
          />
        </Form.Item>
        <Form.Item<ItemReq> label="首图" name="indexImg">
          <UploadAvatar helperText="" defaultAvatar={form.getFieldValue('indexImg')} onChange={setIndexImg}/>
        </Form.Item>
        <Form.Item<ItemReq> label="PC端体验地址" name="demoPcLink">
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="手机端体验地址" name="demoMobLink">
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="体验账号" name="demoAccountSet">
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="体验次数" name="demoCount">
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="方案简介" name="info" required>
          <Input.TextArea />
        </Form.Item>
        <Form.Item<ItemReq> label="主要内容" name="content" required>
          <Editor id="article-content-editor" value={content} onChange={setContent} />
        </Form.Item>
        <Form.Item<ItemReq> label="优势" name="advantage" required>
          <Editor id="article-advantage-editor" value={advantage} onChange={setAdvantage} />
        </Form.Item>
        <Form.Item<ItemReq> label="功能列表" name="functionSet" required>
          <Editor id="article-functionSet-editor" value={functionSet} onChange={setFunctionSet} />
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
        <Form.Item<ItemReq> label="排序" name="sort">
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
      </Form>
      <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
        <Button type="primary" htmlType="submit" className="w-full" loading={loading} onClick={handleFinish}>
          {submitTitle}
        </Button>
      </Form.Item>
    </Space>
  );
}
