import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  BarChart3,
  FileText,
  Users,
  MessageSquare,
  Shield,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const navigationItems = [
  { title: 'Dashboard', url: '/admin', icon: BarChart3, section: 'overview' },
  { title: 'Contenu', url: '/admin', icon: FileText, section: 'content' },
  { title: 'Utilisateurs', url: '/admin', icon: Users, section: 'users' },
  { title: 'Messages', url: '/admin', icon: MessageSquare, section: 'messages' },
  { title: 'Sécurité', url: '/admin', icon: Shield, section: 'security' },
];

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();

  const isCollapsed = state === 'collapsed';

  const handleTabClick = (item: (typeof navigationItems)[0]) => {
    if (item.section) onTabChange(item.section);
  };

  const isActiveItem = (item: (typeof navigationItems)[0]) => {
    return item.section
      ? activeTab === item.section
      : location.pathname === item.url;
  };

  return (
    <Sidebar className="border-r border-gray-100 bg-white">
      <SidebarContent className="bg-white">

        {/* BRAND */}
        <div className="border-b border-gray-100 px-4 py-5">
          <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm overflow-hidden">
  <img
    src="/images/logo-back.png"
    alt="AFAQ Logo"
    className="h-full w-full object-contain p-1"
  />
</div>

            {!isCollapsed && (
              <div className="leading-tight">
                <h2 className="text-sm font-semibold text-[#1A535C]">
                  AFAQ
                </h2>
                <p className="text-xs text-gray-500">
                  Admin Portal
                </p>
              </div>
            )}
          </div>
        </div>

        {/* NAVIGATION */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="px-2 pt-3 text-xs font-medium uppercase tracking-wider text-gray-400">
              Navigation
            </SidebarGroupLabel>
          )}

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2 py-3">

              {navigationItems.map((item) => {
                const active = isActiveItem(item);

                const baseClass =
                  'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-200';

                const activeClass =
                  'bg-[#1A535C] text-white shadow-sm';

                const inactiveClass =
                  'text-gray-600 hover:bg-gray-50 hover:text-[#1A535C]';

                const className = `${baseClass} ${
                  active ? activeClass : inactiveClass
                }`;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>

                      {item.section ? (
                        <button
                          onClick={() => handleTabClick(item)}
                          className={className}
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          {!isCollapsed && (
                            <span className="font-medium">
                              {item.title}
                            </span>
                          )}
                        </button>
                      ) : (
                        <NavLink to={item.url} className={className}>
                          <item.icon className="h-4 w-4 shrink-0" />
                          {!isCollapsed && (
                            <span className="font-medium">
                              {item.title}
                            </span>
                          )}
                        </NavLink>
                      )}

                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}