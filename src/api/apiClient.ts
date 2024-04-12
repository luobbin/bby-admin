import { message as Message } from 'antd';
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { isEmpty } from 'ramda';

import { t } from '@/locales/i18n';
import { getItem } from '@/utils/storage';

import { Result } from '#/api';
import { UserToken } from '#/entity';
import { ResultEnum, StorageEnum } from '#/enum';

// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API as string,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
});

// 请求拦截
axiosInstance.interceptors.request.use(
  (config) => {
    // 在请求被发送之前做些什么
    const userToken = getItem<UserToken>(StorageEnum.Token) || {};
    console.log('获取到的token：', userToken);
    config.headers.Authorization = `Bearer ${userToken.accessToken}`;
    return config;
  },
  (error) => {
    // 请求错误时做些什么
    return Promise.reject(error);
  },
);

// 响应拦截
axiosInstance.interceptors.response.use(
  (res: AxiosResponse<Result>) => {
    if (!res.data) throw new Error(t('sys.api.apiRequestFailed'));
    const { code, data, msg } = res.data;
    // 业务请求成功
    const hasSuccess = res.data && Reflect.has(res.data, 'code') && code === ResultEnum.SUCCESS;
    if (hasSuccess) {
      return data;
    }

    // 业务请求错误
    throw new Error(msg || t('sys.api.apiRequestFailed'));
  },
  (error: AxiosError<Result>) => {
    const { response, message } = error || {};
    let errMsg = '';
    try {
      errMsg = response?.data?.msg || message;
    } catch (error) {
      throw new Error(error as unknown as string);
    }
    // 对响应错误做点什么
    if (isEmpty(errMsg)) {
      // checkStatus
      // errMsg = checkStatus(response.data.status);
      errMsg = t('sys.api.errorMessage');
    }
    Message.error(errMsg);
    return Promise.reject(error);
  },
);

class APIClient {
  get<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'GET' });
  }

  post<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'POST' });
  }

  put<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'PUT' });
  }

  delete<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'DELETE' });
  }

  postString<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.requestString({ ...config, method: 'POST' });
  }

  putString<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.requestString({ ...config, method: 'PUT' });
  }

  deleteString<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.requestString({ ...config, method: 'DELETE' });
  }

  request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      axiosInstance
        .request<any, AxiosResponse<Result>>(config)
        .then((res: AxiosResponse<Result>) => {
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error | AxiosError) => {
          reject(e);
        });
    });
  }

  requestString<T = any>(config: AxiosRequestConfig): Promise<T> {
    config.params = JSON.stringify(config.params);
    const newConfig = {
      url: config.url,
      method: config.method,
      data: config.params,
      headers: {
        'content-type': 'application/json',
      },
    };
    console.log('传值为：', newConfig);
    return new Promise((resolve, reject) => {
      // @ts-ignore
      axiosInstance
        .request<any, AxiosResponse<Result>>(newConfig)
        .then((res: AxiosResponse<Result>) => {
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error | AxiosError) => {
          reject(e);
        });
    });
  }
}
export default new APIClient();
