import { Tabs, TabsProps } from 'antd';

import { Iconify } from '@/components/icon';

import GeneralTab from './general-tab';
// import BannersTab from './banners-tab.tsx';
import OthersTab from './others-tab.tsx';

function ConfigSet() {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <div className="flex items-center">
          <Iconify icon="solar:user-id-bold" size={24} className="mr-2" />
          <span>主要参数设置</span>
        </div>
      ),
      children: <GeneralTab />,
    },
    /* {
      key: '2',
      label: (
        <div className="flex items-center">
          <Iconify icon="solar:bell-bing-bold-duotone" size={24} className="mr-2" />
          <span>banner设置</span>
        </div>
      ),
      children: <BannersTab />,
    }, */
    {
      key: '3',
      label: (
        <div className="flex items-center">
          <Iconify icon="solar:key-minimalistic-square-3-bold-duotone" size={24} className="mr-2" />
          <span>密码设置</span>
        </div>
      ),
      children: <OthersTab />,
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} />;
}

export default ConfigSet;
