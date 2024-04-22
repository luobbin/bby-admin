import { Button, Card, Popconfirm, Form, Row, Input, Col, Select, Space } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';

import { IconButton, Iconify } from '@/components/icon';
import ProTag from '@/theme/antd/components/tag';

import { PageList, SearchReq, ItemReq, usePage } from '@/api/services/solutionService';

import { PageRes } from '#/entity';
import { IfHotStatus, IfShowStatus } from '#/enum';
import { useNavigate } from 'react-router-dom';

type SearchFormFieldType = keyof SearchReq;
const PAGE_TITLE = '商机 列表';
const IFSHOW_TAG: Array<string> = ['待定', '显示', '禁用',];
const DEFAULE_PAGE : { pageIndex: number; pageSize: number } = { pageIndex:1, pageSize:10, };

export default function SolutionPage() {
  const [searchForm] = Form.useForm();
  //设置表格的列
  const columns: ColumnsType<PageList> = [
    {
      title: "名称",
      dataIndex: "name",
      width: 300
    },
    {
      title: "公司",
      dataIndex: "tCompany",
      width: 300,
      render: (_, record) => (
        <div>{record.name}</div>
      ),
    },
    {
      title: "状态",
      dataIndex: "ifShow",
      align: "center",
      width: 120,
      render: (ifShow) => (
        <ProTag color={ifShow === IfShowStatus.ENABLE ? "success" : "error"}>{IFSHOW_TAG[ifShow]}</ProTag>
      )
    },
    {
      title: "热门",
      dataIndex: "ifHot",
      align: "center",
      width: 120,
      render: (ifHot) => (
        <ProTag color={ifHot === IfHotStatus.是 ? "success" : "error"}>{IfHotStatus[ifHot]}</ProTag>
      )
    },
    { title: "创建时间", dataIndex: "createdAt", align: "center", width: 300 },
    { title: "更新时间", dataIndex: "updatedAt", align: "center", width: 300 },
    {
      title: "操作",
      key: "operation",
      align: "center",
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
      )
    }
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
  const navigate = useNavigate();
  const onCreate = () => {
    navigate('/facilitator/solutionEdit', { state: { title: '创建', params: '' } });
  };
  const onEdit = (formValue: ItemReq) => {
    navigate('/facilitator/solutionEdit', { state: { title: '更新', params: formValue } });
  };

  const getPage = usePage();
  useEffect(() => {
    const handlePage = async () => {
      setLoading(true);
      try {
        searchForm.setFieldsValue(DEFAULE_PAGE);
        await getPage(searchForm.getFieldsValue()).then((res) => {
          // @ts-ignore
          const pageRes : PageRes = res;
          console.log('初始化转换', pageRes.list);
          if (pageRes && Reflect.has(pageRes, "list")) {
            // @ts-ignore
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
      console.log("异步到数据", res);
      // @ts-ignore
      const pageRes : PageRes = res;
      if (pageRes && Reflect.has(pageRes, "list")) {
        // @ts-ignore
        setData(pageRes.list);
        setPagePer({
          pagination: {
            current: pageRes.pageIndex,
            pageSize: pageRes.pageSize, // 每页显示N条数据
            total: pageRes.count, // 总数据量
          },
        });
        console.log("获取到数据2", data);
      }
    } finally {
      setLoading(false);
    }
  };
  // 切换分页
  const onChangePage = async (paging:any, filters:any, sort:any) => {
    setLoading(true);
    try {
      searchForm.setFieldValue('pageIndex', paging.current);
      searchForm.setFieldValue('pageSize', paging.pageSize);
      console.log('分页请求参数', searchForm.getFieldsValue(), filters,sort);
      const res = await getPage(searchForm.getFieldsValue());
      console.log('分页到数据', res);
      // @ts-ignore
      const pageRes : PageRes = res;
      if (pageRes && Reflect.has(pageRes, "list")) {
        // @ts-ignore
        setData(pageRes.list);
        setPagePer({
          pagination: {
            current: pageRes.pageIndex,
            pageSize: pageRes.pageSize, // 每页显示N条数据
            total: pageRes.count, // 总数据量
          },
        });
        console.log("获取到数据3", data);
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
            <Col span={24} lg={6}>
              <Form.Item<SearchFormFieldType> label="热门" name="ifHot" className="!mb-0">
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
