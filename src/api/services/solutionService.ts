import apiClient from "../apiClient";
import { useMutation } from "@tanstack/react-query";

import { Industry, PageRes, Scene } from "#/entity";
import { App } from "antd";
import { useCallback } from "react";
import { Result } from "#/api.ts";
import { Company } from "@/api/services/companyService";

export interface SearchReq {
  pageIndex: number;
  pageSize: number;
  regionId?: number;
  name?: string;
  idOrder?: string;
  ifShow?: 0 | 1 | 2;
}

export interface Solution {
  id: number;
  name: string;
  companyId: number;
  indexImg: string;
  info: string;
  demoPcLink: string;
  demoMobLink: string;
  demoAccountSet: string;
  demoCount: number;
  contactCount: number;
  viewCount: number;
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

export interface PageItem extends SolutionReq {
  tIndustry: Industry[];
  tScene: Scene[];
  tCompany?: Company;
  createdAt: string;
  updatedAt: string;
}

export interface ItemReq {
  id: number;
  ifHot: number;
  sort: number;
  demoCount: number;
  viewCount: number;
  contactCount: number;
  ifShow: 0 | 1 | 2;
}

export type NewItem = Omit<SolutionReq, 'id'>;

export enum BaseApi {
  Uri = '/v1/t-solution',
}

const itemList = (params: SearchReq) =>
  apiClient.get<{ data: PageRes }>({ url: BaseApi.Uri, params });
const itemAdd = (params: NewItem) => apiClient.postString<Result>({ url: BaseApi.Uri, params });
const itemUpdate = (params: SolutionReq) =>
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
  return useCallback(async (param: SolutionReq) => {
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
  return useCallback(async (param: SolutionReq) => {
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
