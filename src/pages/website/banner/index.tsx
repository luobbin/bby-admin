import { App, Button, Card, Popconfirm, Modal, Form, Input, Space, Image} from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

import {
  ItemReq,
  SearchReq,
  PageList,
  usePage,
  useAdd,
  useUpdate,
  useDel,
  ItemDelReq
} from "@/api/services/configService";
import { IconButton, Iconify } from '@/components/icon';
import { PageRes } from '#/entity';
import { UploadAvatar } from '@/components/upload';

const PAGE_TITLE = 'banner列表';
const DEFAULT_IMG = import.meta.env.VITE_DEFAULT_IMG as string;
const DEFAULE_VAL: ItemReq = {
  id: 0,
  configName: '',
  configKey: '',
  configValue: '',
  configUrl: '',
  isFrontend: '2',
  remark: '',
};

export default function BannerPage() {
  const { message } = App.useApp();
  const [data, setData] = useState<PageList[]>([]);
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

  const del = useDel();
  const confirmDel = async (param: ItemReq) => {
    console.log(param);
    message.success('Click on Yes');
    const params: ItemDelReq = {
      ids: [param.id]
    }
    const res = await del(params);
    if (res){
      const newData = data.filter(item => item.id !== param.id);
      // 更新数据源
      setData(newData);
      message.success("删除成功！")
    }
  }

  // 设置表格的列
  const columns: ColumnsType<PageList> = [
    {
      title: '名称',
      dataIndex: 'configName',
      width: 300,
    },
    {
      title: '图片',
      dataIndex: 'configValue',
      align: 'center',
      width: 300,
      render:(configValue) =>(
        <Image width={100}
               height={100}
               src={configValue}
               fallback={DEFAULT_IMG}
        />
      ),
    },
    {
      title: '键值',
      dataIndex: 'configKey',
      align: 'center',
      width: 120
    },
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
          <Popconfirm title="确定要删除" okText="是" cancelText="否" placement="left" onConfirm={() => confirmDel(record)}>
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
      try {
        // @ts-ignore
        const searchParam: SearchReq = {
          pageIndex: 1,
          pageSize: 100,
          isFrontend: "2",
        }
        await getPage(searchParam).then((res) => {
          // @ts-ignore
          const pageRes: PageRes = res;
          if (pageRes && Reflect.has(pageRes, 'list')) {
            // @ts-ignore
            setData(pageRes.list);
            console.log('获取到数据1', data);
          }
        });
      } finally {
        console.log('页面加载完成');
      }
    };
    handlePage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log("执行表格")
  return (
    <Space direction="vertical" size="large" className="w-full">
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
          pagination={false}
        />
        <BannerModal {...modalProps} />
      </Card>
    </Space>
  );
}

export type ItemModalProps = {
  formValue: ItemReq;
  title: string;
  show: boolean;
  onOk: VoidFunction;
  onCancel: VoidFunction;
};


export function BannerModal({ title, show, formValue, onOk, onCancel }: ItemModalProps) {
  const [form] = Form.useForm();
  const [defaultImg, setDefaultImg] = useState('');
  useEffect(() => {
    form.setFieldsValue({ ...formValue });
    setDefaultImg(form.getFieldValue('configValue'));
    console.log('更新的数据', form.getFieldValue('configValue'));
  }, [formValue, form]);

  // 处理新增|更新
  const add = useAdd();
  const update = useUpdate();
  const { notification } = App.useApp();
  const handleFinish = async () => {
    // @ts-ignore
    const item: ItemReq = form.getFieldsValue();
    console.log('获取到提交数据', item);
    try {
      let res;
      if (form.getFieldValue('id') === 0) {
        item.configKey = 'sys_app_banner_' + dayjs().millisecond();
        res = await add(item);
      } else {
        res = await update(item);
      }
      if (res) {
        form.setFieldsValue(DEFAULE_VAL);
      }
    } finally {
      notification.success({
        message: '成功',
        description: '提交成功',
        duration: 3,
      });
      // 提交到服务端
      onOk();
    }
  };

  function setBannerImg(newImg: string): void {
    formValue.configValue = newImg;
    console.log("获取到新图片：", formValue.configValue);
  }

  // @ts-ignore
  return (
    <Modal
      title={title}
      open={show}
      onOk={onOk}
      onCancel={onCancel}
      width={600}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" htmlType="submit" onClick={handleFinish}>
          提交
        </Button>,
      ]}
    >
      <Form
        initialValues={formValue}
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
      >
        <Form.Item<ItemReq> label="ID" name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="Key" name="configKey" hidden>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="链接" name="configUrl" hidden>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq> label="分组" name="isFrontend" hidden>
          <Input />
        </Form.Item>
        <Form.Item<ItemReq>
          label="名称"
          name="configName"
          rules={[{ required: true, message: '请输入Banner名称' }]}
        >
          <Input placeholder="Banner名称" />
        </Form.Item>
        <Form.Item<ItemReq> label="图片" name="configValue">
          <UploadAvatar defaultAvatar={defaultImg} onChange={setBannerImg} />
        </Form.Item>
        <Form.Item<ItemReq> label="备注" name="remark">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
}
