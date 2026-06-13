import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import { API_BASE_URL } from '../lib/api';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  ArrowLeft,
  ShieldCheck,
  LockKeyhole,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';

import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const email =
    new URLSearchParams(location.search).get('email') || '';

  const code =
    new URLSearchParams(location.search).get('code') || '';

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${API_BASE_URL}/public/reset-password`,
        {
          email,
          code,
          newPassword,
        }
      );

      toast.success(
        'Mot de passe réinitialisé avec succès.'
      );

      navigate('/login');
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          'Erreur lors de la réinitialisation.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8f9fb] overflow-hidden">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#1A535C] via-[#184850] to-[#102f35] text-white p-16 flex-col justify-between overflow-hidden">

        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F4E1D2]/10 rounded-full blur-3xl" />

        <div className="relative z-10">

          {/* LOGO */}
          <div className="mb-10">
            <img
              src="/images/logo.png"
              alt="AFAQ"
              className="h-16 object-contain"
            />
          </div>

          <div className="max-w-lg">
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Nouveau mot de passe
            </h1>

            <p className="text-lg text-white/80 leading-relaxed">
              Créez un nouveau mot de passe sécurisé afin de
              retrouver l’accès à votre espace administrateur
              AFAQ.
            </p>
          </div>
        </div>

        {/* Bottom Glass Card */}
        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 max-w-md">

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>

              <div>
                <p className="text-sm text-white/60">
                  Sécurité renforcée
                </p>

                <h3 className="text-xl font-semibold">
                  Protection du compte
                </h3>
              </div>
            </div>

            <p className="text-white/70 text-sm leading-relaxed">
              Utilisez un mot de passe fort afin de garantir
              la sécurité de votre compte administrateur.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10 relative">

        {/* MOBILE LOGO */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 lg:hidden">
          <img
            src="/images/logo-back.png"
            alt="AFAQ"
            className="h-14 object-contain"
          />
        </div>

        {/* BACK BUTTON */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 text-[#1A535C] hover:text-[#143f46] transition"
        >
          <ArrowLeft size={18} />

          <span className="text-sm font-medium">
            Retour
          </span>
        </button>

        {/* CARD */}
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[32px] shadow-2xl border-0 p-8 md:p-10">

          <div className="mb-8">

            <div className="w-16 h-16 rounded-2xl bg-[#1A535C]/10 flex items-center justify-center mb-6">
              <LockKeyhole className="w-8 h-8 text-[#1A535C]" />
            </div>

            <h2 className="text-4xl font-bold text-[#1A535C] mb-3">
              Réinitialisation
            </h2>

            <p className="text-gray-500 leading-relaxed">
              Définissez un nouveau mot de passe sécurisé afin
              de finaliser la récupération de votre compte.
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleReset}
            className="space-y-5"
          >

            <div className="space-y-2">
              <label className="text-[#1A535C] font-medium">
                Nouveau mot de passe
              </label>

              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

                <Input
                  type={
                    showPassword ? 'text' : 'password'
                  }
                  placeholder="Entrez un nouveau mot de passe"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  required
                  className="h-12 pl-12 pr-12 rounded-xl border-gray-200 focus-visible:ring-[#1A535C] focus-visible:ring-2"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
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

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#1A535C] hover:bg-[#143f46] text-white font-semibold text-base shadow-lg transition-all duration-300 hover:scale-[1.01]"
            >
              {loading
                ? 'Réinitialisation...'
                : 'Confirmer le nouveau mot de passe'}
            </Button>
          </form>

          {/* FOOTER */}
          <div className="mt-8 text-center text-sm text-gray-400">
            © 2026 AFAQ. Tous droits réservés.
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    </div>
  );
};

export default ResetPassword;