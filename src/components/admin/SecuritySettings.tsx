
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Shield, Key, Lock, AlertTriangle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SecuritySettings = () => {
  const { toast } = useToast();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(30);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Mot de passe mis à jour",
      description: "Votre mot de passe a été modifié avec succès.",
    });
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleTwoFactorToggle = (enabled: boolean) => {
    setTwoFactorEnabled(enabled);
    toast({
      title: enabled ? "2FA activé" : "2FA désactivé",
      description: enabled 
        ? "L'authentification à deux facteurs a été activée." 
        : "L'authentification à deux facteurs a été désactivée.",
    });
  };

  const recentActivity = [
    {
      id: '1',
      action: 'Connexion réussie',
      location: 'Kuwait City, KW',
      ip: '192.168.1.100',
      date: '2024-03-15 14:30',
      status: 'success'
    },
    {
      id: '2',
      action: 'Modification du profil',
      location: 'Kuwait City, KW',
      ip: '192.168.1.100',
      date: '2024-03-15 10:15',
      status: 'success'
    },
    {
      id: '3',
      action: 'Tentative de connexion échouée',
      location: 'Unknown, XX',
      ip: '203.0.113.42',
      date: '2024-03-14 22:45',
      status: 'warning'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1A535C]">Paramètres de Sécurité</h2>
        <p className="text-[#333333]">Gérer la sécurité de votre compte administrateur</p>
      </div>

      {/* Security Status */}
      <Card className="bg-white shadow-sm border-l-4 border-l-[#1A535C]">
        <CardHeader>
          <CardTitle className="text-[#1A535C] flex items-center gap-2">
            <Shield className="h-5 w-5" />
            État de la Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Mot de passe fort</p>
                <p className="text-xs text-green-600">Dernière modification: il y a 2 semaines</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">2FA désactivé</p>
                <p className="text-xs text-yellow-600">Activez pour plus de sécurité</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Lock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">Sessions actives</p>
                <p className="text-xs text-blue-600">2 appareils connectés</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#1A535C] flex items-center gap-2">
            <Key className="h-5 w-5" />
            Changer le Mot de Passe
          </CardTitle>
          <CardDescription className="text-[#333333]">
            Mettez à jour votre mot de passe administrateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword" className="text-[#333333]">
                Mot de passe actuel
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  className="border-[#E5E7EB] focus:border-[#1A535C] pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="newPassword" className="text-[#333333]">
                Nouveau mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className="border-[#E5E7EB] focus:border-[#1A535C] pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="confirmPassword" className="text-[#333333]">
                Confirmer le nouveau mot de passe
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                className="border-[#E5E7EB] focus:border-[#1A535C]"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="bg-[#1A535C] hover:bg-[#1A535C]/90 text-white"
            >
              Mettre à jour le mot de passe
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#1A535C]">Paramètres de Sécurité</CardTitle>
          <CardDescription className="text-[#333333]">
            Configurez les options de sécurité avancées
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-lg">
            <div className="space-y-0.5">
              <Label className="text-[#333333] font-medium">
                Authentification à deux facteurs (2FA)
              </Label>
              <p className="text-sm text-[#333333]">
                Ajoutez une couche de sécurité supplémentaire à votre compte
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={handleTwoFactorToggle}
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-lg">
            <div className="space-y-0.5">
              <Label className="text-[#333333] font-medium">
                Notifications de connexion
              </Label>
              <p className="text-sm text-[#333333]">
                Recevez un email lors de chaque connexion
              </p>
            </div>
            <Switch
              checked={loginNotifications}
              onCheckedChange={setLoginNotifications}
            />
          </div>

          <div className="p-4 border border-[#E5E7EB] rounded-lg">
            <Label className="text-[#333333] font-medium">
              Délai d'expiration de session
            </Label>
            <p className="text-sm text-[#333333] mb-3">
              Déconnexion automatique après inactivité
            </p>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(Number(e.target.value))}
                className="w-20 border-[#E5E7EB] focus:border-[#1A535C]"
                min="5"
                max="120"
              />
              <span className="text-[#333333]">minutes</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#1A535C]">Activité Récente</CardTitle>
          <CardDescription className="text-[#333333]">
            Historique des dernières actions sur votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {activity.status === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-[#333333]">{activity.action}</p>
                    <p className="text-sm text-[#333333]">
                      {activity.location} • {activity.ip}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={
                    activity.status === 'success' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }>
                    {activity.status === 'success' ? 'Succès' : 'Alerte'}
                  </Badge>
                  <p className="text-sm text-[#333333] mt-1">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
