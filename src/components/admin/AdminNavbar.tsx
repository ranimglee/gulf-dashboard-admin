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
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export function AdminNavbar() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      // Clear client-side authentication data
      localStorage.removeItem('token');
localStorage.removeItem('refreshToken');
localStorage.removeItem('accessToken');
localStorage.removeItem('role');


      // Show success message
      toast({
        title: 'Déconnexion réussie',
        description: 'Vous avez été déconnecté avec succès.',
      });

      // Redirect to login page
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
    <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-[#1A535C]" />
        <div>
          <h1 className="text-xl font-bold text-[#1A535C]">Dashboard Admin</h1>
          <p className="text-sm text-[#333333]">Gestion du contenu AFAQ</p>
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
              <Bell className="mr-2 h-4 w-4" />
              <span>Notifications</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="hover:bg-[#F4E1D2] cursor-pointer text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}