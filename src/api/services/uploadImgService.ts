import apiClient from '../apiClient';
import { useMutation } from '@tanstack/react-query';

import { App } from 'antd';
import { useCallback } from 'react';


export interface ImgItem {
  source: string; //(1：单图，2：多图, 3：base64图片_默认) 必传
  type: string; // 2：阿里oss方式上传 3：七牛云上传_默认 1：华为云上传 必传
  file: string; //base64图片数据（带头标识，如：data:image/png;base64,） 必传
}

export interface ImgItemRes {
  size: number; //大小
  path: string; // 相对路径
  full_path: string; //全路径
  name: string; //文件名
  type: string; //文件类型
}

export type ItemReq = ImgItem;

export enum BaseApi {
  Uri = '/v1/public/uploadFile',
}


// const itemAdd = (params: ItemReq) => apiClient.post<ImgItemRes>({ url: BaseApi.Uri, params });
const uploadImg = (data: ItemReq) => apiClient.post<ImgItemRes>({ url: BaseApi.Uri, data });
export const useAdd = () => {
  const { message } = App.useApp();
  const mutation = useMutation(uploadImg);
  // eslint-disable-next-line consistent-return
  return useCallback(async (param: ItemReq) => {
    try {
      const res = await mutation.mutateAsync(param);
      console.log("上传成功，获取到的文件数据：", res)
      return res;
    } catch (err) {
      message.warning({
        content: err.message,
        duration: 3,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default {
  useAdd,
};
