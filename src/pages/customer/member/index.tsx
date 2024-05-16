import { Button, Card, Form, Row, Input, Col, Select, Space, Image } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

import { ItemReq, SearchReq, PageItem, usePage } from '@/api/services/memberService';
import { IconButton, Iconify } from '@/components/icon';
import ProTag from '@/theme/antd/components/tag';

import { ItemModalProps, MemberModal } from './member-modal.tsx';

import { PageRes } from '#/entity';
import { IfDelStatus, IfServiceStatus } from '#/enum';

type SearchFormFieldType = keyof SearchReq;
const PAGE_TITLE = '用户列表';
const DEFAULE_PAGE: SearchReq = { pageIndex: 1, pageSize: 10, idOrder:'desc'};
const DEFAULT_IMG = import.meta.env.VITE_DEFAULT_IMG as string;
const DEFAULE_VAL: ItemReq = {
  id: 0,
  account: '',
  password: null,
  avatar: '',
  mobile: '',
  realName: '',
  address: '',
  ifDel: IfDelStatus.否,
  ifService: 0,
};

export default function MemberPage() {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PageItem[]>([]);
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
  const [pagePer, setPagePer] = useState({
    pagination: {
      current:DEFAULE_PAGE.pageIndex,
      pageSize:DEFAULE_PAGE.pageSize,
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
    searchForm.setFieldsValue({...DEFAULE_VAL})
    handlePage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onSearchReset = () => {
    searchForm.resetFields();
    searchForm.setFieldsValue(DEFAULE_PAGE);
    handlePage();
  };

  const onSearchPage = async () => {
    handlePage();
  };

  // 切换分页
  const onChangePage = async (paging: any, _filters: any, _sort: any) => {
    searchForm.setFieldValue('pageIndex', paging.current);
    searchForm.setFieldValue('pageSize', paging.pageSize);
    handlePage();
  };
  const handlePage = async () => {
    setLoading(true);
    try {
      await getPage(searchForm.getFieldsValue()).then((res) => {
        // @ts-ignore
        const pageRes: PageRes<PageItem> = res;
        if (pageRes && pageRes.list) {
          setData(pageRes.list);
          setPagePer({
            pagination: {
              current: pageRes.pageIndex,
              pageSize: pageRes.pageSize, // 每页显示N条数据
              total: pageRes.count, // 总数据量
            },
          });
        }
      });
    } finally {
      setLoading(false);
    }
  };
  // 设置表格的列
  const columns: ColumnsType<PageItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '账号',
      dataIndex: 'account',
      width: 100,
    },
    { title: '手机号', dataIndex: 'mobile', align: 'center', width: 120 },
    {
      title: '头像',
      dataIndex: 'avatar',
      align: 'center',
      width: 120,
      render:(avatar) =>(
        <Image height={60}
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
    { title: '地址', dataIndex: 'address', align: 'center', width: 400 },
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
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      align: 'center',
      width: 200,
      render: (createdAt) => (
        dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')
      )
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      align: 'center',
      width: 200,
      render: (updatedAt) => (
        dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss')
      )
    },
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
        </div>
      ),
    },
  ];
  return (
    <Space direction="vertical" size="large" className="w-full">
      <Card>
        <Form initialValues={DEFAULE_PAGE} form={searchForm} onFinish={onSearchPage}>
          <Form.Item<SearchFormFieldType> label="页码" name="pageIndex" hidden>
            <Input />
          </Form.Item>
          <Form.Item<SearchFormFieldType> label="页数" name="pageSize" hidden>
            <Input />
          </Form.Item>
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
