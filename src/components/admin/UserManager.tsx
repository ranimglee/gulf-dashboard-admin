import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, Search, UserPlus, Calendar, MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getUserNonAdmin ,banUser } from '@/lib/api'; // adapte le chemin selon ton projet
interface User {
  id: string;
  name: string;
  email: string;
  status: 'ACTIVE' | 'BANNED' | 'INACTIVE' | 'PENDING';
  joinDate: string;
  country: string;
  phoneNumber: string;
  lastLogin: string; // Keep this, even if 'N/A' for now
}

const UserManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    getUserNonAdmin()
      .then((response) => {
        const data = response.data;
        const mappedUsers: User[] = data.map((u: any) => ({
          id: u.id,
          name: `${u.firstname} ${u.lastname}`,
          email: u.email,
          status: u.status, // Ne pas convertir, juste utiliser l'enum tel quel
          lastLogin: 'N/A',
          joinDate: new Date(u.createdAt).toLocaleDateString('fr-FR'),
          country: u.country,
          phoneNumber: u.phoneNumber,
        }));
        setUsers(mappedUsers);
      })
      .catch(() => {
        toast({
          title: 'Erreur de chargement',
          description: "Impossible de récupérer la liste des utilisateurs.",
          variant: 'destructive',
        });
      });
  }, [toast]);


const handleBanUser = async (userId: string) => {
  try {
    await banUser(userId);
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: 'BANNED' } : u
      )
    );
    toast({
      title: "Utilisateur banni",
      description: "L'utilisateur a été banni avec succès.",
    });
  } catch (error) {
    toast({
      title: "Erreur",
      description: "Échec du bannissement de l'utilisateur.",
      variant: "destructive",
    });
  }
};


  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

 const getStatusBadgeColor = (status: User['status']) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800';
    case 'BANNED':
      return 'bg-red-100 text-red-800';
    case 'INACTIVE':
      return 'bg-yellow-100 text-yellow-800';
    case 'PENDING':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1A535C]">Gestion des Utilisateurs</h2>
          <p className="text-[#333333]">Gérer les comptes utilisateurs et leurs permissions</p>
        </div>
      
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white shadow-sm border-l-4 border-l-[#1A535C]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#333333]">Nombre total des utilisateurs</p>
                <p className="text-2xl font-bold text-[#1A535C]">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-[#1A535C]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#333333]">Les utilisateurs actifs</p>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.status === 'ACTIVE').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
          <Card className="bg-white shadow-sm border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#333333]">Les utilisateurs bannis</p>
                <p className="text-2xl font-bold text-red-600">
                  {users.filter(u => u.status === 'BANNED').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <div className="h-3 w-3 bg-red-500 rounded-full"></div>
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
            Liste des utilisateurs avec leurs statuts
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F4E1D2]">
                <tr>
                  <th className="text-left p-4 text-[#333333] font-medium">Utilisateur</th>
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
                     <Badge className={getStatusBadgeColor(user.status)}>
                                {{
                                 ACTIVE: 'Actif',
                                 BANNED: 'Banni',
                               INACTIVE: 'Inactif',
                                PENDING: 'En attente',
                                     }[user.status]}
                                </Badge>

                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-[#333333]">
                        <Calendar className="h-4 w-4 mr-1" />
                        {user.joinDate}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
    <Button
      variant="destructive"
      size="sm"
      onClick={() => handleBanUser(user.id)}
      className="border-[#E5E7EB] hover:bg-[#FFEEEE]"
    >
      Bannir
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
                  <label className="text-sm font-medium text-[#333333]">Pays</label>
                  <p className="text-[#1A535C]">{selectedUser.country}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#333333]">Numéro de téléphone</label>
                  <p className="text-[#333333]">{selectedUser.phoneNumber}</p>
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
