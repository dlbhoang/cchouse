'use client';

import Link from 'next/link';
import type { NavigationItem } from './navigation-utils';

interface NavigationItemProps {
  item: NavigationItem;
  isActive: boolean;
  variant?: 'sidebar' | 'top';
  className?: string;
}

export function NavigationItemComponent({
  item,
  isActive,
  variant = 'sidebar',
  className,
}: NavigationItemProps) {
  const baseClasses =
    'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors';
  const activeClasses = isActive
    ? 'bg-accent text-accent-foreground'
    : 'hover:bg-accent hover:text-accent-foreground';

  const classes = `${baseClasses} ${activeClasses} ${className || ''}`;

  return (
    <Link href={item.url} className={classes}>
      {item.icon && <item.icon className="h-4 w-4" />}
      <span>{item.title}</span>
    </Link>
  );
}
