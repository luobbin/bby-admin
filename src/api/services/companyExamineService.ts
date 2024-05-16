import apiClient from '../apiClient';
import { useMutation } from '@tanstack/react-query';

import { PageRes } from '#/entity';
import { App } from 'antd';
import { useCallback } from 'react';
import { Result } from '#/api.ts';
import { Member } from '@/api/services/memberService';

export interface SearchReq {
  pageIndex: number;
  pageSize: number;
  name?: string;
  idOrder?: string;
  ifCheck?: 0 | 1;
  userId?: number;
}

export interface CompanyExamine {
  id: number;
  userId: number;
  name: string;
  logo: string;
  indexImg: string;
  info: string;
  qualificationSet: string;
  abilitySet: string;
  mobile: string;
  address: string;
  addressInfo: string;
  contactName: string;
  contactMobile: string;
  ifCheck: 0|1|2;
  reason: string;
}

export type CompanyExamineReq = CompanyExamine;

export interface PageItem extends CompanyExamine {
  tUser: Member;
  createdAt: string;
  updatedAt: string;
}

export interface ItemReq {
  id: number;
  ifCheck: 0|1|2;
  reason: string;
}

export type NewItem = Omit<CompanyExamineReq, 'id'>;

export enum BaseApi {
  Uri = '/v1/t-company-examine',
}

const itemList = (params: SearchReq) =>
  apiClient.get<{ data: PageRes }>({ url: BaseApi.Uri, params });
const itemAdd = (params: NewItem) => apiClient.postString<Result>({ url: BaseApi.Uri, params });
const itemUpdate = (params: CompanyExamineReq) =>
  apiClient.putString<Result>({ url: `${BaseApi.Uri}/${params.id}`, params });
const itemIfShow = (params: ItemReq) =>
  apiClient.putString<number>({ url: `${BaseApi.Uri}/ifShow`, params });
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
  return useCallback(async (param: CompanyExamineReq) => {
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
  return useCallback(async (param: CompanyExamineReq) => {
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
export const useIfShow = () => {
  const { message } = App.useApp();
  const mutation = useMutation(itemIfShow);
  return useCallback(async (param: ItemReq) => {
    try {
      return await mutation.mutateAsync(param);
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
  useIfShow,
};
