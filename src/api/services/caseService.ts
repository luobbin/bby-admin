import apiClient from '../apiClient';
import { useMutation } from '@tanstack/react-query';

import { PageRes, Region, Scene } from "#/entity";
import { App } from 'antd';
import { useCallback } from 'react';
import { Result } from '#/api.ts';
import { Company } from '@/api/services/companyService';

export interface SearchReq {
  pageIndex: number;
  pageSize: number;
  regionId?: number;
  name?: string;
  idOrder?: string;
  ifShow?: 0 | 1 | 2;
}

export interface Case {
  id: number;
  name: string;
  customerName: string;
  customerLogo: string;
  customerAddress: string;
  customerLeader: string;
  customerThank: string;
  info: string;
  companyId: number;
  regionId: number;
  dealAmount: number;
  beginTime: string;
  endTime: string;
  solutionSet: string;
  functionSet: string
  content: string;
  qualification: string;
  sort: number;
}

export interface CaseReq extends Case{
  sceneIds: number[];
}

export interface PageItem extends CaseReq {
  tCompany: Company;
  tScene?: Scene[];
  tRegion?: Region;
  createdAt: string;
  updatedAt: string;
  customerAddressInfo: string;
}

export type ItemReq = CaseReq;

export type NewItem = Omit<ItemReq, 'id'>;

export interface ItemDelReq{
  ids: number[];
}

export enum BaseApi {
  Uri = '/v1/t-case',
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
  itemList,
  itemAdd,
  itemUpdate,
  usePage,
  useAdd,
  useUpdate,
  useDel,
};
