
import React from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, User, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function AdminNavbar() {
  return (
    <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-[#1A535C]" />
        <div>
          <h1 className="text-xl font-bold text-[#1A535C]">Dashboard Admin</h1>
          <p className="text-sm text-[#333333]">Gestion du contenu AFAK</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="text-[#333333] hover:bg-[#F4E1D2]">
          <Bell className="h-5 w-5" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-[#F4E1D2]">
              <Avatar className="h-8 w-8 bg-[#1A535C]">
                <AvatarFallback className="bg-[#1A535C] text-white text-sm">
                  AD
                </AvatarFallback>
              </Avatar>
              <span className="text-[#333333]">Administrateur</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border-[#E5E7EB]">
            <DropdownMenuItem className="hover:bg-[#F4E1D2] cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#F4E1D2] cursor-pointer">
              <Bell className="mr-2 h-4 w-4" />
              <span>Notifications</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-[#F4E1D2] cursor-pointer text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
