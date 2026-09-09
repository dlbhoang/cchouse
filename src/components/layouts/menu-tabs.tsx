'use client';
import { Edit, Home, Key, Map } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AppRoutes } from '@/lib/core/configs/appRoutes';
import { ETransType } from '@/lib/core/enum';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { isPathActive, useCurrentPath } from './navigation';

interface TabData {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MenuTabs = () => {
  const currentPath = useCurrentPath();
  const router = useRouter();
  const tabsData: TabData[] = [
    {
      value: `${AppRoutes.property.url}?TransType=${ETransType.sell}`,
      label: 'Mua bán',
      icon: Home,
    },
    {
      value: `${AppRoutes.property.url}?TransType=${ETransType.rent}`,
      label: 'Cho thuê',
      icon: Key,
    },
    {
      value: `${AppRoutes.map.url}`,
      label: 'Bản đồ',
      icon: Map,
    },
    {
      value: `${AppRoutes.feed.url}`,
      label: 'Tin đăng',
      icon: Edit,
    },
  ];

  const handleTabChange = (value: string) => {
    router.push(value);
  };

  return (
    <Tabs
      value={
        tabsData.find((tab) => isPathActive(currentPath, tab.value))?.value
      }
      onValueChange={handleTabChange}
      className="w-full "
    >
      <TabsList className="h-10 w-full rounded-full">
        {tabsData.map((tab) => {
          const Icon = tab.icon;
          const isActive = isPathActive(currentPath, tab.value);
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                'h-8 flex-1 px-2',
                'data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground',
                'transition-all duration-200 ease-in-out rounded-full',
                'data-[state=active]:shadow-sm',
                isActive && 'text-white'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="font-medium whitespace-nowrap text-sm">
                {tab.label}
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
};

export default MenuTabs;
