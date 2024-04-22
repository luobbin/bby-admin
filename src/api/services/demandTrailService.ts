import apiClient from '../apiClient';
import { useMutation } from '@tanstack/react-query';

import { PageRes } from '#/entity';
import { App } from 'antd';
import { useCallback } from 'react';
// eslint-disable-next-line import/extensions
import { Result } from '#/api.ts';
import { Member } from '@/api/services/memberService';
import { Company } from '@/api/services/companyService';
import { Demand } from '@/api/services/demandService';

export interface SearchReq {
  pageIndex: number;
  pageSize: number;
  name: string;
  idOrder: string;
  userId: number;
  companyId: number;
  demandId: number;
}

export interface DemandTrail {
  id: string;
  demandId: number;
  userId: number;
  companyId: number;
}


export interface PageList extends DemandTrail {
  tDemand?: Demand;
  tCompany?: Company;
  tUser: Member;
  createdAt: string;
}

export type ItemReq = DemandTrail;

export type NewItem = Omit<ItemReq, 'id'>;

export enum BaseApi {
  Uri = '/v1/l-demand-trail',
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
