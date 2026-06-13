import React, { useState, useEffect } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  Users,
  Search,
  Calendar,
  MoreHorizontal,
  Ban,
  ShieldCheck,
  Globe,
  Phone,
  Mail,
} from 'lucide-react';

import { useToast } from '@/hooks/use-toast';

import {
  getUserNonAdmin,
  banUser,
  deleteUser,

} from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  status: 'ACTIVE' | 'BANNED' | 'INACTIVE' | 'PENDING';
  joinDate: string;
  country: string;
  phoneNumber: string;
  lastLogin: string;
}

const UserManager = () => {
  const { toast } = useToast();
const [deleteDialogOpen, setDeleteDialogOpen] =
  useState(false);

const [isDeleting, setIsDeleting] =
  useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  useEffect(() => {
    getUserNonAdmin()
      .then((response) => {
        const data = response.data;

        const mappedUsers: User[] = data.map(
          (u: any) => ({
            id: u.id,
            name: `${u.firstname} ${u.lastname}`,
            email: u.email,
            status: u.status,
            lastLogin: 'N/A',
            joinDate: new Date(
              u.createdAt
            ).toLocaleDateString('fr-FR'),
            country: u.country,
            phoneNumber: u.phoneNumber,
          })
        );

        setUsers(mappedUsers);
      })
      .catch(() => {
        toast({
          title: 'Erreur de chargement',
          description:
            'Impossible de récupérer la liste des utilisateurs.',
          variant: 'destructive',
        });
      });
  }, [toast]);
const handleDeleteUser = async () => {
  if (!selectedUser) return;

  try {
    setIsDeleting(true);

    await deleteUser(selectedUser.id);

    setUsers((prev) =>
      prev.filter(
        (u) => u.id !== selectedUser.id
      )
    );

    toast({
      title: 'Utilisateur supprimé',
      description:
        "Le compte utilisateur a été supprimé avec succès.",
    });

    setDeleteDialogOpen(false);
    setSelectedUser(null);

  } catch (error) {
    toast({
      title: 'Erreur',
      description:
        "Impossible de supprimer l'utilisateur.",
      variant: 'destructive',
    });
  } finally {
    setIsDeleting(false);
  }
};
  const handleBanUser = async (userId: string) => {
    try {
      await banUser(userId);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, status: 'BANNED' }
            : u
        )
      );

      toast({
        title: 'Utilisateur banni',
        description:
          "L'utilisateur a été banni avec succès.",
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description:
          "Échec du bannissement de l'utilisateur.",
        variant: 'destructive',
      });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeColor = (
    status: User['status']
  ) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-700 border border-green-200';

      case 'BANNED':
        return 'bg-red-100 text-red-700 border border-red-200';

      case 'INACTIVE':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-200';

      case 'PENDING':
        return 'bg-blue-100 text-blue-700 border border-blue-200';

      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        <div>
          <h2 className="text-4xl font-bold text-[#1A535C] mb-2">
            Gestion des utilisateurs
          </h2>

          <p className="text-gray-500 text-base">
            Gérez les utilisateurs, leurs statuts et
            leurs accès à la plateforme.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-[#1A535C]/10 px-4 py-2 rounded-2xl">
          <ShieldCheck className="w-5 h-5 text-[#1A535C]" />

          <span className="text-sm font-medium text-[#1A535C]">
            Dashboard sécurisé
          </span>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* TOTAL USERS */}
        <Card className="border-0 shadow-lg rounded-3xl bg-white overflow-hidden">
          <CardContent className="p-6 relative">

            <div className="absolute top-0 right-0 w-28 h-28 bg-[#1A535C]/5 rounded-full blur-2xl" />

            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Nombre total
                </p>

                <h3 className="text-4xl font-bold text-[#1A535C]">
                  {users.length}
                </h3>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-[#1A535C]/10 flex items-center justify-center">
                <Users className="w-7 h-7 text-[#1A535C]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ACTIVE USERS */}
        <Card className="border-0 shadow-lg rounded-3xl bg-white overflow-hidden">
          <CardContent className="p-6 relative">

            <div className="absolute top-0 right-0 w-28 h-28 bg-green-100 rounded-full blur-2xl" />

            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Utilisateurs actifs
                </p>

                <h3 className="text-4xl font-bold text-green-600">
                  {
                    users.filter(
                      (u) => u.status === 'ACTIVE'
                    ).length
                  }
                </h3>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                <div className="w-4 h-4 bg-green-500 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BANNED USERS */}
        <Card className="border-0 shadow-lg rounded-3xl bg-white overflow-hidden">
          <CardContent className="p-6 relative">

            <div className="absolute top-0 right-0 w-28 h-28 bg-red-100 rounded-full blur-2xl" />

            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Utilisateurs bannis
                </p>

                <h3 className="text-4xl font-bold text-red-600">
                  {
                    users.filter(
                      (u) => u.status === 'BANNED'
                    ).length
                  }
                </h3>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">
                <Ban className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEARCH */}
      <Card className="border-0 shadow-lg rounded-3xl bg-white">
        <CardContent className="p-5">

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />

            <Input
              placeholder="Rechercher un utilisateur par nom ou email..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="h-12 pl-12 rounded-2xl border-gray-200 focus-visible:ring-[#1A535C] focus-visible:ring-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* USERS TABLE */}
      <Card className="border-0 shadow-lg rounded-3xl bg-white overflow-hidden">

        <CardHeader className="pb-2">
          <CardTitle className="text-2xl text-[#1A535C]">
            Utilisateurs ({filteredUsers.length})
          </CardTitle>

          <CardDescription className="text-gray-500">
            Liste des utilisateurs et gestion des statuts.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">

          <div className="overflow-x-auto">
            <table className="w-full">

              <thead className="bg-[#f8fafb] border-y border-gray-100">
                <tr>
                  <th className="text-left p-5 text-gray-600 font-semibold">
                    Utilisateur
                  </th>

                  <th className="text-left p-5 text-gray-600 font-semibold">
                    Statut
                  </th>

                  <th className="text-left p-5 text-gray-600 font-semibold">
                    Date d’inscription
                  </th>

                  <th className="text-left p-5 text-gray-600 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-[#fafcfc] transition"
                  >
                    {/* USER */}
                    <td className="p-5">
                      <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-2xl bg-[#1A535C]/10 flex items-center justify-center text-[#1A535C] font-bold">
                          {user.name.charAt(0)}
                        </div>

                        <div>
                          <div className="font-semibold text-[#1A535C]">
                            {user.name}
                          </div>

                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="p-5">
                      <Badge
                        className={`${getStatusBadgeColor(
                          user.status
                        )} rounded-full px-4 py-1 font-medium`}
                      >
                        {{
                          ACTIVE: 'Actif',
                          BANNED: 'Banni',
                          INACTIVE: 'Inactif',
                          PENDING: 'En attente',
                        }[user.status]}
                      </Badge>
                    </td>

                    {/* DATE */}
                    <td className="p-5">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-[#1A535C]" />

                        {user.joinDate}
                      </div>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-5">
                      <div className="flex items-center gap-2">

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleBanUser(user.id)
                          }
                          className="rounded-xl shadow-sm"
                        >
                          Bannir
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSelectedUser(user)
                          }
                          className="rounded-xl border-gray-200 hover:bg-[#F4E1D2]"
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

      {/* USER DETAILS */}
      {selectedUser && (
        <Dialog
          open={!!selectedUser}
          onOpenChange={() =>
            setSelectedUser(null)
          }
        >
          <DialogContent className="sm:max-w-[550px] rounded-3xl border-0">

            <DialogHeader className="pb-4">
              <DialogTitle className="text-3xl text-[#1A535C]">
                Détails utilisateur
              </DialogTitle>

              <DialogDescription className="text-gray-500">
                Informations du compte et statut
                utilisateur.
              </DialogDescription>
              
            </DialogHeader>

            <div className="space-y-6">

              {/* USER HEADER */}
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#f8fafb]">

                <div className="w-16 h-16 rounded-2xl bg-[#1A535C]/10 flex items-center justify-center text-[#1A535C] text-2xl font-bold">
                  {selectedUser.name.charAt(0)}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#1A535C]">
                    {selectedUser.name}
                  </h3>

                  <p className="text-gray-500">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              {/* INFOS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-2 text-gray-500">
                    <Globe className="w-4 h-4" />
                    Pays
                  </div>

                  <p className="font-semibold text-[#1A535C]">
                    {selectedUser.country}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-2 text-gray-500">
                    <Phone className="w-4 h-4" />
                    Téléphone
                  </div>

                  <p className="font-semibold text-[#1A535C]">
                    {selectedUser.phoneNumber}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-gray-100 md:col-span-2">
                  <div className="flex items-center gap-2 mb-2 text-gray-500">
                    <Mail className="w-4 h-4" />
                    Email
                  </div>

                  <p className="font-semibold text-[#1A535C]">
                    {selectedUser.email}
                  </p>
                </div>
              </div>
            </div>
            {/* ACTIONS */}
<div className="flex justify-end pt-4 border-t border-gray-100">
  <Button
    variant="destructive"
    className="rounded-2xl"
    onClick={() => setDeleteDialogOpen(true)}
  >
    Supprimer le compte
  </Button>
</div>
          </DialogContent>
          <Dialog
  open={deleteDialogOpen}
  onOpenChange={setDeleteDialogOpen}
>
  <DialogContent className="sm:max-w-[420px] rounded-3xl border-0">
    
    <DialogHeader>
      <DialogTitle className="text-2xl text-red-600">
        Supprimer le compte
      </DialogTitle>

      <DialogDescription className="text-gray-500 pt-2">
        Êtes-vous sûr de vouloir supprimer définitivement ce compte utilisateur ?
        Cette action est irréversible.
      </DialogDescription>
    </DialogHeader>

    <div className="flex justify-end gap-3 pt-4">
      
      <Button
        variant="outline"
        onClick={() =>
          setDeleteDialogOpen(false)
        }
        className="rounded-2xl"
      >
        Annuler
      </Button>

      <Button
        variant="destructive"
        onClick={handleDeleteUser}
        disabled={isDeleting}
        className="rounded-2xl"
      >
        {isDeleting
          ? 'Suppression...'
          : 'Supprimer'}
      </Button>
    </div>
  </DialogContent>
</Dialog>
        </Dialog>
        
      )}
    </div>
  );
};

export default UserManager;