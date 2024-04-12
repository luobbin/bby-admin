import { Suspense, lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { Iconify } from '@/components/icon';
import { CircleLoading } from '@/components/loading';

import { AppRouteObject } from '#/router';

const MemberPage = lazy(() => import('@/pages/customer/member'));
const DemandPage = lazy(() => import('@/pages/customer/demand'));
const DemandTrialPage = lazy(() => import('@/pages/customer/demandTrial'));
const SolutionTrialPage = lazy(() => import('@/pages/customer/solutionTrial'));
const DemandEditPage = lazy(() => import('@/pages/customer/demand/demandEdit.tsx'));

const customer: AppRouteObject = {
  order: 4,
  path: 'customer',
  element: (
    <Suspense fallback={<CircleLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: 'sys.menu.customer',
    icon: <Iconify icon="solar:plain-2-bold-duotone" className="ant-menu-item-icon" size="24" />,
    key: '/customer',
  },
  children: [
    {
      index: true,
      element: <Navigate to="member" replace />,
    },
    {
      path: 'member',
      element: <MemberPage />,
      meta: { label: 'sys.menu.member', key: '/customer/member' },
    },
    {
      path: 'demand',
      element: <DemandPage />,
      meta: { label: 'sys.menu.demand', key: '/customer/demand' },
    },
    {
      path: 'demandEdit',
      element: <DemandEditPage />,
      meta: { label: 'sys.menu.demandEdit', key: '/customer/demandEdit' },
    },
    {
      path: 'demandTrial',
      element: <DemandTrialPage />,
      meta: { label: 'sys.menu.demandTrial', key: '/customer/demandTrial' },
    },
    {
      path: 'solutionTrial',
      element: <SolutionTrialPage />,
      meta: { label: 'sys.menu.solutionTrial', key: '/customer/solutionTrial' },
    },
  ],
};

export default customer;
