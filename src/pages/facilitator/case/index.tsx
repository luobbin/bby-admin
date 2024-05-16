import { Button, Card, Popconfirm, Form, Row, Input, Col, Select, Space, message } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { IconButton, Iconify } from '@/components/icon';
import ProTag from '@/theme/antd/components/tag';

import { PageRes, Scene } from '#/entity';
import { SearchReq, usePage, PageItem,ItemDelReq, useDel } from '@/api/services/caseService';
type SearchFormFieldType = keyof SearchReq;
const PAGE_TITLE = '案例 列表';
const DEFAULE_PAGE : SearchReq= { pageIndex:1, pageSize:10, idOrder:'desc' };

export default function SupportPage() {
  const [searchForm] = Form.useForm();
  const getPage = usePage();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PageItem[]>([]);
  const [pagePer, setPagePer] = useState({
    pagination: {
      current: DEFAULE_PAGE.pageIndex,
      pageSize: DEFAULE_PAGE.pageSize, // 每页显示N条数据
      total: 0, // 总数据量
    },
  });
  const del = useDel();
  const confirmDel = async (id: number) => {
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

  useEffect(() => {
    searchForm.setFieldsValue({...DEFAULE_PAGE})
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

  //设置表格的列
  const columns: ColumnsType<PageItem> = [
    {
      title: "名称",
      dataIndex: "name",
      width: 100
    },
    {
      title: "简介",
      dataIndex: "info",
      width: 300,
      render: (info) => <div className="line-clamp-3">{info}</div>,
    },
    {
      title: "客户企业名称",
      dataIndex: "customerName",
      width: 200
    },
    {
      title: "客户企业地址",
      dataIndex: "customerAddressInfo",
      width: 120
    },
    {
      title: "客户负责人",
      dataIndex: "customerLeader",
      width: 100
    },
    {
      title: "所属场景",
      dataIndex: "tScene",
      width: 200,
      render: (tScene) => <div>
        {tScene?.map((val:Scene) =>(
          <ProTag color="success" key={val.id}>{val.name}</ProTag>
        ))}
      </div>,
    },
    {
      title: "所属地区",
      dataIndex: "tRegion",
      width: 100,
      render: (tRegion) => <div>{tRegion.name}</div>,
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
      title: "操作",
      key: "operation",
      align: "center",
      width: 120,
      render: (_, record) => (
        <div className="flex w-full justify-center text-gray">
          <a href={`/case/detail?id=${record.id}`} target={"_blank"}>
            <IconButton><Iconify icon="hugeicons:view" size={18} /></IconButton>
          </a>
          <Popconfirm title="确定要删除" okText="是" cancelText="否" placement="left"
                      onConfirm={() => confirmDel(record.id)}>
            <IconButton>
              <Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
            </IconButton>
          </Popconfirm>
        </div>
      )
    }
  ];

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
              <Form.Item<SearchFormFieldType> label="状态" name="ifShow" className="!mb-0">
                <Select>
                  <Select.Option value="0">
                    <ProTag color="primary">待定</ProTag>
                  </Select.Option>
                  <Select.Option value="1">
                    <ProTag color="success">显示</ProTag>
                  </Select.Option>
                  <Select.Option value="2">
                    <ProTag color="error">禁用</ProTag>
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
      <Card title={PAGE_TITLE} >
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
