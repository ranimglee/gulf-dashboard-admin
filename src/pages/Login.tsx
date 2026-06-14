import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
} from 'lucide-react';

import { loginUser } from '@/services/authService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Turnstile from 'react-turnstile'; // ✅ ADD THIS
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(''); // ✅ ADD
  const [turnstileKey, setTurnstileKey] = useState(0);   // ✅ ADD
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const redirectUrl = query.get('redirect') || '/admin';


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      toast.error('Veuillez valider le captcha');
      return;
    }

    setLoading(true);

    try {
      const { token, refreshToken, role } = await loginUser({
        email,
        password,
        captchaToken, 
      });

      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('role', role);
      localStorage.removeItem('accessToken');
      localStorage.setItem('adminAuth', 'true');

      toast.success('Connexion réussie');

      setCaptchaToken('');
      setTurnstileKey(prev => prev + 1); // reset widget

      navigate(redirectUrl, { replace: true });

    } catch (err: any) {
      console.error('Login error:', err);

      let message =
        err.message || 'Échec de la connexion. Veuillez réessayer.';

      if (message === 'Invalid email or password!') {
        message = 'Email ou mot de passe incorrect.';
      } else if (message === 'Your account is banned.') {
        message = 'Votre compte est banni.';
      } else if (message === 'Too many failed attempts. Try again later.') {
        message = 'Trop de tentatives. Réessayez plus tard.';
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8f9fb] overflow-hidden">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#1A535C] via-[#184850] to-[#102f35] text-white p-16 flex-col justify-between overflow-hidden">
        
        {/* Background Blur Effects */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F4E1D2]/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          {/* LOGO */}
          <div className="mb-10">
            {/* Replace with your real logo */}
            <img
              src="/images/logo.png"
              alt="AFAQ"
              className="h-20 object-contain"
            />
          </div>

          <div className="max-w-lg">
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Tableau de bord administrateur
            </h1>

            <p className="text-lg text-white/80 leading-relaxed">
              Gérez les projets, articles, ressources et activités
              de la plateforme AFAQ depuis un espace moderne,
              sécurisé et intuitif.
            </p>
          </div>
        </div>

        {/* Bottom Card */}
        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 max-w-md">
            <p className="text-sm text-white/70 mb-2">
              Administration sécurisée
            </p>

            <h3 className="text-2xl font-semibold mb-4">
              Accès réservé aux administrateurs
            </h3>

            <p className="text-white/70 text-sm leading-relaxed">
              Veuillez utiliser vos identifiants pour accéder
              au dashboard et gérer le contenu de la plateforme.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10 relative">
        
        {/* Mobile Logo */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 lg:hidden">
          <img
            src="/images/logo-back.png"
            alt="AFAQ"
            className="h-14 object-contain"
          />
        </div>

        <Card className="w-full max-w-md border-0 shadow-2xl rounded-[32px] bg-white/80 backdrop-blur-xl">
          <CardContent className="p-8 md:p-10">
            
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-[#1A535C] mb-3">
                Connexion
              </h2>

              <p className="text-gray-500 leading-relaxed">
                Connectez-vous pour accéder au panneau
                d’administration AFAQ.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* EMAIL */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-[#1A535C] font-medium"
                >
                  Adresse email
                </Label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@afaq.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 pl-12 rounded-xl border-gray-200 focus-visible:ring-[#1A535C] focus-visible:ring-2"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-[#1A535C] font-medium"
                >
                  Mot de passe
                </Label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pl-12 pr-12 rounded-xl border-gray-200 focus-visible:ring-[#1A535C] focus-visible:ring-2"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1A535C] transition"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* FORGOT PASSWORD */}
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-[#1A535C] hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
{/* CAPTCHA */}
<div className="flex justify-center py-4 bg-white border border-gray-200 rounded-xl shadow-sm">
  <Turnstile
    key={turnstileKey}
    sitekey="0x4AAAAAADT08I6I0OwNbFCS"
    theme="light"
    appearance="always"
    onVerify={(token) => setCaptchaToken(token)}
    onExpire={() => setCaptchaToken('')}
    onError={() => setCaptchaToken('')}
  />
</div>
              {/* BUTTON */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-[#1A535C] hover:bg-[#143f46] text-white font-semibold text-base shadow-lg transition-all duration-300 hover:scale-[1.01]"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>

            {/* FOOTER */}
            <div className="mt-8 text-center text-sm text-gray-400">
              © 2026 AFAQ. Tous droits réservés.
            </div>
          </CardContent>
        </Card>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Login;