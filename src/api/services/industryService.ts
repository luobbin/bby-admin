import apiClient from '../apiClient';
import { useMutation } from '@tanstack/react-query';

import { Industry, PageRes } from "#/entity";
import { App } from 'antd';
import { useCallback } from 'react';
// eslint-disable-next-line import/extensions
import { Result } from '#/api.ts';

export interface SearchReq {
  pageIndex: number;
  pageSize: number;
  pid: number;
  name: string;
  ifShow: 0 | 1 | 2;
}

export interface PageList extends Industry{
  children: PageList[];
  createdAt: string;
  updatedAt: string;
}

export type ItemReq = Industry;

export type NewItem = Omit<ItemReq, 'id'>;

export enum BaseApi {
  Uri = '/v1/t-industry',
}

const itemList = (params: SearchReq) =>
  apiClient.get<{ data: PageRes }>({ url: BaseApi.Uri, params });
const itemAdd = (params: NewItem) => apiClient.postString<Result>({ url: BaseApi.Uri, params });
const itemUpdate = (params: ItemReq) =>
  apiClient.putString<Result>({ url: `${BaseApi.Uri}/${params.id}`, params });

export const useList = () => {
  const { message } = App.useApp();
  const mutation = useMutation(itemList);
  // eslint-disable-next-line consistent-return
  return useCallback(async (pageReq: SearchReq) => {
    console.log('搜索到请求参数', pageReq);
    try {
      const res = await mutation.mutateAsync(pageReq);
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

export const useAdd = () => {
  const { message } = App.useApp();
  const mutation = useMutation(itemAdd);
  // eslint-disable-next-line consistent-return
  return useCallback(async (param: ItemReq) => {
    // @ts-ignore
    param.id = null;
    try {
      const addItem: NewItem = param;
      const res = await mutation.mutateAsync(addItem);
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

export const useUpdate = () => {
  const { message } = App.useApp();
  const mutation = useMutation(itemUpdate);
  // eslint-disable-next-line consistent-return
  return useCallback(async (param: ItemReq) => {
    try {
      const res = await mutation.mutateAsync(param);
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
  itemList,
  itemAdd,
  itemUpdate,
  useList,
  useAdd,
  useUpdate,
};
