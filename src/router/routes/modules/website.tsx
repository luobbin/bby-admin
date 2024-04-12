import { Suspense, lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { Iconify } from '@/components/icon';
import { CircleLoading } from '@/components/loading';

import { AppRouteObject } from '#/router';

const ConfigPage = lazy(() => import('@/pages/website/config'));
const ArticlePage = lazy(() => import('@/pages/website/article'));
const ArticleEditPage = lazy(() => import('@/pages/website/article/articleEdit'));

const website: AppRouteObject = {
  order: 1,
  path: 'website',
  element: (
    <Suspense fallback={<CircleLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: 'sys.menu.website',
    icon: <Iconify icon="solar:plain-2-bold-duotone" className="ant-menu-item-icon" size="24" />,
    key: '/website',
  },
  children: [
    {
      index: true,
      element: <Navigate to="config" replace />,
    },
    {
      path: 'config',
      element: <ConfigPage />,
      meta: { label: 'sys.menu.config', key: '/website/config' },
    },
    {
      path: 'article',
      element: <ArticlePage />,
      meta: { label: 'sys.menu.article', key: '/website/article' },
    },
    {
      path: 'articleEdit',
      element: <ArticleEditPage />,
      meta: { label: 'sys.menu.articleEdit', key: '/website/articleEdit' },
    },
  ],
};

export default website;
