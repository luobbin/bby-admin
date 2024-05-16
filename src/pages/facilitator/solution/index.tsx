import { Button, Card, Form, Row, Input, Col, Select, Space } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

import { IconButton, Iconify } from '@/components/icon';
import ProTag from '@/theme/antd/components/tag';

import { PageItem, SearchReq, ItemReq, usePage } from '@/api/services/solutionService';

import { PageRes } from '#/entity';
import { IfHotStatus, IfShowStatus } from '#/enum';
import { ItemModalProps, SolutionModal } from '@/pages/facilitator/solution/solution-modal';

type SearchFormFieldType = keyof SearchReq;
const PAGE_TITLE = '解决方案 列表';
const IFSHOW_TAG: Array<string> = ['待定', '显示', '禁用',];
const DEFAULE_PAGE : SearchReq = { pageIndex:1, pageSize:10, idOrder:'desc'};
const DEFAULT_VAL:ItemReq={id:0,ifHot:0,ifShow:0,demoCount:0,viewCount:0,contactCount:0,sort:0};
export default function SolutionPage() {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PageItem[]>([]);
  const [modalProps, setModalProps] = useState<ItemModalProps>({
    formValue: {...DEFAULT_VAL},
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
      current: DEFAULE_PAGE.pageIndex,
      pageSize: DEFAULE_PAGE.pageSize, // 每页显示N条数据
      total: 0, // 总数据量
    },
  });
  const onEdit = (record: PageItem) => {
    const formValue:ItemReq = {
      id: record.id,
      ifHot: record.ifHot,
      sort: record.sort,
      viewCount: record.viewCount,
      contactCount: record.contactCount,
      demoCount: record.demoCount,
      ifShow: record.ifShow
    };
    setModalProps((prev) => ({
      ...prev,
      show: true,
      title: `更新${record.name}`,
      formValue,
    }));
  }

  const getPage = usePage();
  useEffect(() => {
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
      title: "操作",
      key: "operation",
      align: "center",
      width: 100,
      render: (_, record) => (
        <div className="flex w-full justify-center text-gray">
          <IconButton onClick={() => onEdit(record)}>
            <Iconify icon="solar:pen-bold-duotone" size={18} />
          </IconButton>
        </div>
      )
    }
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
        <SolutionModal {...modalProps}/>
      </Card>
    </Space>
  );
}
