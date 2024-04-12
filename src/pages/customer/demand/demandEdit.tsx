import { Form, Space, Input, Radio, Select, Button, InputNumber, App, DatePicker } from 'antd';
import type { DatePickerProps } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

import { IfDelStatus, IfVisitStatus, SourceStatus } from '#/enum';
import { ItemReq, useAdd, useUpdate } from '@/api/services/demandService';
import { useList as useRegionPage, SearchReq as SearchRegion, } from '@/api/services/regionService';
import { usePage as useMemberPage, SearchReq as SearchMember} from '@/api/services/memberService';
import { useList as useIndustryPage, SearchReq as SearchIndustry} from '@/api/services/industryService';
import { usePage as useSolutionPage, SearchReq as SearchSolution} from '@/api/services/solutionService';
import { Industry, PageRes, Region } from '#/entity';
import Editor from '@/components/editor';

const dateFormat = 'YYYY-MM-DD';
const DEFAULE_VAL: ItemReq = {
  id: '',
  name: '',
  companyName: '',
  userId: 0,
  source: 0,
  regionId: 0,
  industryId: 0,
  solutionId: 0,
  budget: 0,
  beginTime: dayjs().format(dateFormat),
  endTime: dayjs().format(dateFormat),
  inviteCount: 0,
  info: '',
  content: '',
  qualification: '',
  others:'',
  ifDel: IfDelStatus.NO,
  sort: 0,
  ifVisit: IfVisitStatus.否,
};

export default function DemandEditPage() {
  const [form] = Form.useForm();
  // 查询所有分类: 用户，地区，行业，解决方案
  const [memberList, setMemberList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [industryList, setIndustryList] = useState([]);
  const [solutionList, setSolutionList] = useState([]);
  const getMemberList = useMemberPage();
  const getRegionList = useRegionPage();
  const getIndustryList = useIndustryPage();
  const getSolutionList = useSolutionPage();
  useEffect(() => {
    const handleMember = async () => {
      try {
        // @ts-ignore
        const memberReq: SearchMember = {
          pageIndex: 1,
          pageSize: 10,
          ifDel: IfDelStatus.NO,
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
        };
        await getSolutionList(solutionReq).then((res) => {
          // console.log('获取方案数据', res);
          // @ts-ignore
          const solutionRes: PageRes = res;
          if (solutionRes && Reflect.has(solutionRes, 'list')) {
            // @ts-ignore
            solutionRes.list.push({ id: 0, name: '未选择', });
            console.log('获取解决方案列表', solutionRes.list);
            // @ts-ignore
            setSolutionList(solutionRes.list);
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
            console.log('获取行业列表', industryRes);
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
            console.log('获取地区列表', regionRes);
            // @ts-ignore
            setRegionList(regionRes);
          }
        });
      } finally {
        console.log('加载完成');
      }
    };
    handleMember();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [formValue, setFormValue] = useState<ItemReq>();
  const [loading, setLoading] = useState(false);
  const [submitTitle, setSubmitTitle] = useState('');
  const [content, setContent] = useState('');
  const [qualification, setQualification] = useState('');
  const [others, setOthers] = useState('');
  const [beginTime, setBeginTime] = useState(dayjs().format(dateFormat));
  const [endTime, setEndTime] = useState(dayjs().format(dateFormat));
  // 初始化数据
  const currentLocation = useLocation();
  useEffect(() => {
    if (currentLocation.state){
      const { title, params } = currentLocation.state;
      setFormValue(title === '创建'? DEFAULE_VAL : params);
      setSubmitTitle(title);
    }
    console.log("初始化数据", formValue);
    if (formValue){
      console.log('formValue',formValue);
      setEndTime(formValue.endTime);
      setBeginTime(formValue.beginTime);
      form.setFieldsValue(formValue);
    }

  }, [formValue, form]);
  //处理时间
  const onPickBeginTime: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
    setBeginTime(dateString);
  };
  const onPickEndTime: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
    setEndTime(dateString);
  };

  // 处理新增|更新
  const add = useAdd();
  const update = useUpdate();
  const { notification } = App.useApp();
  const handleFinish = async () => {
    setLoading(true);
    form.setFieldValue('endTime',endTime);
    form.setFieldValue('beginTime',beginTime);
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
  // @ts-ignore
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
        <Form.Item<ItemReq> label="分配解决方案" name="solutionId">
          <Select
            fieldNames={{
              label: 'name',
              value: 'id',
            }}
            style={{ width: 120 }}
            options={solutionList}
          />
        </Form.Item>

        <Form.Item<ItemReq> label="预算" name="budget" required>
          <InputNumber style={{ width: '50%' }} />
        </Form.Item>
        <Form.Item label="预计开始">
          <DatePicker defaultValue={dayjs(beginTime)} format={dateFormat} onChange={onPickBeginTime} />
        </Form.Item>
        <Form.Item label="预计结束">
          <DatePicker defaultValue={dayjs(endTime)} format={dateFormat} onChange={onPickEndTime} />
        </Form.Item>
        <Form.Item<ItemReq> label="对接次数" name="inviteCount" required>
          <InputNumber style={{ width: '50%' }} />
        </Form.Item>
        <Form.Item<ItemReq> label="项目介绍" name="content">
          <Editor id="article-content-editor" value={content} onChange={setContent} />
        </Form.Item>
        <Form.Item<ItemReq> label="资质要求" name="qualification">
          <Editor id="article-qualification-editor" value={qualification} onChange={setQualification} />
        </Form.Item>
        <Form.Item<ItemReq> label="其他附件" name="others">
          <Editor id="article-others-editor" value={others} onChange={setOthers} />
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
        <Form.Item<ItemReq> label="是否删除" name="ifDel" required>
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio value={IfDelStatus.NO}> 否 </Radio>
            <Radio value={IfDelStatus.YES}> 是 </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item<ItemReq> label="排序" name="sort">
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
