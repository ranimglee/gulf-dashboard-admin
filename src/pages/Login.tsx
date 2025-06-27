
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation de connexion - à remplacer par une vraie authentification
    if (email && password) {
      localStorage.setItem('adminAuth', 'true');
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4E1D2] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1A535C] rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#1A535C] mb-2">AFAK Admin</h1>
          <p className="text-[#333333]">Connectez-vous à votre espace administrateur</p>
        </div>

        {/* Login Form */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[#1A535C]">Connexion</CardTitle>
            <CardDescription className="text-[#333333]">
              Entrez vos identifiants pour accéder au dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#333333]">
                  Adresse email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@afak.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-[#E5E7EB] focus:border-[#1A535C]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#333333]">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-[#E5E7EB] focus:border-[#1A535C] pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#333333] hover:text-[#1A535C]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#1A535C] hover:bg-[#1A535C]/90 text-white py-2.5"
              >
                Se connecter
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#333333]">
                Pas encore de compte ?{' '}
                <Link 
                  to="/register" 
                  className="text-[#FF6F61] hover:underline font-medium"
                >
                  Créer un compte
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-[#333333]">
          <p>© 2024 AFAK. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
