import apiClient from '../apiClient';
import { useMutation } from '@tanstack/react-query';

import { Industry, PageRes, Region } from '#/entity';
import { App } from 'antd';
import { useCallback } from 'react';
// eslint-disable-next-line import/extensions
import { Result } from '#/api.ts';
import { Company } from '@/api/services/companyService';
import { Solution } from "@/api/services/solutionService.ts";

export interface SearchReq {
  pageIndex: number;
  pageSize: number;
  regionId: number;
  name: string;
  idOrder: string;
  ifShow: 0 | 1 | 2;
}

export interface Case {
  id: string;
  name: string;
  customerName: string;
  info: string;
  companyId: number;
  regionId: number;
  industryId: number;
  solutionId: number;
  dealAmount: number;
  beginTime: string;
  endTime: string;
  content: string;
  qualification: string;
  others: string;
  ifDel: 0 | 1;
  sort: number;
}

export interface PageList extends Case {
  tRegion: Region;
  tIndustry: Industry;
  tCompany: Company;
  tSolution?: Solution;
  createdAt: string;
  updatedAt: string;
}

export type ItemReq = Case;

export type NewItem = Omit<ItemReq, 'id'>;

export enum BaseApi {
  Uri = '/v1/t-case',
}

const itemList = (params: SearchReq) =>
  apiClient.get<{ data: PageRes }>({ url: BaseApi.Uri, params });
const itemAdd = (params: NewItem) => apiClient.postString<Result>({ url: BaseApi.Uri, params });
const itemUpdate = (params: ItemReq) =>
  apiClient.putString<Result>({ url: `${BaseApi.Uri}/${params.id}`, params });

export const usePage = () => {
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
  usePage,
  useAdd,
  useUpdate,
};
