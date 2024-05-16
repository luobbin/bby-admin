import apiClient from '../apiClient';
import { useMutation } from '@tanstack/react-query';

import { PageRes } from '#/entity';
import { App } from 'antd';
import { useCallback } from 'react';
import { Result } from '#/api.ts';

export interface SearchReq {
  pageIndex: number;
  pageSize: number;
  name: string;
  idOrder: string;
  ifService: 0 | 1;
}

export interface Article {
  id: number;
  title: string;
  info: string;
  content: string;
}

export interface PageItem extends Article {
  updateBy: number;
  createBy: number;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type ItemReq = Article;

export type NewItem = Omit<ItemReq, 'id'>;

export interface ItemDelReq{
  ids: number[];
}

export enum BaseApi {
  Uri = '/v1/t-article',
}

const itemList = (params: SearchReq) =>
  apiClient.get<{ data: PageRes }>({ url: BaseApi.Uri, params });
const itemAdd = (params: NewItem) => apiClient.postString<Result>({ url: BaseApi.Uri, params });
const itemUpdate = (params: ItemReq) =>
  apiClient.putString<Result>({ url: `${BaseApi.Uri}/${params.id}`, params });

const itemdel = (params: ItemDelReq) => apiClient.deleteString<Result>({ url: BaseApi.Uri, params });

export const usePage = () => {
  const { message } = App.useApp();
  const mutation = useMutation(itemList);
  // eslint-disable-next-line consistent-return
  return useCallback(async (pageReq: SearchReq) => {
    if (!pageReq.idOrder){
      pageReq.idOrder = "desc";
    }
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

export const useDel = () => {
  const { message } = App.useApp();
  const mutation = useMutation(itemdel);
  // eslint-disable-next-line consistent-return
  return useCallback(async (param: ItemDelReq) => {
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
  usePage,
  useAdd,
  useUpdate,
  useDel,
};
