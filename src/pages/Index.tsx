
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, FileText, BarChart3, MessageSquare, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4E1D2] to-white">
      {/* Header */}
      <div className="bg-[#1A535C] text-white p-8 shadow-lg">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">AFAK Admin Portal</h1>
          <p className="text-xl text-teal-100 mb-6">
            Interface d'administration pour la gestion du contenu web
          </p>
          <Link to="/admin">
            <Button className="bg-[#F7B32B] hover:bg-[#F7B32B]/90 text-[#333333] px-8 py-3 text-lg">
              <Shield className="h-5 w-5 mr-2" />
              Accéder au Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white shadow-sm hover:shadow-lg transition-shadow border-l-4 border-l-[#1A535C]">
            <CardHeader>
              <CardTitle className="text-[#1A535C] flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics
              </CardTitle>
              <CardDescription className="text-[#333333]">
                Suivez les statistiques de votre site web avec des graphiques détaillés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-[#333333] space-y-2">
                <li>• Graphiques de visiteurs mensuels</li>
                <li>• Analyse des sources de trafic</li>
                <li>• Métriques de performance</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-lg transition-shadow border-l-4 border-l-[#F7B32B]">
            <CardHeader>
              <CardTitle className="text-[#1A535C] flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Gestion de Contenu
              </CardTitle>
              <CardDescription className="text-[#333333]">
                Créez et gérez vos articles, projets et ressources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-[#333333] space-y-2">
                <li>• Ajout/modification d'articles</li>
                <li>• Gestion des projets</li>
                <li>• Téléversement de fichiers PDF</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-lg transition-shadow border-l-4 border-l-[#FF6F61]">
            <CardHeader>
              <CardTitle className="text-[#1A535C] flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gestion Utilisateurs
              </CardTitle>
              <CardDescription className="text-[#333333]">
                Administrez les comptes utilisateurs et leurs permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-[#333333] space-y-2">
                <li>• Gestion des rôles</li>
                <li>• Activation/désactivation</li>
                <li>• Suivi des connexions</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="text-[#1A535C] flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Messages
              </CardTitle>
              <CardDescription className="text-[#333333]">
                Gérez les messages et demandes de contact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-[#333333] space-y-2">
                <li>• Réception des messages</li>
                <li>• Système de priorités</li>
                <li>• Suivi des réponses</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="text-[#1A535C] flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Paramètres
              </CardTitle>
              <CardDescription className="text-[#333333]">
                Configurez les paramètres généraux du site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-[#333333] space-y-2">
                <li>• Configuration générale</li>
                <li>• Paramètres d'affichage</li>
                <li>• Options SEO</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="text-[#1A535C] flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sécurité
              </CardTitle>
              <CardDescription className="text-[#333333]">
                Sécurisez votre compte avec des options avancées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-[#333333] space-y-2">
                <li>• Authentification 2FA</li>
                <li>• Gestion des mots de passe</li>
                <li>• Journal d'activité</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-[#1A535C] to-[#1A535C]/90 text-white text-center">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
            <p className="text-xl mb-6 text-teal-100">
              Accédez au tableau de bord administrateur pour gérer votre site AFAK
            </p>
            <Link to="/admin">
              <Button className="bg-[#F7B32B] hover:bg-[#F7B32B]/90 text-[#333333] px-8 py-3 text-lg">
                Ouvrir le Dashboard Admin
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
