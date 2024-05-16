import { Form, Space, Input, Radio, Select, Button, InputNumber, App, DatePicker } from 'antd';
import type { DatePickerProps } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

import { BusinessStatus, IfDelStatus, IfVisitStatus, SourceStatus } from '#/enum';
import { ItemReq, useAdd, useUpdate } from '@/api/services/demandService';
import { useList as useRegionPage, SearchReq as SearchRegion, } from '@/api/services/regionService';
import { useList as useScenePage, SearchReq as SearchScene} from '@/api/services/sceneService';
import {
  usePage as useMemberPage,
  SearchReq as SearchMember,
  Member
} from '@/api/services/memberService';
import {
  usePage as useCompanyPage,
  SearchReq as SearchCompany,
  Company
} from '@/api/services/companyService';
import { PageRes, Region, Scene } from '#/entity';
import Editor from '@/components/editor';
import { UploadBizFile } from '@/components/upload';

const dateFormat = 'YYYY-MM-DD';
const DEFAULE_VAL: ItemReq = {
  id: 0,
  name: '',
  companyName: '',
  contactName: '',
  contactPhone: '',
  userId: 0,
  source: 0,
  regionId: 0,
  sceneId: 0,
  companyId: 0,
  budget: 0,
  beginTime: dayjs().format(dateFormat),
  endTime: dayjs().format(dateFormat),
  inviteCount: 0,
  info: '',
  content: '',
  qualification: '',
  otherSet:'',
  sort: 0,
  ifVisit: IfVisitStatus.否,
  status:BusinessStatus.待处理
};

export default function DemandEditPage() {
  const [form] = Form.useForm();
  // 查询所有分类: 用户，地区，行业，解决方案
  const [memberList, setMemberList] = useState<Member[]>([]);
  const getMemberList = useMemberPage();
  const [regionList, setRegionList] = useState<Region[]>([]);
  const getRegionList = useRegionPage();
  const [sceneList, setSceneList] = useState<Scene[]>([]);
  const getSceneList = useScenePage();
  const [companyList, setCompanyList] = useState<Company[]>([]);
  const getCompanyList = useCompanyPage();
  // 初始化数据
  const currentLocation = useLocation();
  const [submitTitle, setSubmitTitle] = useState('');
  const [content, setContent] = useState('');
  const [qualification, setQualification] = useState('');
  const [othersList, setOthersList] = useState<object[]>([]);
  const [endTime, setEndTime] = useState('');
  const [ifUpFile, setIfUpFile] = useState(false);
  const [companyId, setCompanyId] = useState(0);
  useEffect(() => {
    if (currentLocation.state){
      const { title, params } = currentLocation.state;
      form.setFieldsValue(title === '创建'? DEFAULE_VAL : params);
      setSubmitTitle(title);
      console.log("初始化数据", form.getFieldsValue());
      setContent(form.getFieldValue('content'));
      setQualification(form.getFieldValue('qualification'));
      setEndTime(form.getFieldValue('endTime'));
      if (form.getFieldValue('otherSet') !== ''){
        setOthersList(JSON.parse(form.getFieldValue('otherSet')));
      }
      if (form.getFieldValue('companyId') > 0){
        setCompanyId(form.getFieldValue('companyId'))
      }
      setIfUpFile(true);
    }
    //加载类目
    const handleList = async () => {
      try {
        const memberReq: SearchMember = {
          pageIndex: 1,
          pageSize: 10,
          ifDel: IfDelStatus.否,
        };
        await getMemberList(memberReq).then((res) => {
          // @ts-ignore
          const memberRes: PageRes<Member> = res;
          if (memberRes && memberRes.list) {
            // @ts-ignore
            memberRes.list.push({ id: 0, account: '未选择'});
            setMemberList(memberRes.list);
          }
        });

        const companyReq: SearchCompany = {
          pageIndex: 1,
          pageSize: 10,
          Id: companyId,
        };
        await getCompanyList(companyReq).then((res) => {
          // @ts-ignore
          const companyRes: PageRes<Company> = res;
          if (companyRes && companyRes.list) {
            // @ts-ignore
            companyRes.list.push({ id: 0, name: '未选择'});
            setCompanyList(companyRes.list);
          }
        });

        const sceneReq: SearchScene = {
          pageIndex: 1,
          pageSize: 10,
        };
        await getSceneList(sceneReq).then((res) => {
          // @ts-ignore
          const industryRes: Scene[] = res;
          if (industryRes) {
            // @ts-ignore
            industryRes.push({ id: 0, name: '未选择'});
            setSceneList(industryRes);
          }
        });

        const regionReq: SearchRegion = {
          pageIndex: 1,
          pageSize: 10,
        };
        await getRegionList(regionReq).then((res) => {
          // @ts-ignore
          const regionRes: Region[] = res;
          if (regionRes) {
            // @ts-ignore
            regionRes.push({ id: 0, name: '未选择'});
            setRegionList(regionRes);
          }
        });
      } finally {
        console.log('类目加载完成');
      }
    };
    handleList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //处理时间
  const onPickEndTime: DatePickerProps['onChange'] = (_date, dateString) => {
    if (dateString) {
      setEndTime(dateString);
    }
  };
  function updateOthers(values: object[]) {
    form.setFieldValue('otherSet', JSON.stringify(values));
  }

  // 处理新增|更新
  const add = useAdd();
  const update = useUpdate();
  const { notification } = App.useApp();
  const [loading, setLoading] = useState(false);
  const handleFinish = async () => {
    setLoading(true);
    const item: ItemReq = form.getFieldsValue();
    item.endTime = endTime;
    console.log('转换数据为', item);
    try {

      let res;
      if (item.id===0) {
        res = await add(item);
        console.log('新增的数据结果为', res);
      } else {
        res = await update(item);
        console.log('修改的数据结果为', res);
      }
      if (res){
        form.setFieldsValue(DEFAULE_VAL);
        notification.success({
          message: "成功",
          description: "提交成功",
          duration: 3
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <Form
        initialValues={form}
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
        onFinish={handleFinish}
      >
        <Form.Item<ItemReq> label="ID" name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="项目名称" name="name" required>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="项目简介" name="info">
          <Input.TextArea />
        </Form.Item>
        <Form.Item<ItemReq> label="项目企业名称" name="companyName" required>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="项目联系人" name="contactName" required>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="项目联系方式" name="contactPhone" required>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="所属用户" name="userId">
          <Select
            fieldNames={{
              label: 'account',
              value: 'id',
            }}
            style={{ width: 120 }}
            options={memberList}
          />
        </Form.Item>
        <Form.Item<ItemReq> label="所在地区" name="regionId">
          <Select
            fieldNames={{
              label: 'name',
              value: 'id',
            }}
            style={{ width: 120 }}
            options={regionList}
          />
        </Form.Item>
        <Form.Item<ItemReq> label="所属场景" name="sceneId">
          <Select
            fieldNames={{
              label: 'name',
              value: 'id',
            }}
            style={{ width: 120 }}
            options={sceneList}
          />
        </Form.Item>

        <Form.Item<ItemReq> label="预算" name="budget" required>
          <InputNumber style={{ width: '50%' }} />
        </Form.Item>
        <Form.Item label="预计结束">
          {ifUpFile && <DatePicker defaultValue={dayjs(endTime)} format={dateFormat} onChange={onPickEndTime} />}
        </Form.Item>
        <Form.Item<ItemReq> label="对接次数" name="inviteCount">
          <InputNumber style={{ width: '50%' }} />
        </Form.Item>
        <Form.Item<ItemReq> label="项目介绍" name="content">
          <Editor id="article-content-editor" value={content} onChange={setContent} />
        </Form.Item>
        <Form.Item<ItemReq> label="资质要求" name="qualification">
          <Editor id="article-qualification-editor" value={qualification} onChange={setQualification} />
        </Form.Item>
        <Form.Item<ItemReq> label="其他附件" name="otherSet">
          {ifUpFile && <UploadBizFile defaultList={othersList} onChange={updateOthers} />}
        </Form.Item>

        <Form.Item<ItemReq> label="发布来源" name="source" required>
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio value={SourceStatus.sys}> 系统 </Radio>
            <Radio value={SourceStatus.cust}> 客户 </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item<ItemReq> label="是否需要上门" name="ifVisit" required>
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio value={IfVisitStatus.否}> 否 </Radio>
            <Radio value={IfVisitStatus.是}> 是 </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item<ItemReq> label="排序" name="sort">
          <InputNumber />
        </Form.Item>
        <Form.Item<ItemReq> label="分配对接服务商" name="companyId">
          <Select
            fieldNames={{
              label: 'name',
              value: 'id',
            }}
            style={{ width: 120 }}
            options={companyList}
          />
        </Form.Item>
        <Form.Item<ItemReq> label="对接状态" name="status" required>
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio value={BusinessStatus.待处理}> {BusinessStatus[0]} </Radio>
            <Radio value={BusinessStatus.对接中}> {BusinessStatus[1]} </Radio>
            <Radio value={BusinessStatus.对接成功}> {BusinessStatus[2]} </Radio>
            <Radio value={BusinessStatus.对接失败}> {BusinessStatus[3]} </Radio>
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
