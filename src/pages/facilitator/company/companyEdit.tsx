import { Form, Space, Input, Radio, Tooltip, Button, App, InputNumber, Select, TreeSelect } from 'antd';
import { useEffect, useState } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';

import { CompanyReq as ItemReq, useAdd, useUpdate } from '@/api/services/companyService';
import { IfDelStatus, IfHotStatus, IfServiceStatus, IfShowStatus } from "#/enum";
import Editor from '@/components/editor';
import { UploadAvatar, UploadBizFile } from '@/components/upload';
import { PageRes } from '#/entity';

import { usePage as useMemberPage, SearchReq as SearchMember} from '@/api/services/memberService';
import { useList as useRegionPage, SearchReq as SearchRegion, } from '@/api/services/regionService';
import { useList as useSupportPage, SearchReq as SearchSupport} from '@/api/services/supportService';

const DEFAULE_VAL: ItemReq = {
  id: 0,
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
  customerCount:0,
  solutionCount:0,
  supportIds: [],
  regionIds: [],
};

export default function CompanyEditPage() {
  const [form] = Form.useForm();

  //首次加载：类目+初始化
  const currentLocation = useLocation();
  const [submitTitle, setSubmitTitle] = useState('');
  const [contactSet, setContactSet] = useState('');
  const [logo, setLogo] = useState('');
  const [indexImg, setIndexImg] = useState('');
  const [qualificationList, setQualificationList] = useState<object[]>([]);
  const [memberList, setMemberList] = useState([]);
  const getMemberList = useMemberPage();
  const [regionList, setRegionList] = useState([]);
  const getRegionList = useRegionPage();
  const [supportList, setSupportList] = useState([]);
  const getSupportList = useSupportPage();
  const [ifUpFile, setIfUpFile] = useState(false);
  useEffect(() => {
    //初始化参数
    if (currentLocation.state){
      const { title, params } = currentLocation.state;
      form.setFieldsValue(title === '创建'? DEFAULE_VAL : params);
      setSubmitTitle(title);
      console.log("初始化数据", form.getFieldsValue());
      setContactSet(form.getFieldValue('contactSet'));
      setLogo(form.getFieldValue('logo'));
      setIndexImg(form.getFieldValue('indexImg'))
      if (form.getFieldValue('abilitySet') !== ''){
        form.setFieldValue('abilityList', JSON.parse(form.getFieldValue('abilitySet')));
      }
      if (form.getFieldValue('qualificationSet') !== ''){
        setQualificationList(JSON.parse(form.getFieldValue('qualificationSet')));
      }
      setIfUpFile(true);
    }
    //加载类目
    const handleList = async() => {
      try {
        // @ts-ignore
        const memberReq: SearchMember = submitTitle=='创建'?{
          pageIndex: 1,
          pageSize: 10,
          ifDel: IfDelStatus.否,
          ifService: IfServiceStatus.否,
        } : {
          id: form.getFieldValue('userId'),
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
        // @ts-ignore
        const supportReq: SearchSupport = {
          pageIndex: 1,
          pageSize: 10,
        };
        await getSupportList(supportReq).then((supportRes) => {
          if (supportRes) {
            // @ts-ignore
            supportRes.push({ id: 0, name: '未选择',});
            // @ts-ignore
            setSupportList(supportRes);
          }
        });

      }finally {
        console.log('类目加载完成');
      }

    }
    handleList();
  }, []);

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

  function updateQualification(values: object[]) {
    form.setFieldValue('qualificationSet', JSON.stringify(values));
    setQualificationList(values);
    console.log('回调到的Qualification：', form.getFieldValue('qualificationSet'));
  }

  const renderUserSelect = submitTitle==='创建'?
    <Select
      fieldNames={{
        label: 'account',
        value: 'id',
      }}
      style={{ width: 120 }}
      options={memberList}
    />
  :
    <Select
      fieldNames={{
        label: 'account',
        value: 'id',
      }}
      style={{ width: 120 }}
      options={memberList}
      disabled
    />;

  //更新|新增
  const add = useAdd();
  const update = useUpdate();
  const { notification } = App.useApp();
  const [loading, setLoading] = useState(false);
  const handleFinish = async () => {
    setLoading(true);
    // @ts-ignore
    const item: ItemReq = form.getFieldsValue();
    item.abilitySet = JSON.stringify(form.getFieldValue('abilityList'));
    item.qualificationSet = JSON.stringify(qualificationList);
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
        console.log("获取到新表单值：",form.getFieldsValue());
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
        <Form.Item<ItemReq> label="公司名称" name="name" required>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="公司LOGO" name="logo" required>
          <UploadAvatar helperText="" defaultAvatar={logo} onChange={updateLogo}/>
        </Form.Item>
        <Form.Item<ItemReq> label="场景展示图片" name="indexImg" required>
          <UploadAvatar helperText="" defaultAvatar={indexImg} onChange={updateIndexImg}/>
        </Form.Item>
        <Form.Item<ItemReq> label="所属用户" name="userId" required >
          {renderUserSelect}
        </Form.Item>
        <Form.Item<ItemReq> label="所属地区" name="regionIds" required>
          <TreeSelect
            multiple
            showSearch
            allowClear
            treeDefaultExpandAll
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择"
            fieldNames={{
              label: 'name',
              value: 'id',
              children: 'children',
            }}
            treeData={regionList}
          />
        </Form.Item>
        <Form.Item<ItemReq> label="支持服务" name="supportIds">
          <TreeSelect
            multiple
            showSearch
            allowClear
            treeDefaultExpandAll
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择"
            fieldNames={{
              label: 'name',
              value: 'id',
              children: 'children',
            }}
            treeData={supportList}
          />
        </Form.Item>
        <Form.Item<ItemReq> label="公司电话" name="mobile" required>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="公司地址" name="address">
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="介绍" name="info">
          <Input.TextArea />
        </Form.Item>
        <Form.Item<ItemReq> label="资质认证">
          {ifUpFile && <UploadBizFile defaultList={qualificationList} onChange={updateQualification} />}
        </Form.Item>
        <Form.Item label={'能力列表'}>
          <Form.List
            name="abilityList"
            rules={[
               {
                 validator: async (_, names) => {
                   if (!names || names.length < 1) {
                     return Promise.reject(new Error('至少要输入一个能力'));
                   }
                 },
               },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, _index) => (
                  <Form.Item
                    required={false}
                    key={field.key}
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "请输入或者删除此栏目.",
                        },
                      ]}
                      noStyle
                    >
                      <Input placeholder="请输入" style={{ width: '90%' }} />
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => remove(field.name)}
                      />
                    ) : null}
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: '60%' }}
                    icon={<PlusOutlined />}
                  >
                    添加能力
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>

        <Form.Item<ItemReq> label="在线咨询" name="contactSet">
          <Editor id="article-contactSet-editor" value={contactSet} onChange={setContactSet} />
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
            <Radio value={IfHotStatus.是}> 是 </Radio>
            <Radio value={IfHotStatus.否}> 否 </Radio>
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
