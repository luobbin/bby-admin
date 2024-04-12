import { Suspense, lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { Iconify } from '@/components/icon';
import { CircleLoading } from '@/components/loading';

import { AppRouteObject } from '#/router';

const SupportPage = lazy(() => import('@/pages/categorize/support'));
const RegionPage = lazy(() => import('@/pages/categorize/region'));
const IndustryPage = lazy(() => import('@/pages/categorize/industry'));
const ScenePage = lazy(() => import('@/pages/categorize/scene'));

const categorize: AppRouteObject = {
  order: 4,
  path: 'categorize',
  element: (
    <Suspense fallback={<CircleLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: 'sys.menu.categorize',
    icon: <Iconify icon="solar:plain-2-bold-duotone" className="ant-menu-item-icon" size="24" />,
    key: '/categorize',
  },
  children: [
    {
      index: true,
      element: <Navigate to="support" replace />,
    },
    {
      path: 'support',
      element: <SupportPage />,
      meta: { label: 'sys.menu.support', key: '/categorize/support' },
    },
    {
      path: 'region',
      element: <RegionPage />,
      meta: { label: 'sys.menu.region', key: '/categorize/region' },
    },
    {
      path: 'industry',
      element: <IndustryPage />,
      meta: { label: 'sys.menu.industry', key: '/categorize/industry' },
    },
    {
      path: 'scene',
      element: <ScenePage />,
      meta: { label: 'sys.menu.scene', key: '/categorize/scene' },
    },
  ],
};

export default categorize;
