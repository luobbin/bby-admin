import apiClient from '../apiClient';
import { useMutation } from '@tanstack/react-query';

import { Industry, PageRes, Scene } from "#/entity";
import { App } from 'antd';
import { useCallback } from 'react';
// eslint-disable-next-line import/extensions
import { Result } from '#/api.ts';
import { Company } from '@/api/services/companyService';

export interface SearchReq {
  pageIndex: number;
  pageSize: number;
  regionId: number;
  name: string;
  idOrder: string;
  ifShow: 0 | 1 | 2;
}

export interface Solution {
  id: string;
  name: string;
  companyId: number;
  indexImg: string;
  info: string;
  demoPcLink: string;
  demoMobLink: string;
  demoAccountSet: string;
  demoCount: number;
  contactCount: number;
  content: string;
  advantage: string;
  functionSet: string;
  ifHot: 0 | 1;
  sort: number;
  ifShow: 0 | 1 | 2;
}

export interface SolutionReq extends Solution {
  sceneIds: Number[];
  industryIds: Number[];
}

export interface PageList extends SolutionReq {
  tIndustry: Industry[];
  tScene: Scene[];
  tCompany?: Company;
  createdAt: string;
  updatedAt: string;
}

export type ItemReq = SolutionReq;

export type NewItem = Omit<ItemReq, 'id'>;

export enum BaseApi {
  Uri = '/v1/t-solution',
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

export default {
  itemList,
  itemAdd,
  itemUpdate,
  usePage,
  useAdd,
  useUpdate,
};