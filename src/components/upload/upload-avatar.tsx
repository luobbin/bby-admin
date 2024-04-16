import { Typography, Upload, message } from 'antd';
import { UploadChangeParam, UploadFile, UploadProps, RcFile } from 'antd/es/upload';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';

import { fBytes } from '@/utils/format-number';

import { Iconify } from '../icon';

import { StyledUploadAvatar } from './styles';
import { beforeAvatarUpload, getBase64 } from "./utils";
import { ImgItemRes, ItemReq, useUploadImg } from '@/api/services/uploadImgService';

// @ts-ignore
interface Props extends UploadProps {
  defaultAvatar?: string;
  helperText?: React.ReactElement | string;
  onChange: (newImg: string) => void // 通过参数传给父组件的值
}
// const DEFAULT_IMG = import.meta.env.VITE_DEFAULT_IMG as string;
export function UploadAvatar({ helperText, defaultAvatar = '', ...other }: Props) {
  // defaultAvatar = defaultAvatar==''?DEFAULT_IMG:defaultAvatar
  // console.log("获取到图片：",defaultAvatar);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(defaultAvatar);
  const [imageBase64, setImageBase64] = useState<string>('');
  const [isHover, setIsHover] = useState(false);
  const handelHover = (hover: boolean) => {
    setIsHover(hover);
  };

  //重新加载显示图
  useEffect(() => {
    setImageUrl(defaultAvatar);
    console.log('默认加载的图片', imageUrl);
  }, [defaultAvatar]);

  const beforeUpload = (file: RcFile) => {
    const ifUpload = beforeAvatarUpload(file);
    getBase64(file, (base64Img) => {
      //console.log("转换的base64", base64Img);
      setImageBase64(base64Img);
    });
    return ifUpload;
  }
  
  const add = useUploadImg();
  const handleChange: UploadProps['onChange'] = async (info: UploadChangeParam<UploadFile>) => {
    console.log("开始上传了",info.file.status)
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }

    if (['done','error'].includes(info.file.status!)) {
      const imgReq: ItemReq = {
        'source': "3",
        'type': "3",
        'file': imageBase64,
      }
      // @ts-ignore
      const resImg: ImgItemRes = await add(imgReq);
      if (resImg && Reflect.has(resImg,'full_path')){
        setImageUrl(resImg.full_path);
        other.onChange(resImg.full_path);
      }else {
        message.error('图片上传失败，请重新上传!');
      }
    }
    setLoading(false);
  };

  const renderPreview = <img src={imageUrl} alt="" className="absolute rounded-full" />;

  const renderPlaceholder = (
    <div
      style={{
        backgroundColor: !imageUrl || isHover ? 'rgba(22, 28, 36, 0.64)' : 'transparent',
        color: '#fff',
      }}
      className="absolute z-10 flex h-full w-full flex-col items-center justify-center"
    >
      <Iconify icon="solar:camera-add-bold" size={32} />
      <div className="mt-1 text-xs">Upload Photo</div>
    </div>
  );

  const renderContent = (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full"
      onMouseEnter={() => handelHover(true)}
      onMouseLeave={() => handelHover(false)}
    >
      {imageUrl ? renderPreview : null}
      {!imageUrl || isHover ? renderPlaceholder : null}
    </div>
  );

  const defaultHelperText = (
    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
      允许 *.jpeg, *.jpg, *.png, *.gif
      <br /> max size of {fBytes(3145728)}
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
    </Typography.Text>
  );
  const renderHelpText = <div className="text-center">{helperText || defaultHelperText}</div>;

  return (
    <StyledUploadAvatar>
      <Upload
        name="avatar"
        showUploadList={false}
        listType="picture-circle"
        className="avatar-uploader !flex items-center justify-center"
        {...other}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {renderContent}
      </Upload>
      {renderHelpText}
    </StyledUploadAvatar>
  );
}
