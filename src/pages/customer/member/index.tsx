import { Button, Card, Popconfirm, Form, Row, Input, Col, Select, Space, Image } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';

import { ItemReq, SearchReq, PageList, usePage } from '@/api/services/memberService';
import { IconButton, Iconify } from '@/components/icon';
import ProTag from '@/theme/antd/components/tag';

import { ItemModalProps, MemberModal } from './member-modal.tsx';

import { PageRes } from '#/entity';
import { IfDelStatus, IfServiceStatus } from '#/enum';

type SearchFormFieldType = keyof SearchReq;
const PAGE_TITLE = '用户列表';
const DEFAULE_PAGE: { pageIndex: number; pageSize: number } = { pageIndex: 1, pageSize: 10 };
const DEFAULT_IMG = import.meta.env.VITE_DEFAULT_IMG as string;
// @ts-ignore
const DEFAULE_VAL: ItemReq = {
  id: '',
  account: '',
  avatar: '',
  mobile: '',
  realName: '',
  address: '',
  ifDel: IfDelStatus.否,
  ifService: 0,
};

export default function MemberPage() {
  const [searchForm] = Form.useForm();
  const [modalProps, setModalProps] = useState<ItemModalProps>({
    formValue: { ...DEFAULE_VAL },
    title: 'New',
    show: false,
    onOk: () => {
      setModalProps((prev) => {
        return { ...prev, show: false };
      });
    },
    onCancel: () => {
      setModalProps((prev) => ({ ...prev, show: false }));
    },
  });
  // 设置表格的列
  const columns: ColumnsType<PageList> = [
    {
      title: '账号',
      dataIndex: 'account',
      width: 300,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      align: 'center',
      width: 300,
      render:(avatar) =>(
        <Image width={100}
          height={100}
          src={avatar}
          fallback={DEFAULT_IMG}
        />
      ),
    },
    {
      title: '是否服务商',
      dataIndex: 'ifService',
      align: 'center',
      width: 120,
      render: (ifService) => (
        <ProTag color={ifService === IfServiceStatus.是 ? 'success' : 'error'}>
          {IfServiceStatus[ifService]}
        </ProTag>
      ),
    },
    {
      title: '是否删除',
      dataIndex: 'ifDel',
      align: 'center',
      width: 120,
      render: (ifDel) => (
        <ProTag color={ifDel === IfDelStatus.是 ? 'success' : 'error'}>
          {IfDelStatus[ifDel]}
        </ProTag>
      ),
    },
    { title: '电话', dataIndex: 'mobile', align: 'center', width: 300 },
    { title: '地址', dataIndex: 'address', align: 'center', width: 400 },
    { title: '创建时间', dataIndex: 'createdAt', align: 'center', width: 300 },
    { title: '更新时间', dataIndex: 'updatedAt', align: 'center', width: 300 },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <div className="flex w-full justify-center text-gray">
          <IconButton onClick={() => onEdit(record)}>
            <Iconify icon="solar:pen-bold-duotone" size={18} />
          </IconButton>
          <Popconfirm title="抱歉，暂不支持删除" okText="是" cancelText="否" placement="left">
            <IconButton>
              <Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
            </IconButton>
          </Popconfirm>
        </div>
      ),
    },
  ];
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagePer, setPagePer] = useState({
    pagination: {
      current: DEFAULE_PAGE.pageIndex,
      pageSize: DEFAULE_PAGE.pageSize, // 每页显示N条数据
      total: 0, // 总数据量
    },
  });
  const onCreate = () => {
    setModalProps((prev) => ({
      ...prev,
      show: true,
      title: '创建',
      formValue: {
        ...prev.formValue,
        ...DEFAULE_VAL,
      },
    }));
  };
  const onEdit = (formValue: ItemReq) => {
    // @ts-ignore
    formValue.password = null;
    setModalProps((prev) => ({
      ...prev,
      show: true,
      title: '更新',
      formValue,
    }));
  };

  const getPage = usePage();
  useEffect(() => {
    const handlePage = async () => {
      setLoading(true);
      try {
        searchForm.setFieldsValue(DEFAULE_PAGE);
        await getPage(searchForm.getFieldsValue()).then((res) => {
          // @ts-ignore
          const pageRes: PageRes = res;
          console.log('初始化转换', pageRes.list);
          if (pageRes && Reflect.has(pageRes, 'list')) {
            // @ts-ignore
            setData(pageRes.list);
            setPagePer({
              pagination: {
                current: pageRes.pageIndex,
                pageSize: pageRes.pageSize, // 每页显示N条数据
                total: pageRes.count, // 总数据量
              },
            });
            console.log('获取到数据1', data);
          }
        });
      } finally {
        setLoading(false);
      }
    };
    handlePage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onSearchReset = () => {
    searchForm.resetFields();
    searchForm.setFieldsValue(DEFAULE_PAGE);
  };

  const onSearchPage = async () => {
    setLoading(true);
    try {
      searchForm.setFieldsValue(DEFAULE_PAGE);
      const res = await getPage(searchForm.getFieldsValue());
      console.log('异步到数据', res);
      // @ts-ignore
      const pageRes: PageRes = res;
      if (pageRes && Reflect.has(pageRes, 'list')) {
        // @ts-ignore
        setData(pageRes.list);
        setPagePer({
          pagination: {
            current: pageRes.pageIndex,
            pageSize: pageRes.pageSize, // 每页显示N条数据
            total: pageRes.count, // 总数据量
          },
        });
        console.log('获取到数据2', data);
      }
    } finally {
      setLoading(false);
    }
  };
  // 切换分页
  const onChangePage = async (paging: any, filters: any, sort: any) => {
    setLoading(true);
    try {
      searchForm.setFieldValue('pageIndex', paging.current);
      searchForm.setFieldValue('pageSize', paging.pageSize);
      console.log('分页请求参数', searchForm.getFieldsValue(), filters, sort);
      const res = await getPage(searchForm.getFieldsValue());
      console.log('分页到数据', res);
      // @ts-ignore
      const pageRes: PageRes = res;
      if (pageRes && Reflect.has(pageRes, 'list')) {
        // @ts-ignore
        setData(pageRes.list);
        setPagePer({
          pagination: {
            current: pageRes.pageIndex,
            pageSize: pageRes.pageSize, // 每页显示N条数据
            total: pageRes.count, // 总数据量
          },
        });
        console.log('获取到数据3', data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical" size="large" className="w-full">
      <Card>
        <Form form={searchForm} onFinish={onSearchPage}>
          <Row gutter={[16, 16]}>
            <Col span={24} lg={6}>
              <Form.Item<SearchFormFieldType> label="名称" name="name" className="!mb-0">
                <Input />
              </Form.Item>
            </Col>
            <Col span={24} lg={6}>
              <Form.Item<SearchFormFieldType> label="删除状态" name="ifDel" className="!mb-0">
                <Select>
                  <Select.Option value="0">
                    <ProTag color="error">否</ProTag>
                  </Select.Option>
                  <Select.Option value="1">
                    <ProTag color="success">是</ProTag>
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24} lg={6}>
              <Form.Item<SearchFormFieldType> label="是否服务商" name="ifService" className="!mb-0">
                <Select>
                  <Select.Option value="0">
                    <ProTag color="error">否</ProTag>
                  </Select.Option>
                  <Select.Option value="1">
                    <ProTag color="success">是</ProTag>
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24} lg={12}>
              <Form.Item<SearchFormFieldType> label="页码" name="pageIndex" hidden>
                <Input />
              </Form.Item>
              <Form.Item<SearchFormFieldType> label="页数" name="pageSize" hidden>
                <Input />
              </Form.Item>
              <div className="flex justify-end">
                <Button onClick={onSearchReset}>重置</Button>
                <Button type="primary" htmlType="submit" className="ml-4" loading={loading}>
                  搜索
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card
        title={PAGE_TITLE}
        extra={
          <Button type="primary" onClick={onCreate}>
            添加
          </Button>
        }
      >
        <Table
          rowKey="id"
          size="small"
          scroll={{x: 'max-content'}}
          columns={columns}
          dataSource={data}
          pagination={pagePer.pagination}
          onChange={onChangePage}
        />
        <MemberModal {...modalProps} />
      </Card>
    </Space>
  );
}