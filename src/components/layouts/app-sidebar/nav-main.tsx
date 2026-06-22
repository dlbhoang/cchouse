"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  filterNavigationByRole,
  filterSubItemsByRole,
  isMenuGroupActive,
  isPathActive,
  type NavigationItem,
  useCurrentPath,
} from "@/components/layouts/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({ items }: { items: NavigationItem[] }) {
  const currentPath = useCurrentPath();

  const { data: session } = useSession();

  const userRoleId = session?.user.RoleId || 0;
  const userEmail = session?.user.Email ?? null;
  const filteredNavigationData = filterNavigationByRole(items, userRoleId);

  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
      <SidebarMenu>
        {filteredNavigationData.map((item) => {
          const accessibleSubItems =
            filterSubItemsByRole(item, userRoleId) || [];

          // Only render if there are accessible sub-items
          if (accessibleSubItems.length === 0) {
            return null;
          }

          if (accessibleSubItems.length === 1) {
            const singleItem = accessibleSubItems[0];
            const itemIsActive = isPathActive(currentPath, singleItem.url);

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={itemIsActive}>
                  <Link href={singleItem.url}>
                    {item.icon && <item.icon />}
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isMenuGroupActive(
                currentPath,
                item.items?.map((item) => ({ url: item.url })) ?? []
              )}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isMenuGroupActive(
                      currentPath,
                      item.items?.map((item) => ({ url: item.url })) ?? []
                    )}
                  >
                    {item.icon && <item.icon />}
                    <span className="font-medium">{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {accessibleSubItems?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isPathActive(currentPath, subItem.url)}
                        >
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
