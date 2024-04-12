import { BasicStatus, IfShowStatus, PermissionType } from './enum';

export interface UserCaptcha {
  id?: string;
  img?: string;
}

export interface UserToken {
  accessToken?: string;
  refreshToken?: string;
}

export interface UserInfo {
  id: string;
  userName: string;
  name: string;
  introduction: string;
  deptId?: string;
  avatar?: string;
  roles?: Role;
  buttons?: string[];
  status?: BasicStatus;
  permissions?: Permission[];
}

export interface Organization {
  id: string;
  name: string;
  status: 'enable' | 'disable';
  desc?: string;
  order?: number;
  children?: Organization[];
}

export interface Permission {
  id: string;
  parentId: string;
  name: string;
  label: string;
  type: PermissionType;
  route: string;
  status?: BasicStatus;
  order?: number;
  icon?: string;
  component?: string;
  hide?: boolean;
  hideTab?: boolean;
  frameSrc?: string;
  newFeature?: boolean;
  children?: Permission[];
}

export interface Role {
  id: string;
  name: string;
  label: string;
  status: BasicStatus;
  order?: number;
  desc?: string;
  permission?: Permission[];
}

export interface Support {
  id: string;
  name: string;
  ifShow: IfShowStatus;
  createdAt: string;
}
export interface Region {
  id: string;
  pid: number;
  name: string;
  ifShow: IfShowStatus;
  createdAt: string;
}
export interface Industry {
  id: string;
  pid: number;
  name: string;
  ifShow: IfShowStatus;
  createdAt: string;
}
export interface Scene {
  id: string;
  pid: number;
  name: string;
  ifShow: IfShowStatus;
  createdAt: string;
}
export interface PageRes<T = any> {
  pageSize: number;
  pageIndex: number;
  count: number;
  list?: T[];
}
