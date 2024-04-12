import apiClient from '@/api/apiClient';

import { UserCaptcha, UserInfo, UserToken } from '#/entity';

export interface LoginReq {
  username: string;
  password: string;
  code: string;
  uuid: string;
  remember: boolean;
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
  // 以下是未用到的，以后再改
  SignUp = '/auth/signup',
  Logout = '/auth/logout',
  Refresh = '/auth/refresh',
  User = '/user',
}

const captcha = () => apiClient.get<CaptchaRes>({ url: UserApi.Captcha });
const login = (data: LoginReq) => apiClient.post<LoginRes>({ url: UserApi.Login, data });
const userInfo = () => apiClient.get<UserInfoRes>({ url: UserApi.GetInfo });
// 以下是未用到的，以后再改
const register = (data: SignUpReq) => apiClient.post<LoginRes>({ url: UserApi.SignUp, data });
const logout = () => apiClient.get({ url: UserApi.Logout });
const findById = (id: string) => apiClient.get<UserInfo[]>({ url: `${UserApi.User}/${id}` });

export default {
  captcha,
  userInfo,
  login,
  signup: register,
  findById,
  logout,
};
