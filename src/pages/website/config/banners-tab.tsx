import { App, Button, Col, Row, Switch, Space, Card } from 'antd';
import { useState } from 'react';

import { Upload } from "@/components/upload";
export default function BannersTab() {
  const { notification } = App.useApp();
  const [thumbnail, setThumbnail] = useState<boolean>(false);

  const onChange = (checked: boolean) => {
    setThumbnail(checked);
  };
  const ThumbnailSwitch = <Switch size="small" checked={thumbnail} onChange={onChange} />;
  const UploadFileTab = (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <Card title="多图上传"
            className="w-full"
            extra={ThumbnailSwitch}>
        <Upload thumbnail={thumbnail} name="multi" />
      </Card>
    </Space>
  );
  const handleClick = () => {
    notification.success({
      message: 'Update success!',
      duration: 3,
    });
  };
  return (
    <Card className="!h-auto flex-col">
      <Row gutter={[16, 16]}>

          {UploadFileTab}
          <Col></Col>
        <div className="flex w-full justify-end">
          <Button type="primary" onClick={handleClick}>
            保存
          </Button>
        </div>
      </Row>
    </Card>
  );
}
