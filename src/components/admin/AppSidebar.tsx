
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  FileText, 
  Users, 
  MessageSquare, 
  Settings, 
  Shield,
  Home
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
  { title: 'Accueil', url: '/', icon: Home },
  { title: 'Aperçu', url: '/admin', icon: BarChart3, section: 'overview' },
  { title: 'Contenu', url: '/admin', icon: FileText, section: 'content' },
  { title: 'Utilisateurs', url: '/admin', icon: Users, section: 'users' },
  { title: 'Messages', url: '/admin', icon: MessageSquare, section: 'messages' },
  { title: 'Paramètres', url: '/admin', icon: Settings, section: 'settings' },
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

  const handleTabClick = (item: typeof navigationItems[0]) => {
    if (item.section) {
      onTabChange(item.section);
    }
  };

  const getNavClassName = (item: typeof navigationItems[0]) => {
    const isActive = item.section ? activeTab === item.section : location.pathname === item.url;
    return isActive 
      ? 'bg-[#1A535C] text-white font-medium' 
      : 'text-[#333333] hover:bg-[#F4E1D2] hover:text-[#1A535C]';
  };

  return (
    <Sidebar className="border-r border-[#E5E7EB]">
      <SidebarContent className="bg-white">
        <div className="p-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1A535C] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-bold text-[#1A535C]">AFAK</h2>
                <p className="text-xs text-[#333333]">Admin Portal</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[#1A535C] font-medium">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {item.section ? (
                      <button
                        onClick={() => handleTabClick(item)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${getNavClassName(item)}`}
                      >
                        <item.icon className="h-4 w-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </button>
                    ) : (
                      <NavLink
                        to={item.url}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${getNavClassName(item)}`}
                      >
                        <item.icon className="h-4 w-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
