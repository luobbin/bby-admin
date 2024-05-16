import { Button, Card, Popconfirm, Form, Row, Input, Col, Select, Space, message } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useState, useEffect} from'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Iconify } from '@/components/icon';
import ProTag from '@/theme/antd/components/tag';
import dayjs from 'dayjs';

import { PageRes } from '#/entity';
import { IfDelStatus, IfVisitStatus, SourceStatus } from "#/enum";
import { ItemReq, PageItem, SearchReq, usePage, ItemDelReq, useDel } from '@/api/services/demandService';

type SearchFormFieldType = keyof SearchReq;
const PAGE_TITLE = '需求 列表';
const DEFAULE_PAGE : SearchReq = { pageIndex:1, pageSize:10, idOrder:'desc'};

export default function DemandPage() {
  const getPage = usePage();
  const [searchForm] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PageItem[]>([]);
  const [pagePer, setPagePer] = useState({
    pagination: {
      current: DEFAULE_PAGE.pageIndex,
      pageSize: DEFAULE_PAGE.pageSize, // 每页显示N条数据
      total: 0, // 总数据量
    },
  });

  useEffect(() => {
    handlePage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreate = () => {
    navigate('/customer/demandEdit', { state: { title: '创建', params: '' } });
  };
  const onEdit = (formValue: ItemReq) => {
    navigate('/customer/demandEdit', { state: { title: '更新', params: formValue } });
  };

  const del = useDel();
  const onDel = async (id: number) => {
    const params: ItemDelReq = {
      ids: [id]
    }
    const res = await del(params);
    if (res){
      const newData = data.filter(item => item.id !== id);
      // 更新数据源
      setData(newData);
      message.success("删除成功！")
    }
  }

  const onSearchReset = () => {
    searchForm.resetFields();
    searchForm.setFieldsValue(DEFAULE_PAGE);
    handlePage();
  };

  const onSearchPage = async () => {
    handlePage();
  };
  // 切换分页
  const onChangePage = async (paging:any, _filters:any, _sort:any) => {
    searchForm.setFieldValue('pageIndex', paging.current);
    searchForm.setFieldValue('pageSize', paging.pageSize);
    handlePage();
  };

  const handlePage = async () => {
    setLoading(true);
    try {
      await getPage(searchForm.getFieldsValue()).then((res) => {
        // @ts-ignore
        const pageRes : PageRes<PageItem> = res;
        if (pageRes && pageRes.list) {
          setData(pageRes.list);
          setPagePer({
            pagination: {
              current: pageRes.pageIndex,
              pageSize: pageRes.pageSize, // 每页显示N条数据
              total: pageRes.count, // 总数据量
            },
          });
          console.log("获取到数据1", data);
        }
      });
    } finally {
      setLoading(false);
    }
  };
  const columns: ColumnsType<PageItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 50,
    },
    {
      title: '项目名称',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '项目企业名称',
      dataIndex: 'companyName',
      width: 150,
    },
    {
      title: '项目联系人',
      dataIndex: 'contactName',
      width: 100,
    },
    {
      title: '项目联系方式',
      dataIndex: 'contactPhone',
      width: 100,
    },
    {
      title: '来源',
      dataIndex: 'source',
      width: 120,
      render: (source) => (
        source===SourceStatus.sys ? <ProTag color="success">平台</ProTag> : <ProTag color="default">个人</ProTag>
      ),
    },
    {
      title: '所属用户',
      dataIndex: 'tUser',
      width: 100,
      render: (tUser) => (
        <div>{tUser?.account||'平台'}</div>
      ),
    },
    {
      title: '所属地区',
      dataIndex: 'tRegion',
      width: 120,
      render: (tRegion) => (
        <ProTag color="success">{tRegion?.name}</ProTag>
      ),
    },
    {
      title: '所属场景',
      dataIndex: 'tScene',
      width: 150,
      render: (tScene) => (
        <ProTag color="processing">{tScene?.name}</ProTag>
      ),
    },
    {
      title: '预计结束',
      dataIndex: 'endTime',
      align: 'center',
      width: 120,
      render: (endTime) => (
        dayjs(endTime).format('YYYY-MM-DD')
      )
    },
    {
      title: '是否上门',
      dataIndex: 'ifVisit',
      align: 'center',
      width: 100,
      render: (ifVisit) => (
        <ProTag color={ifVisit === IfVisitStatus.否 ? 'success' : 'error'}>
          {IfDelStatus[ifVisit]}
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
      title: 'Action',
      key: 'operation',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <div className="flex w-full justify-center text-gray">
          <IconButton onClick={() => onEdit(record)}>
            <Iconify icon="solar:pen-bold-duotone" size={18} />
          </IconButton>
          <Popconfirm title="确定删除" okText="Yes" cancelText="No" placement="left" onConfirm={() => onDel(record.id)}>
            <IconButton>
              <Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
            </IconButton>
          </Popconfirm>
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
              <Form.Item<SearchFormFieldType> label="项目名称" name="name" className="!mb-0">
                <Input />
              </Form.Item>
            </Col>
            <Col span={24} lg={6}>
              <Form.Item<SearchFormFieldType> label="公司名称" name="companyName" className="!mb-0">
                <Input />
              </Form.Item>
            </Col>
            <Col span={24} lg={6}>
              <Form.Item<SearchFormFieldType> label="是否上门" name="ifVisit" className="!mb-0">
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
        extra={<Button type="primary" onClick={onCreate}>
          添加
        </Button>}
      >
        <Table
          rowKey="id"
          size="small"
          scroll={{ x: "max-content" }}
          columns={columns}
          dataSource={data}
          pagination={pagePer.pagination}
          onChange={onChangePage}
        />

      </Card>
    </Space>
  );
}
