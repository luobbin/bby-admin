import { Form, Space, Input, InputNumber, Select, App, Button, DatePicker } from 'antd';
import type { DatePickerProps } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

import { ItemReq, useAdd, useUpdate } from '@/api/services/caseService';
import { useList as useRegionPage, SearchReq as SearchRegion, } from '@/api/services/regionService';
import { usePage as useCompanyPage, SearchReq as SearchCompany} from '@/api/services/companyService';
import { useList as useIndustryPage, SearchReq as SearchIndustry} from '@/api/services/industryService';
import { usePage as useSolutionPage, SearchReq as SearchSolution} from '@/api/services/solutionService';
import { Industry, PageRes, Region } from '#/entity';
import Editor from "@/components/editor";

const dateFormat = 'YYYY-MM-DD';
const DEFAULE_VAL: ItemReq = {
  id: "",
  name: "",
  companyId: 0,
  customerName: "",
  info: "",
  regionId: 0,
  industryId: 0,
  solutionId: 0,
  dealAmount: 0,
  beginTime: dayjs().format(dateFormat),
  endTime: dayjs().format(dateFormat),
  content: "",
  qualification: "",
  others: "",
  sort: 0,
};

export default function ItemReqEditPage() {
  const [form] = Form.useForm();
  //初始化数据
  const currentLocation = useLocation();
  const [submitTitle, setSubmitTitle] = useState('');
  const [content, setContent] = useState('');
  const [qualification, setQualification] = useState('');
  const [others, setOthers] = useState('');
  const [beginTime, setBeginTime] = useState(dayjs().format(dateFormat));
  const [endTime, setEndTime] = useState(dayjs().format(dateFormat));
  const [companyList, setCompanyList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [industryList, setIndustryList] = useState([]);
  const [solutionList, setSolutionList] = useState([]);
  const getCompanyList = useCompanyPage();
  const getRegionList = useRegionPage();
  const getIndustryList = useIndustryPage();
  const getSolutionList = useSolutionPage();
  useEffect(() => {
    //初始化参数
    if (currentLocation.state){
      const { title, params } = currentLocation.state;
      form.setFieldsValue(title === '创建'? DEFAULE_VAL : params);
      setSubmitTitle(title);
      setContent(form.getFieldValue('content'));
      setQualification(form.getFieldValue('qualification'));
      setOthers(form.getFieldValue('others'));
      setBeginTime(form.getFieldValue('beginTime'));
      setEndTime(form.getFieldValue('endTime'));
    }
    //类目获取
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
          // @ts-ignore
          const regionRes: Region[] = res;
          if (regionRes) {
            // @ts-ignore
            regionRes.push({ id: 0, name: '未选择',});
            // @ts-ignore
            setRegionList(regionRes);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  //处理时间
  const onPickBeginTime: DatePickerProps['onChange'] = (_date, dateString) => {
    if (dateString && dateString !== ''){
      console.log("更新的beginTime:", dateString);
      setBeginTime(dateString);
    }
  };
  const onPickEndTime: DatePickerProps['onChange'] = (_date, dateString) => {
    if (dateString && dateString !== '') {
      console.log("更新的endTime:", dateString);
      setEndTime(dateString);
    }
  };

  // 处理新增|更新
  const add = useAdd();
  const update = useUpdate();
  const [loading, setLoading] = useState(false);
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
        <Form.Item<ItemReq> label="名称" name="name" required>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="客户名称" name="customerName" required>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="简介" name="info" required>
          <Input.TextArea />
        </Form.Item>
        <Form.Item<ItemReq> label="成交额" name="dealAmount" required>
          <InputNumber style={{ width: '50%' }} />
        </Form.Item>
        <Form.Item label="项目开始">
          <DatePicker defaultValue={dayjs(beginTime)} format={dateFormat} onChange={onPickBeginTime} />
        </Form.Item>
        <Form.Item label="项目结束">
          <DatePicker defaultValue={dayjs(endTime)} format={dateFormat} onChange={onPickEndTime} />
        </Form.Item>
        <Form.Item<ItemReq> label="所属服务商" name="companyId">
          <Select
            fieldNames={{
              label: 'name',
              value: 'id',
            }}
            style={{ width: 120 }}
            options={companyList}
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
        <Form.Item<ItemReq> label="项目介绍" name="content">
          <Editor id="article-content-editor" value={content} onChange={setContent} />
        </Form.Item>
        <Form.Item<ItemReq> label="资质要求" name="qualification">
          <Editor id="article-qualification-editor" value={qualification} onChange={setQualification} />
        </Form.Item>
        <Form.Item<ItemReq> label="其他附件" name="others">
          <Editor id="article-others-editor" value={others} onChange={setOthers} />
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
