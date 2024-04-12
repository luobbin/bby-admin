import { useMutation } from '@tanstack/react-query';
import { App } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { create } from 'zustand';

import userService, { LoginReq } from '@/api/services/userService';
import { getItem, removeItem, setItem } from '@/utils/storage';

import { UserCaptcha, UserInfo, UserToken } from '#/entity';
import { StorageEnum, PermissionType } from '#/enum';

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

type UserStore = {
  userInfo: Partial<UserInfo>;
  userToken: UserToken;
  captcha: UserCaptcha;
  // 使用 actions 命名空间来存放所有的 action
  actions: {
    setUserInfo: (userInfo: UserInfo) => void;
    setUserToken: (token: UserToken) => void;
    setCaptcha: (captcha: UserCaptcha) => void;
    clearUserInfoAndToken: () => void;
    clearCaptcha: () => void;
  };
};

const useUserStore = create<UserStore>((set) => ({
  captcha: getItem<UserCaptcha>(StorageEnum.Captcha) || {},
  userInfo: getItem<UserInfo>(StorageEnum.User) || {},
  userToken: getItem<UserToken>(StorageEnum.Token) || {},
  actions: {
    setCaptcha: (captcha) => {
      set({ captcha });
      setItem(StorageEnum.Captcha, captcha);
    },
    setUserInfo: (userInfo) => {
      set({ userInfo });
      setItem(StorageEnum.User, userInfo);
    },
    setUserToken: (userToken) => {
      set({ userToken });
      setItem(StorageEnum.Token, userToken);
    },
    clearUserInfoAndToken() {
      set({ userInfo: {}, userToken: {} });
      removeItem(StorageEnum.User);
      removeItem(StorageEnum.Token);
    },
    clearCaptcha() {
      set({ captcha: {} });
      removeItem(StorageEnum.Captcha);
    },
  },
}));

export const useUserInfo = () => useUserStore((state) => state.userInfo);
export const useUserToken = () => useUserStore((state) => state.userToken);
export const useUserPermission = () => useUserStore((state) => state.userInfo.permissions);
export const useUserActions = () => useUserStore((state) => state.actions);

export const useLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { notification, message } = App.useApp();
  const { setUserToken, setUserInfo } = useUserActions();

  const loginMutation = useMutation(userService.login);
  const infoMutation = useMutation(userService.userInfo);

  const login = async (data: LoginReq) => {
    try {
      const res = await loginMutation.mutateAsync(data);
      const { accessToken, refreshToken } = res;
      setUserToken({ accessToken, refreshToken });
      // 获取用户基本信息
      const resInfo = await infoMutation.mutateAsync();
      resInfo.permissions = PERMISSION_LIST;
      setUserInfo(resInfo);
      // 跳转到首页
      navigate(HOMEPAGE, { replace: true });

      notification.success({
        message: t('sys.login.loginSuccessTitle'),
        description: `${t('sys.login.loginSuccessDesc')}: ${data.username}`,
        duration: 3,
      });
    } catch (err) {
      message.warning({
        content: err.message,
        duration: 3,
      });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(login, []);
};

export const useCaptcha = () => {
  const { message } = App.useApp();
  const captchaMutation = useMutation(userService.captcha);
  // eslint-disable-next-line consistent-return
  return useCallback(async () => {
    try {
      const res = await captchaMutation.mutateAsync();
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
/**
 * User permission BackGround Website
 */
const WEBSITE_PERMISSION = {
  id: '2',
  parentId: '',
  label: 'sys.menu.website',
  name: 'Website',
  icon: 'ic-management',
  type: PermissionType.CATALOGUE,
  route: 'website',
  order: 2,
  children: [
    {
      id: '21',
      parentId: '2',
      label: 'sys.menu.config',
      name: 'Config',
      type: PermissionType.MENU,
      route: 'config',
      component: '/website/config/index.tsx',
    },
    {
      id: '22',
      parentId: '2',
      label: 'sys.menu.article',
      name: 'Article',
      type: PermissionType.MENU,
      route: 'article',
      component: '/website/article/index.tsx',
    },
    {
      id: '23',
      parentId: '2',
      label: 'sys.menu.articleEdit',
      name: 'ArticleEdit',
      type: PermissionType.MENU,
      route: 'articleEdit',
      hide: true,
      component: '/website/article/articleEdit/index.tsx',
    },
  ],
};
/**
 * User permission BackGround Facilitator
 */
const FACILITATOR_PERMISSION = {
  id: '7',
  parentId: '',
  label: 'sys.menu.facilitator',
  name: 'Facilitator',
  icon: 'ic-management',
  type: PermissionType.CATALOGUE,
  route: 'facilitator',
  order: 7,
  children: [
    {
      id: '71',
      parentId: '7',
      label: 'sys.menu.company',
      name: 'Company',
      type: PermissionType.MENU,
      route: 'company',
      component: '/facilitator/company/index.tsx',
    },
    {
      id: '72',
      parentId: '7',
      label: 'sys.menu.solution',
      name: 'Solution',
      type: PermissionType.MENU,
      route: 'solution',
      component: '/facilitator/solution/index.tsx',
    },
    {
      id: '73',
      parentId: '7',
      label: 'sys.menu.solutionBusiness',
      name: 'SolutionBusiness',
      type: PermissionType.MENU,
      route: 'solutionBusiness',
      component: '/facilitator/solutionBusiness/index.tsx',
    },
    {
      id: '74',
      parentId: '7',
      label: 'sys.menu.companyExamine',
      name: 'CompanyExamine',
      type: PermissionType.MENU,
      route: 'companyExamine',
      component: '/facilitator/companyExamine/index.tsx',
    },
    {
      id: '75',
      parentId: '7',
      label: 'sys.menu.case',
      name: 'Case',
      type: PermissionType.MENU,
      route: 'case',
      component: '/facilitator/case/index.tsx',
    },
    {
      id: '76',
      parentId: '7',
      label: 'sys.menu.companyEdit',
      name: 'CompanyEdit',
      type: PermissionType.MENU,
      route: 'companyEdit',
      hide: true,
      component: '/facilitator/company/companyEdit.tsx',
    },
    {
      id: '77',
      parentId: '7',
      label: 'sys.menu.solutionEdit',
      name: 'SolutionEdit',
      type: PermissionType.MENU,
      route: 'solutionEdit',
      hide: true,
      component: '/facilitator/solution/solutionEdit.tsx',
    },
    {
      id: '78',
      parentId: '7',
      label: 'sys.menu.caseEdit',
      name: 'CaseEdit',
      type: PermissionType.MENU,
      route: 'caseEdit',
      hide: true,
      component: '/facilitator/case/caseEdit.tsx',
    },
  ],
};

/**
 * User permission BackGround Customer
 */
const CUSTOMER_PERMISSION = {
  id: '8',
  parentId: '',
  label: 'sys.menu.customer',
  name: 'Customer',
  icon: 'ic-management',
  type: PermissionType.CATALOGUE,
  route: 'customer',
  order: 8,
  children: [
    {
      id: '82',
      parentId: '8',
      label: 'sys.menu.member',
      name: 'Member',
      type: PermissionType.MENU,
      route: 'member',
      component: '/customer/member/index.tsx',
    },
    {
      id: '81',
      parentId: '8',
      label: 'sys.menu.demand',
      name: 'Demand',
      type: PermissionType.MENU,
      route: 'demand',
      component: '/customer/demand/index.tsx',
    },
    {
      id: '82',
      parentId: '8',
      label: 'sys.menu.demandEdit',
      name: 'DemandEdit',
      type: PermissionType.MENU,
      route: 'demandEdit',
      hide: true,
      component: '/customer/demand/demandEdit.tsx',
    },
    {
      id: '83',
      parentId: '8',
      label: 'sys.menu.demandTrial',
      name: 'DemandTrial',
      type: PermissionType.MENU,
      route: 'demandTrial',
      component: '/customer/demandTrial/index.tsx',
    },
    {
      id: '84',
      parentId: '8',
      label: 'sys.menu.solutionTrial',
      name: 'SolutionTrial',
      type: PermissionType.MENU,
      route: 'solutionTrial',
      component: '/customer/solutionTrial/index.tsx',
    },
  ],
};

/**
 * User permission BackGround Column
 */
const CATEGORIZE_PERMISSION = {
  id: '9',
  parentId: '',
  label: 'sys.menu.categorize',
  name: 'Categorize',
  icon: 'ic-management',
  type: PermissionType.CATALOGUE,
  route: 'categorize',
  order: 9,
  children: [
    {
      id: '91',
      parentId: '9',
      label: 'sys.menu.support',
      name: 'Support',
      type: PermissionType.MENU,
      route: 'support',
      component: '/categorize/support/index.tsx',
    },
    {
      id: '92',
      parentId: '9',
      label: 'sys.menu.region',
      name: 'Region',
      type: PermissionType.MENU,
      route: 'region',
      component: '/categorize/region/index.tsx',
    },
    {
      id: '93',
      parentId: '9',
      label: 'sys.menu.industry',
      name: 'Industry',
      type: PermissionType.MENU,
      route: 'industry',
      component: '/categorize/industry/index.tsx',
    },
    {
      id: '94',
      parentId: '9',
      label: 'sys.menu.scene',
      name: 'Scene',
      type: PermissionType.MENU,
      route: 'scene',
      component: '/categorize/scene/index.tsx',
    },
  ],
};

/**
 * User permission mock
 */
const DASHBOARD_PERMISSION = {
  id: '9100714781927703',
  parentId: '',
  label: 'sys.menu.dashboard',
  name: 'Dashboard',
  icon: 'ic-analysis',
  type: PermissionType.CATALOGUE,
  route: 'dashboard',
  order: 91,
  children: [
    {
      id: '8426999229400979',
      parentId: '9100714781927703',
      label: 'sys.menu.workbench',
      name: 'Workbench',
      type: PermissionType.MENU,
      route: 'workbench',
      component: '/dashboard/workbench/index.tsx',
    },
    {
      id: '9710971640510357',
      parentId: '9100714781927703',
      label: 'sys.menu.analysis',
      name: 'Analysis',
      type: PermissionType.MENU,
      route: 'analysis',
      component: '/dashboard/analysis/index.tsx',
    },
  ],
};
/* const MANAGEMENT_PERMISSION = {
  id: '0901673425580518',
  parentId: '',
  label: 'sys.menu.management',
  name: 'Management',
  icon: 'ic-management',
  type: PermissionType.CATALOGUE,
  route: 'management',
  order: 92,
  children: [
    {
      id: '2781684678535711',
      parentId: '0901673425580518',
      label: 'sys.menu.user.index',
      name: 'User',
      type: PermissionType.CATALOGUE,
      route: 'user',
      children: [
        {
          id: '4754063958766648',
          parentId: '2781684678535711',
          label: 'sys.menu.user.profile',
          name: 'Profile',
          type: PermissionType.MENU,
          route: 'profile',
          component: '/management/user/profile/index.tsx',
        },
        {
          id: '2516598794787938',
          parentId: '2781684678535711',
          label: 'sys.menu.user.account',
          name: 'Account',
          type: PermissionType.MENU,
          route: 'account',
          component: '/management/user/account/index.tsx',
        },
      ],
    },
    {
      id: '0249937641030250',
      parentId: '0901673425580518',
      label: 'sys.menu.system.index',
      name: 'System',
      type: PermissionType.CATALOGUE,
      route: 'system',
      children: [
        {
          id: '1985890042972842',
          parentId: '0249937641030250',
          label: 'sys.menu.system.organization',
          name: 'Organization',
          type: PermissionType.MENU,
          route: 'organization',
          component: '/management/system/organization/index.tsx',
        },
        {
          id: '4359580910369984',
          parentId: '0249937641030250',
          label: 'sys.menu.system.permission',
          name: 'Permission',
          type: PermissionType.MENU,
          route: 'permission',
          component: '/management/system/permission/index.tsx',
        },
        {
          id: '1689241785490759',
          parentId: '0249937641030250',
          label: 'sys.menu.system.role',
          name: 'Role',
          type: PermissionType.MENU,
          route: 'role',
          component: '/management/system/role/index.tsx',
        },
        {
          id: '0157880245365433',
          parentId: '0249937641030250',
          label: 'sys.menu.system.user',
          name: 'User',
          type: PermissionType.MENU,
          route: 'user',
          component: '/management/system/user/index.tsx',
        },
        {
          id: '0157880245365434',
          parentId: '0249937641030250',
          label: 'sys.menu.system.user_detail',
          name: 'User Detail',
          type: PermissionType.MENU,
          route: 'user/:id',
          component: '/management/system/user/detail.tsx',
          hide: true,
        },
      ],
    },
  ],
};
const COMPONENTS_PERMISSION = {
  id: '2271615060673773',
  parentId: '',
  label: 'sys.menu.components',
  name: 'Components',
  icon: 'solar:widget-5-bold-duotone',
  type: PermissionType.CATALOGUE,
  route: 'components',
  order: 93,
  children: [
    {
      id: '2478488238255411',
      parentId: '2271615060673773',
      label: 'sys.menu.icon',
      name: 'Icon',
      type: PermissionType.MENU,
      route: 'icon',
      component: '/components/icon/index.tsx',
    },
    {
      id: '6755238352318767',
      parentId: '2271615060673773',
      label: 'sys.menu.animate',
      name: 'Animate',
      type: PermissionType.MENU,
      route: 'animate',
      component: '/components/animate/index.tsx',
    },
    {
      id: '9992476513546805',
      parentId: '2271615060673773',
      label: 'sys.menu.scroll',
      name: 'Scroll',
      type: PermissionType.MENU,
      route: 'scroll',
      component: '/components/scroll/index.tsx',
    },
    {
      id: '1755562695856395',
      parentId: '2271615060673773',
      label: 'sys.menu.markdown',
      name: 'Markdown',
      type: PermissionType.MENU,
      route: 'markdown',
      component: '/components/markdown/index.tsx',
    },
    {
      id: '2122547769468069',
      parentId: '2271615060673773',
      label: 'sys.menu.editor',
      name: 'Editor',
      type: PermissionType.MENU,
      route: 'editor',
      component: '/components/editor/index.tsx',
    },
    {
      id: '2501920741714350',
      parentId: '2271615060673773',
      label: 'sys.menu.i18n',
      name: 'Multi Language',
      type: PermissionType.MENU,
      route: 'i18n',
      component: '/components/multi-language/index.tsx',
    },
    {
      id: '2013577074467956',
      parentId: '2271615060673773',
      label: 'sys.menu.upload',
      name: 'upload',
      type: PermissionType.MENU,
      route: 'Upload',
      component: '/components/upload/index.tsx',
    },
    {
      id: '7749726274771764',
      parentId: '2271615060673773',
      label: 'sys.menu.chart',
      name: 'Chart',
      type: PermissionType.MENU,
      route: 'chart',
      component: '/components/chart/index.tsx',
    },
  ],
};
const FUNCTIONS_PERMISSION = {
  id: '8132044808088488',
  parentId: '',
  label: 'sys.menu.functions',
  name: 'functions',
  icon: 'solar:plain-2-bold-duotone',
  type: PermissionType.CATALOGUE,
  route: 'functions',
  order: 94,
  children: [
    {
      id: '3667930780705750',
      parentId: '8132044808088488',
      label: 'sys.menu.clipboard',
      name: 'Clipboard',
      type: PermissionType.MENU,
      route: 'clipboard',
      component: '/functions/clipboard/index.tsx',
    },
  ],
};
const MENU_LEVEL_PERMISSION = {
  id: '0194818428516575',
  parentId: '',
  label: 'sys.menu.menulevel.index',
  name: 'Menu Level',
  icon: 'ic-menulevel',
  type: PermissionType.CATALOGUE,
  route: 'menu-level',
  order: 95,
  children: [
    {
      id: '0144431332471389',
      parentId: '0194818428516575',
      label: 'sys.menu.menulevel.1a',
      name: 'Menu Level 1a',
      type: PermissionType.MENU,
      route: 'menu-level-1a',
      component: '/menu-level/menu-level-1a/index.tsx',
    },
    {
      id: '7572529636800586',
      parentId: '0194818428516575',
      label: 'sys.menu.menulevel.1b.index',
      name: 'Menu Level 1b',
      type: PermissionType.CATALOGUE,
      route: 'menu-level-1b',
      children: [
        {
          id: '3653745576583237',
          parentId: '7572529636800586',
          label: 'sys.menu.menulevel.1b.2a',
          name: 'Menu Level 2a',
          type: PermissionType.MENU,
          route: 'menu-level-2a',
          component: '/menu-level/menu-level-1b/menu-level-2a/index.tsx',
        },
        {
          id: '4873136353891364',
          parentId: '7572529636800586',
          label: 'sys.menu.menulevel.1b.2b.index',
          name: 'Menu Level 2b',
          type: PermissionType.CATALOGUE,
          route: 'menu-level-2b',
          children: [
            {
              id: '4233029726998055',
              parentId: '4873136353891364',
              label: 'sys.menu.menulevel.1b.2b.3a',
              name: 'Menu Level 3a',
              type: PermissionType.MENU,
              route: 'menu-level-3a',
              component: '/menu-level/menu-level-1b/menu-level-2b/menu-level-3a/index.tsx',
            },
            {
              id: '3298034742548454',
              parentId: '4873136353891364',
              label: 'sys.menu.menulevel.1b.2b.3b',
              name: 'Menu Level 3b',
              type: PermissionType.MENU,
              route: 'menu-level-3b',
              component: '/menu-level/menu-level-1b/menu-level-2b/menu-level-3b/index.tsx',
            },
          ],
        },
      ],
    },
  ],
};
const ERRORS_PERMISSION = {
  id: '9406067785553476',
  parentId: '',
  label: 'sys.menu.error.index',
  name: 'Error',
  icon: 'bxs:error-alt',
  type: PermissionType.CATALOGUE,
  route: 'error',
  order: 96,
  children: [
    {
      id: '8557056851997154',
      parentId: '9406067785553476',
      label: 'sys.menu.error.403',
      name: '403',
      type: PermissionType.MENU,
      route: '403',
      component: '/sys/error/Page403.tsx',
    },
    {
      id: '5095669208159005',
      parentId: '9406067785553476',
      label: 'sys.menu.error.404',
      name: '404',
      type: PermissionType.MENU,
      route: '404',
      component: '/sys/error/Page404.tsx',
    },
    {
      id: '0225992135973772',
      parentId: '9406067785553476',
      label: 'sys.menu.error.500',
      name: '500',
      type: PermissionType.MENU,
      route: '500',
      component: '/sys/error/Page500.tsx',
    },
  ],
};
const OTHERS_PERMISSION = [
  {
    id: '3981225257359246',
    parentId: '',
    label: 'sys.menu.calendar',
    name: 'Calendar',
    icon: 'solar:calendar-bold-duotone',
    type: PermissionType.MENU,
    route: 'calendar',
    component: '/sys/others/calendar/index.tsx',
  },
  {
    id: '3513985683886393',
    parentId: '',
    label: 'sys.menu.kanban',
    name: 'kanban',
    icon: 'solar:clipboard-bold-duotone',
    type: PermissionType.MENU,
    route: 'kanban',
    component: '/sys/others/kanban/index.tsx',
  },
  {
    id: '5455837930804461',
    parentId: '',
    label: 'sys.menu.disabled',
    name: 'Disabled',
    icon: 'ic_disabled',
    type: PermissionType.MENU,
    route: 'disabled',
    status: BasicStatus.DISABLE,
    component: '/sys/others/calendar/index.tsx',
  },
  {
    id: '7728048658221587',
    parentId: '',
    label: 'sys.menu.label',
    name: 'Label',
    icon: 'ic_label',
    type: PermissionType.MENU,
    route: 'label',
    newFeature: true,
    component: '/sys/others/blank.tsx',
  },
  {
    id: '5733704222120995',
    parentId: '',
    label: 'sys.menu.frame',
    name: 'Frame',
    icon: 'ic_external',
    type: PermissionType.CATALOGUE,
    route: 'frame',
    children: [
      {
        id: '9884486809510480',
        parentId: '5733704222120995',
        label: 'sys.menu.external_link',
        name: 'External Link',
        type: PermissionType.MENU,
        route: 'external_link',
        hideTab: true,
        component: '/sys/others/iframe/external-link.tsx',
        frameSrc: 'https://ant.design/',
      },
      {
        id: '9299640886731819',
        parentId: '5733704222120995',
        label: 'sys.menu.iframe',
        name: 'Iframe',
        type: PermissionType.MENU,
        route: 'frame',
        component: '/sys/others/iframe/index.tsx',
        frameSrc: 'https://ant.design/',
      },
    ],
  },
  {
    id: '0941594969900756',
    parentId: '',
    label: 'sys.menu.blank',
    name: 'Disabled',
    icon: 'ic_blank',
    type: PermissionType.MENU,
    route: 'blank',
    component: '/sys/others/blank.tsx',
  },
]; */

export const PERMISSION_LIST = [
  WEBSITE_PERMISSION,
  FACILITATOR_PERMISSION,
  CUSTOMER_PERMISSION,
  CATEGORIZE_PERMISSION,
  DASHBOARD_PERMISSION,
  // MANAGEMENT_PERMISSION,
  // COMPONENTS_PERMISSION,
  // FUNCTIONS_PERMISSION,
  // MENU_LEVEL_PERMISSION,
  // ERRORS_PERMISSION,
  // ...OTHERS_PERMISSION,
];
