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
  SignIn = '/auth/signin',
  SignUp = '/auth/signup',
  Logout = '/auth/logout',
  Refresh = '/auth/refresh',
  User = '/user',
}

const captcha = () => apiClient.get<CaptchaRes>({ url: 'http://localhost:8090/api/v1/captcha' });
// eslint-disable-next-line prettier/prettier
const login = (data: LoginReq) => apiClient.post<LoginRes>({ url: 'http://localhost:8090/api/v1/login', data });
const userInfo = () => apiClient.get<UserInfoRes>({ url: 'http://localhost:8090/api/v1/info' });
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
