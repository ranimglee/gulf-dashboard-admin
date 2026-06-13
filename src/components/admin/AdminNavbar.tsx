import React from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, LogOut, Shield } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export function AdminNavbar() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('role');
      localStorage.setItem('adminAuth', 'false');

      toast({
        title: 'Déconnexion réussie',
        description: 'Vous avez été déconnecté avec succès.',
      });

      navigate('/login');
    } catch (error: any) {
      toast({
        title: 'Erreur de déconnexion',
        description: 'Échec de la déconnexion. Veuillez réessayer.',
        variant: 'destructive',
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-6">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">

          <SidebarTrigger className="text-[#1A535C] hover:opacity-80 transition" />

          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#1A535C]" />
              <h1 className="text-lg font-semibold text-[#1A535C]">
                Dashboard Admin
              </h1>
            </div>

            <p className="text-xs text-gray-500">
              Gestion du contenu AFAQ
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* NOTIFICATIONS */}
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-xl hover:bg-gray-100 transition"
          >
            <Bell className="h-5 w-5 text-gray-600" />

            {/* notification dot */}
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </Button>

          {/* USER MENU */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-gray-100 transition"
              >
                <Avatar className="h-8 w-8 bg-[#1A535C] shadow-sm">
                  <AvatarFallback className="bg-[#1A535C] text-white text-sm font-semibold">
                    AD
                  </AvatarFallback>
                </Avatar>

                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="text-sm font-medium text-gray-800">
                    Administrateur
                  </span>
                  <span className="text-xs text-gray-500">
                    Admin Panel
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl border border-gray-100 bg-white shadow-lg"
            >

              <div className="px-3 py-2">
                <p className="text-sm font-medium text-gray-800">
                  Compte administrateur
                </p>
                <p className="text-xs text-gray-500">
                  Gestion système
                </p>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-50">
                <Bell className="mr-2 h-4 w-4 text-gray-600" />
                Notifications
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer rounded-lg text-red-600 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}