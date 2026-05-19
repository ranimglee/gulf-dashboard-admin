
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, EyeOff, User } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    // Simulation d'inscription - à remplacer par une vraie authentification
    if (formData.email && formData.password && formData.firstName && formData.lastName) {
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
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#1A535C] mb-2">AFAQ Admin</h1>
          <p className="text-[#333333]">Créez votre compte administrateur</p>
        </div>

        {/* Register Form */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[#1A535C]">Inscription</CardTitle>
            <CardDescription className="text-[#333333]">
              Remplissez les informations pour créer votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-[#333333]">
                    Prénom
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Ahmed"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="border-[#E5E7EB] focus:border-[#1A535C]"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-[#333333]">
                    Nom
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Al-Farisi"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="border-[#E5E7EB] focus:border-[#1A535C]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#333333]">
                  Adresse email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@afaq.com"
                  value={formData.email}
                  onChange={handleInputChange}
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
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#333333]">
                  Confirmer le mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="border-[#E5E7EB] focus:border-[#1A535C] pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#333333] hover:text-[#1A535C]"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#1A535C] hover:bg-[#1A535C]/90 text-white py-2.5"
              >
                Créer le compte
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#333333]">
                Déjà un compte ?{' '}
                <Link 
                  to="/login" 
                  className="text-[#FF6F61] hover:underline font-medium"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-[#333333]">
          <p>© 2026 AFAQ. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
