import { usePathname, useSearchParams } from 'next/navigation';

export interface NavigationItem {
  title: string;
  url: string;
  parentClickable?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
  acceptedRoles?: number[];
  renderMode?: 'horizontal' | 'vertical';
  items?: NavigationItem[];
}

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

// Helper function to check if a path is active
export function isPathActive(currentPath: string, targetPath: string): boolean {
  // Parse current path and query parameters
  const [currentPathOnly, currentQuery] = currentPath.split('?');
  const [targetPathOnly, targetQuery] = targetPath.split('?');

  // Check if base paths match
  if (currentPathOnly !== targetPathOnly) return false;

  // If target has no query parameters, match any query
  if (!targetQuery) return true;

  // If target has query parameters, current must also have them
  if (!currentQuery) return false;

  // Parse query parameters
  const currentParams = new URLSearchParams(currentQuery);
  const targetParams = new URLSearchParams(targetQuery);

  // Check if all target query parameters match current ones
  const targetEntries = Array.from(targetParams.entries());
  for (const [key, value] of targetEntries) {
    if (currentParams.get(key) !== value) return false;
  }

  return true;
}

// Helper function to check if any menu item in a group is active
export function isMenuGroupActive(
  currentPath: string,
  menuItems: { url: string }[]
): boolean {
  return menuItems.some((item) => isPathActive(currentPath, item.url));
}

// Hook to get current path with search params
export function useCurrentPath(): string {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return searchParams?.toString() ?? ""
    ? `${pathname}?${searchParams?.toString() ?? ""}`
    : pathname ?? "";
}
/**
 * Filter navigation items based on user role
 */
export function filterNavigationByRole(
  navigationItems: NavigationItem[],
  userRoleId: number
): NavigationItem[] {
  return navigationItems.filter((item) => {
    // Check if item has role restrictions
    if (item.acceptedRoles) {
      return item.acceptedRoles.includes(userRoleId);
    }

    // If no role restrictions, check if any sub-items are accessible
    if (item.items) {
      return item.items.some((subItem: NavigationItem) => {
        if (subItem.acceptedRoles) {
          return subItem.acceptedRoles.includes(userRoleId);
        }
        return true; // No role restrictions on sub-item
      });
    }

    return true; // No restrictions
  });
}

/**
 * Filter sub-items of a navigation item based on user role
 */
export function filterSubItemsByRole(
  navigationItem: NavigationItem,
  userRoleId: number
): NavigationItem['items'] {
  if (!navigationItem.items) {
    return [];
  }

  return navigationItem.items.filter((subItem: NavigationItem) => {
    if (subItem.acceptedRoles) {
      return subItem.acceptedRoles.includes(userRoleId);
    }
    return true; // No role restrictions on sub-item
  });
}

/**
 * Check if user is a manager (RoleId 1 or 2)
 */
export function isManager(userRoleId: number): boolean {
  return userRoleId === 1 || userRoleId === 2;
}
