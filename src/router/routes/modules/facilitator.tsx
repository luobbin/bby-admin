import { Suspense, lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { SvgIcon } from '@/components/icon';
import { CircleLoading } from '@/components/loading';

import { AppRouteObject } from '#/router';

const CompanyPage = lazy(() => import('@/pages/facilitator/company'));
const SolutionPage = lazy(() => import('@/pages/facilitator/solution'));
const SolutionBusinessPage = lazy(() => import('@/pages/facilitator/solutionBusiness'));
const CasePage = lazy(() => import('@/pages/facilitator/case'));
const CompanyExaminePage = lazy(() => import('@/pages/facilitator/companyExamine'));
const CompanyEditPage = lazy(() => import('@/pages/facilitator/company/companyEdit.tsx'));
const CaseEditPage = lazy(() => import('@/pages/facilitator/case/caseEdit.tsx'));
const SolutionEditPage = lazy(() => import('@/pages/facilitator/solution/solutionEdit.tsx'));

const facilitator: AppRouteObject = {
  order: 4,
  path: 'facilitator',
  element: (
    <Suspense fallback={<CircleLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: 'sys.menu.facilitator',
    icon: <SvgIcon icon="ic-management" className="ant-menu-item-icon" size="24" />,
    key: '/facilitator',
  },
  children: [
    {
      index: true,
      element: <Navigate to="company" replace />,
    },
    {
      path: 'company',
      element: <CompanyPage />,
      meta: { label: 'sys.menu.company', key: '/facilitator/company' },
    },
    {
      path: 'companyEdit',
      element: <CompanyEditPage />,
      meta: { label: 'sys.menu.companyEdit', key: '/facilitator/companyEdit' },
    },
    {
      path: 'solution',
      element: <SolutionPage />,
      meta: { label: 'sys.menu.solution', key: '/facilitator/solution' },
    },
    {
      path: 'solutionEdit',
      element: <SolutionEditPage />,
      meta: { label: 'sys.menu.solutionEdit', key: '/facilitator/solutionEdit' },
    },
    {
      path: 'solutionBusiness',
      element: <SolutionBusinessPage />,
      meta: { label: 'sys.menu.solutionBusiness', key: '/facilitator/solutionBusiness' },
    },
    {
      path: 'companyExamine',
      element: <CompanyExaminePage />,
      meta: { label: 'sys.menu.companyExamine', key: '/facilitator/companyExamine' },
    },
    {
      path: 'case',
      element: <CasePage />,
      meta: { label: 'sys.menu.case', key: '/facilitator/case' },
    },
    {
      path: 'caseEdit',
      element: <CaseEditPage />,
      meta: { label: 'sys.menu.caseEdit', key: '/facilitator/caseEdit' },
    },
  ],
};

export default facilitator;
