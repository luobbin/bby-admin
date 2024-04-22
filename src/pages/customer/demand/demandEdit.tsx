import { Form, Space, Input, Radio, Select, Button, InputNumber, App, DatePicker } from 'antd';
import type { DatePickerProps } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

import { IfDelStatus, IfVisitStatus, SourceStatus } from '#/enum';
import { ItemReq, useAdd, useUpdate } from '@/api/services/demandService';
import { useList as useRegionPage, SearchReq as SearchRegion, } from '@/api/services/regionService';
import { useList as useIndustryPage, SearchReq as SearchIndustry} from '@/api/services/industryService';
import { usePage as useMemberPage, SearchReq as SearchMember} from '@/api/services/memberService';
import { usePage as useCompanyPage, SearchReq as SearchSolution} from '@/api/services/companyService';
import { Industry, PageRes, Region } from '#/entity';
import Editor from '@/components/editor';
import { UploadBizFile } from "@/components/upload";

const dateFormat = 'YYYY-MM-DD';
const DEFAULE_VAL: ItemReq = {
  id: '',
  name: '',
  companyName: '',
  userId: 0,
  source: 0,
  regionId: 0,
  industryId: 0,
  companyId: 0,
  budget: 0,
  beginTime: dayjs().format(dateFormat),
  endTime: dayjs().format(dateFormat),
  inviteCount: 0,
  info: '',
  content: '',
  qualification: '',
  others:'',
  sort: 0,
  ifVisit: IfVisitStatus.否,
};

export default function DemandEditPage() {
  const [form] = Form.useForm();

  // 查询所有分类: 用户，地区，行业，解决方案
  const [memberList, setMemberList] = useState([]);
  const getMemberList = useMemberPage();
  const [regionList, setRegionList] = useState([]);
  const getRegionList = useRegionPage();
  const [industryList, setIndustryList] = useState([]);
  const getIndustryList = useIndustryPage();
  const [companyList, setCompanyList] = useState([]);
  const getCompanyList = useCompanyPage();
  // 初始化数据
  const currentLocation = useLocation();
  const [submitTitle, setSubmitTitle] = useState('');
  const [content, setContent] = useState('');
  const [qualification, setQualification] = useState('');
  const [othersList, setOthersList] = useState<object[]>([]);
  const [beginTime, setBeginTime] = useState('');
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
      setBeginTime(form.getFieldValue('beginTime'));
      setEndTime(form.getFieldValue('endTime'));
      if (form.getFieldValue('others') !== ''){
        setOthersList(JSON.parse(form.getFieldValue('others')));
      }
      setIfUpFile(true);
      if (form.getFieldValue('companyId') > 0){
        setCompanyId(form.getFieldValue('companyId'))
      }
    }
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
          // console.log('获取用户数据', res);
          // @ts-ignore
          const memberRes: PageRes = res;
          if (memberRes && Reflect.has(memberRes, 'list')) {
            // @ts-ignore
            memberRes.list.push({ id: 0, account: '未选择',});
            console.log('获取客户列表', memberRes.list);
            // @ts-ignore
            setMemberList(memberRes.list);
          }
        });

        // @ts-ignore
        const solutionReq: SearchSolution = {
          pageIndex: 1,
          pageSize: 10,
          Id: companyId,
        };
        await getCompanyList(solutionReq).then((res) => {
          // @ts-ignore
          const companyRes: PageRes = res;
          if (companyRes && Reflect.has(companyRes, 'list')) {
            // @ts-ignore
            companyRes.list.push({ id: 0, name: '未选择', });
            // @ts-ignore
            setCompanyList(companyRes.list);
          }
        });
        //获取列表
        // @ts-ignore
        const industryReq: SearchIndustry = {
          pageIndex: 1,
          pageSize: 10,
        };
        await getIndustryList(industryReq).then((res) => {
          // console.log('获取行业数据', res);
          // @ts-ignore
          const industryRes: Industry[] = res;
          if (industryRes) {
            // @ts-ignore
            industryRes.push({ id: 0, name: '未选择',});
            // @ts-ignore
            setIndustryList(industryRes);
          }
        });
        // @ts-ignore
        const regionReq: SearchRegion = {
          pageIndex: 1,
          pageSize: 10,
        };
        await getRegionList(regionReq).then((res) => {
          // console.log('获取行业、、地区数据', res);
          // @ts-ignore
          const regionRes: Region[] = res;
          if (regionRes) {
            // @ts-ignore
            regionRes.push({ id: 0, name: '未选择',});
            // @ts-ignore
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
  const onPickBeginTime: DatePickerProps['onChange'] = (_date, dateString) => {
    console.log('开始时间',dateString);
    if (dateString){
      setBeginTime(dateString);
    }
  };
  const onPickEndTime: DatePickerProps['onChange'] = (_date, dateString) => {
    console.log('江苏时间',dateString)
    if (dateString) {
      setEndTime(dateString);
    }
  };
  function updateOthers(values: object[]) {
    form.setFieldValue('others', JSON.stringify(values));
    setOthersList(values);
    console.log('回调到的Others：', form.getFieldValue('others'));
  }

  // 处理新增|更新
  const add = useAdd();
  const update = useUpdate();
  const { notification } = App.useApp();
  const [loading, setLoading] = useState(false);
  const handleFinish = async () => {
    setLoading(true);
    const item: ItemReq = form.getFieldsValue();
    if (othersList.length > 0){
      item.others = JSON.stringify(othersList);
    }
    item.beginTime = beginTime;
    item.endTime = endTime;
    console.log('转换数据为', item);
    try {

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
  // @ts-ignore
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
        <Form.Item<ItemReq> label="预计开始时间" name="beginTime" hidden><Input /></Form.Item>
        <Form.Item<ItemReq> label="预计结束时间" name="endTime" hidden><Input /></Form.Item>
        <Form.Item<ItemReq> label="项目名称" name="name" required>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="公司名称" name="companyName" required>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="项目简介" name="info">
          <Input.TextArea />
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
        <Form.Item<ItemReq> label="所属地区" name="regionId">
          <Select
            fieldNames={{
              label: 'name',
              value: 'id',
            }}
            style={{ width: 120 }}
            options={regionList}
          />
        </Form.Item>
        <Form.Item<ItemReq> label="所属行业" name="industryId">
          <Select
            fieldNames={{
              label: 'name',
              value: 'id',
            }}
            style={{ width: 120 }}
            options={industryList}
          />
        </Form.Item>

        <Form.Item<ItemReq> label="预算" name="budget" required>
          <InputNumber style={{ width: '50%' }} />
        </Form.Item>
        <Form.Item label="预计开始">
          {ifUpFile && <DatePicker defaultValue={dayjs(beginTime)} format={dateFormat} onChange={onPickBeginTime} />}
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
        <Form.Item<ItemReq> label="其他附件" name="others">
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
          <InputNumber style={{ width: '100%' }} />
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
        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
            {submitTitle}
          </Button>
        </Form.Item>
      </Form>
    </Space>
  );
}
