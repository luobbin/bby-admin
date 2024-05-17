import { Upload, message, Button } from 'antd';
import { UploadChangeParam, UploadFile, UploadProps, RcFile } from 'antd/es/upload';
import { UploadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';

import { StyledUpload } from "./styles";
import { beforeBizFileUpload, getBase64 } from "./utils";
import { ImgItemRes, useUploadFile } from '@/api/services/uploadImgService';

// @ts-ignore
interface Props extends UploadProps {
  defaultList: object[];
  onChange: (fileList: object[]) => void // 通过参数传给父组件的值
}
export function UploadBizFile({ defaultList = [], ...other }: Props) {
  // console.log("获取到默认列表：",defaultList);
  const [loading, setLoading] = useState(false);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [bizFileList, setBizFileList] = useState<any[]>(defaultList);
  // 重新加载显示数据
  useEffect(() => {
    if (defaultList.length > 0){
      setBizFileList(defaultList);
    }
  }, [defaultList]);

  const beforeUpload = (file: RcFile) => {
    const ifUpload = beforeBizFileUpload(file);
    getBase64(file, (base64Str) => {
      setFileBase64(base64Str);
    })
    return ifUpload;
  }
  
  const uploadBizFile = useUploadFile();
  const handleChangeBiz: UploadProps['onChange'] = async (info: UploadChangeParam<UploadFile>) => {
    // console.log("开始上传了",info.file.status);
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }

    if (['done','error'].includes(info.file.status!)) {
      // @ts-ignore
      const resFile: ImgItemRes = await uploadBizFile(fileBase64);
      if (resFile && Reflect.has(resFile,'full_path')){
        // console.log('呼气info',info);
        let newFileList = [...info.fileList];
        // 1. Limit the number of uploaded files
        // Only to show two recent uploaded files, and old ones will be replaced by the new
        newFileList = newFileList.slice(-2);

        // 2. Read from response and show file link
        newFileList = newFileList.map((file) => {
          if (file.uid === info.file.uid) {
            file.url = resFile.full_path;
            file.error = null;
            file.status = 'done';
          }
          return file;
        });
        console.log('newFileList',newFileList);
        info.fileList = newFileList;
        other.onChange(info.fileList);
      }else {
        message.error('文件上传失败，请重新上传!');
      }
    }
    setLoading(false);
  };

  const renderContent = (
    <Button icon={<UploadOutlined />} loading={loading}>点击上传</Button>
  );

  // @ts-ignore
  return (
    <StyledUpload>
        <Upload
          {...other}
          beforeUpload = {beforeUpload}
          onChange = {handleChangeBiz}
          defaultFileList = {bizFileList}
      >
        {renderContent}
      </Upload>
    </StyledUpload>
  );
}
