
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, Search, UserPlus, Shield, Mail, Calendar, MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive';
  lastLogin: string;
  joinDate: string;
}

const UserManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Ahmed Al-Rashid',
      email: 'ahmed@afak.kw',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-03-15',
      joinDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Sarah Hassan',
      email: 'sarah@afak.kw',
      role: 'editor',
      status: 'active',
      lastLogin: '2024-03-14',
      joinDate: '2024-02-01'
    },
    {
      id: '3',
      name: 'Omar Al-Sabah',
      email: 'omar@afak.kw',
      role: 'viewer',
      status: 'inactive',
      lastLogin: '2024-03-10',
      joinDate: '2024-02-20'
    }
  ]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-[#FF6F61] text-white';
      case 'editor':
        return 'bg-[#F7B32B] text-[#333333]';
      case 'viewer':
        return 'bg-[#E5E7EB] text-[#333333]';
      default:
        return 'bg-[#E5E7EB] text-[#333333]';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const handleUpdateUserRole = (userId: string, newRole: 'admin' | 'editor' | 'viewer') => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
    toast({
      title: "Rôle mis à jour",
      description: "Le rôle de l'utilisateur a été modifié avec succès.",
    });
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } 
        : user
    ));
    toast({
      title: "Statut mis à jour",
      description: "Le statut de l'utilisateur a été modifié.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1A535C]">Gestion des Utilisateurs</h2>
          <p className="text-[#333333]">Gérer les comptes utilisateurs et leurs permissions</p>
        </div>
        <Button className="bg-[#F7B32B] hover:bg-[#F7B32B]/90 text-[#333333]">
          <UserPlus className="h-4 w-4 mr-2" />
          Inviter un utilisateur
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm border-l-4 border-l-[#1A535C]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#333333]">Total Users</p>
                <p className="text-2xl font-bold text-[#1A535C]">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-[#1A535C]" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm border-l-4 border-l-[#FF6F61]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#333333]">Admins</p>
                <p className="text-2xl font-bold text-[#FF6F61]">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-[#FF6F61]" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm border-l-4 border-l-[#F7B32B]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#333333]">Editors</p>
                <p className="text-2xl font-bold text-[#F7B32B]">
                  {users.filter(u => u.role === 'editor').length}
                </p>
              </div>
              <Mail className="h-8 w-8 text-[#F7B32B]" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#333333]">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#333333] h-4 w-4" />
            <Input
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-[#E5E7EB] focus:border-[#1A535C]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#1A535C]">Utilisateurs ({filteredUsers.length})</CardTitle>
          <CardDescription className="text-[#333333]">
            Liste des utilisateurs avec leurs rôles et statuts
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F4E1D2]">
                <tr>
                  <th className="text-left p-4 text-[#333333] font-medium">Utilisateur</th>
                  <th className="text-left p-4 text-[#333333] font-medium">Rôle</th>
                  <th className="text-left p-4 text-[#333333] font-medium">Statut</th>
                  <th className="text-left p-4 text-[#333333] font-medium">Dernière connexion</th>
                  <th className="text-left p-4 text-[#333333] font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-[#1A535C]">{user.name}</div>
                        <div className="text-sm text-[#333333]">{user.email}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusBadgeColor(user.status)}>
                        {user.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-[#333333]">
                        <Calendar className="h-4 w-4 mr-1" />
                        {user.lastLogin}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleUserStatus(user.id)}
                          className="border-[#E5E7EB] hover:bg-[#F4E1D2]"
                        >
                          {user.status === 'active' ? 'Désactiver' : 'Activer'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                          className="border-[#E5E7EB] hover:bg-[#F4E1D2]"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-[#1A535C]">Détails de l'utilisateur</DialogTitle>
              <DialogDescription className="text-[#333333]">
                Informations et paramètres pour {selectedUser.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#333333]">Nom</label>
                  <p className="text-[#1A535C] font-medium">{selectedUser.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#333333]">Email</label>
                  <p className="text-[#1A535C]">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#333333]">Date d'inscription</label>
                  <p className="text-[#333333]">{selectedUser.joinDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#333333]">Dernière connexion</label>
                  <p className="text-[#333333]">{selectedUser.lastLogin}</p>
                </div>
              </div>
              
              <div className="flex justify-between">
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateUserRole(selectedUser.id, 'admin')}
                    className={selectedUser.role === 'admin' ? 'bg-[#FF6F61] text-white' : ''}
                  >
                    Admin
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateUserRole(selectedUser.id, 'editor')}
                    className={selectedUser.role === 'editor' ? 'bg-[#F7B32B] text-[#333333]' : ''}
                  >
                    Editor
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateUserRole(selectedUser.id, 'viewer')}
                    className={selectedUser.role === 'viewer' ? 'bg-[#E5E7EB] text-[#333333]' : ''}
                  >
                    Viewer
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserManager;
