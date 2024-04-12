import { Button, Card, Popconfirm } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useState, useEffect} from'react';

import { IconButton, Iconify } from '@/components/icon';
import ProTag from '@/theme/antd/components/tag.tsx';

import { IndustryModal, ItemModalProps } from './industry-modal.tsx';

import { IfShowStatus } from '#/enum';
import { ItemReq, PageList, SearchReq, useList } from '@/api/services/industryService';

const IFSHOW_TAG: Array<string> = ['待定', '显示', '禁用',];
const PAGE_TITLE = '行业 列表';
const DEFAULE_VAL: ItemReq = {
  id: '',
  pid: 0,
  name: '',
  ifShow: IfShowStatus.ENABLE,
  createdAt: '',
};
export default function IndustryPage() {
  const [modalProps, setModalProps] = useState<ItemModalProps>({
    formValue: { ...DEFAULE_VAL },
    title: 'New',
    show: false,
    onOk: () => {
      setModalProps((prev) => ({ ...prev, show: false }));
    },
    onCancel: () => {
      setModalProps((prev) => ({ ...prev, show: false }));
    },
  });
  const columns: ColumnsType<PageList> = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 300,
    },
    {
      title: '状态',
      dataIndex: 'ifShow',
      align: 'center',
      width: 120,
      render: (ifShow) => (
        <ProTag color={ifShow === IfShowStatus.ENABLE ? 'success' : 'error'}>
          {IFSHOW_TAG[ifShow]}
        </ProTag>
      ),
    },
    { title: "创建时间", dataIndex: "createdAt", align: "center", width: 300 },
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
          <Popconfirm title="抱歉，暂不支持删除" okText="Yes" cancelText="No" placement="left">
            <IconButton>
              <Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
            </IconButton>
          </Popconfirm>
        </div>
      ),
    },
  ];

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
    setModalProps((prev) => ({
      ...prev,
      show: true,
      title: "更新",
      formValue
    }));
  };

  const [data, setData] = useState([]);
  const getList = useList();
  useEffect(() => {
    const handlePage = async () => {
      try {
        // @ts-ignore
        const param:SearchReq = {
          pageIndex: 1, pageSize: 10,
        };
        await getList(param).then((res) => {
          // @ts-ignore
          const listRes : PageList[] = res;
          console.log('初始化转换', listRes);
          if (listRes) {
            // @ts-ignore
            setData(listRes);
          }
        });
      } finally {
        console.log('处理完成');
      }
    };
    handlePage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card
      title={PAGE_TITLE}
      extra={
        <Button type="primary" onClick={onCreate}>
          创建
        </Button>
      }
    >
      <Table
        rowKey="id"
        size="small"
        scroll={{ x: 'max-content' }}
        pagination={false}
        columns={columns}
        dataSource={data}
      />

      <IndustryModal {...modalProps} />
    </Card>
  );
}
