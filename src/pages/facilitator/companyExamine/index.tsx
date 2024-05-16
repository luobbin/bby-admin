import { Button, Card, Form, Row, Input, Col, Select, Space } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { IconButton, Iconify } from '@/components/icon';
import ProTag from '@/theme/antd/components/tag';

import { ItemReq, PageItem, SearchReq, usePage } from '@/api/services/companyExamineService';
import { CompanyExamineModal, ItemModalProps } from './companyExamine-modal';

import { PageRes } from '#/entity';
import { IfCheckStatus } from "#/enum";

type SearchFormFieldType = keyof SearchReq;
const PAGE_TITLE = '服务商加盟 列表';
const DEFAULE_PAGE : SearchReq = { pageIndex:1, pageSize:10};
const DEFAULE_VAL: ItemReq = {
  id: 0,
  ifCheck: IfCheckStatus.待定,
  reason: '',
};

export default function CompanyExaminePage() {
  const [searchForm] = Form.useForm();
  const getPage = usePage();
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
    }
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
      ifCheck: record.ifCheck,
      reason: record.reason
    }
    setModalProps((prev) => ({
      ...prev,
      show: true,
      title: '更新',
      formValue
    }));
  };

  useEffect(() => {
    handlePage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onSearchReset = () => {
    searchForm.resetFields();
    searchForm.setFieldsValue({...DEFAULE_PAGE});
  };

  const onSearchPage = () => {
    handlePage()
  };
  // 切换分页
  const onChangePage = async (paging:any, _filters:any, _sort:any) => {
    searchForm.setFieldValue('pageIndex', paging.current);
    searchForm.setFieldValue('pageSize', paging.pageSize);
    handlePage()
  };
  const handlePage = async () => {
    setLoading(true)
    try {
      console.log('searchForm',searchForm.getFieldsValue())
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
      setLoading(false)
    }
  }

  //设置表格的列
  const columns: ColumnsType<PageItem> = [
    {
      title: "公司名",
      dataIndex: "name",
      width: 200
    },
    {
      title: "申请用户",
      dataIndex: "tUser",
      width: 120,
      render: (tUser)=><div>{tUser.account}</div>
    },
    {
      title: "审核状态",
      dataIndex: "ifCheck",
      align: "center",
      width: 100,
      render: (ifCheck) => (
        <ProTag color={ifCheck === IfCheckStatus.待定 ? "success" : "error"}>{IfCheckStatus[ifCheck]}</ProTag>
      )
    },
    { title: "企业电话", dataIndex: "mobile", align: "center", width: 100 },
    { title: "企业地址", dataIndex: "addressInfo", align: "center", width: 100 },
    { title: "联系人", dataIndex: "contactName", align: "center", width: 100 },
    { title: "联系方式", dataIndex: "contactMobile", align: "center", width: 100 },
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
          {record.ifCheck === IfCheckStatus.待定 && <IconButton onClick={() => onEdit(record)}>
            <Iconify icon="solar:pen-bold-duotone" size={18} />
          </IconButton>}
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
              <Form.Item<SearchFormFieldType> label="审核状态" name="ifCheck" className="!mb-0">
                <Select>
                  <Select.Option value="0">
                    <ProTag color="primary">待定</ProTag>
                  </Select.Option>
                  <Select.Option value="1">
                    <ProTag color="success">通过</ProTag>
                  </Select.Option>
                  <Select.Option value="2">
                    <ProTag color="error">驳回</ProTag>
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
        <CompanyExamineModal {...modalProps} />
      </Card>
    </Space>
  );
}
