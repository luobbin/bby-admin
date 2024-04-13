export enum BasicStatus {
  DISABLE,
  ENABLE,
}

export enum IfShowStatus {
  INIT,
  ENABLE,
  DISABLE,
}

export enum IfHotStatus {
  否,
  是,
}

export enum IfCheckStatus {
  待定,
  通过,
  驳回,
}

export enum BusinessStatus {
  待处理,
  对接中,
  对接成功,
  对接失败,
}

export enum IfDelStatus {
  否,
  是,
}

export enum IfServiceStatus {
  否,
  是,
}
export enum IfVisitStatus {
  否,
  是,
}
export enum SourceStatus {
  sys,
  cust,
}
export enum ResultEnum {
  SUCCESS = 200,
  ERROR = -1,
  TIMEOUT = 401,
}

export enum StorageEnum {
  Captcha = 'captcha',
  User = 'user',
  Token = 'token',
  Settings = 'settings',
  I18N = 'i18nextLng',
}

export enum ThemeMode {
  Light = 'light',
  Dark = 'dark',
}

export enum ThemeLayout {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
  Mini = 'mini',
}

export enum ThemeColorPresets {
  Default = 'default',
  Cyan = 'cyan',
  Purple = 'purple',
  Blue = 'blue',
  Orange = 'orange',
  Red = 'red',
}

export enum LocalEnum {
  en_US = 'en_US',
  zh_CN = 'zh_CN',
}

export enum MultiTabOperation {
  FULLSCREEN = 'fullscreen',
  REFRESH = 'refresh',
  CLOSE = 'close',
  CLOSEOTHERS = 'closeOthers',
  CLOSEALL = 'closeAll',
  CLOSELEFT = 'closeLeft',
  CLOSERIGHT = 'closeRight',
}

export enum PermissionType {
  CATALOGUE,
  MENU,
  BUTTON,
}
