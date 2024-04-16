import apiClient from '@/api/apiClient';
import { useCallback } from 'react';
import { App } from 'antd';
import { useMutation } from '@tanstack/react-query';


import { UserCaptcha, UserInfo, UserToken } from '#/entity';
import { Result } from '#/api';

export interface LoginReq {
  username: string;
  password: string;
  code: string;
  uuid: string;
  remember: boolean;
}
export interface PwdSetReq {
  newPassword: string;
  oldPassword: string;
}
export interface SignUpReq extends LoginReq {
  email: string;
}
export type LoginRes = UserToken;

export type UserInfoRes = UserInfo;

export type CaptchaRes = UserCaptcha;

export enum UserApi {
  Captcha = '/v1/captcha',
  Login = '/v1/login',
  GetInfo = '/v1/info',
  PwdSet = '/v1/admin/pwd/set',
  // 以下是未用到的，以后再改
  SignUp = '/auth/signup',
  Logout = '/auth/logout',
  Refresh = '/auth/refresh',
  User = '/user',
}

const captcha = () => apiClient.get<CaptchaRes>({ url: UserApi.Captcha });
const login = (data: LoginReq) => apiClient.post<LoginRes>({ url: UserApi.Login, data });
const userInfo = () => apiClient.get<UserInfoRes>({ url: UserApi.GetInfo });
const pwdSet = (data: PwdSetReq) => apiClient.put<Result>({ url: UserApi.PwdSet, data });
// 以下是未用到的，以后再改
const register = (data: SignUpReq) => apiClient.post<LoginRes>({ url: UserApi.SignUp, data });
const logout = () => apiClient.get({ url: UserApi.Logout });
const findById = (id: string) => apiClient.get<UserInfo[]>({ url: `${UserApi.User}/${id}` });

export const usePwdSet = () => {
  const { message } = App.useApp();
  const mutation = useMutation(pwdSet);
  // eslint-disable-next-line consistent-return
  return useCallback(async (param: PwdSetReq) => {
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
  captcha,
  userInfo,
  login,
  usePwdSet,
  signup: register,
  findById,
  logout,
};
