import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { API_BASE_URL } from '../lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

import {
  ArrowLeft,
  Mail,
  ShieldCheck,
} from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/public/request-reset`, {
        email,
      });

      toast.success(
        'Le code a été envoyé à votre adresse e-mail.'
      );

      navigate(`/verify-code?email=${email}`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          'Erreur lors de l’envoi du code.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8f9fb] overflow-hidden">
      
      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#1A535C] via-[#184850] to-[#102f35] text-white p-16 flex-col justify-between overflow-hidden">

        {/* Blur Background */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F4E1D2]/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          
          {/* LOGO */}
          <div className="mb-10">
            <img
              src="/images/logo.png"
              alt="AFAQ"
              className="h-20 object-contain"
            />
          </div>

          <div className="max-w-lg">
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Réinitialisation sécurisée
            </h1>

            <p className="text-lg text-white/80 leading-relaxed">
              Accédez à votre espace administrateur en toute
              sécurité grâce au système de récupération de mot
              de passe AFAQ.
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
                  Protection avancée
                </p>

                <h3 className="text-xl font-semibold">
                  Sécurité AFAQ
                </h3>
              </div>
            </div>

            <p className="text-white/70 text-sm leading-relaxed">
              Un code de vérification sera envoyé à votre adresse
              e-mail afin de confirmer votre identité.
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

        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 text-[#1A535C] hover:text-[#143f46] transition"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Retour</span>
        </button>

        {/* CARD */}
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[32px] shadow-2xl border-0 p-8 md:p-10">
          
          <div className="mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#1A535C]/10 flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-[#1A535C]" />
            </div>

            <h2 className="text-4xl font-bold text-[#1A535C] mb-3">
              Mot de passe oublié
            </h2>

            <p className="text-gray-500 leading-relaxed">
              Entrez votre adresse e-mail afin de recevoir un
              code de vérification pour réinitialiser votre mot
              de passe.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-2">
              <label className="text-[#1A535C] font-medium">
                Adresse e-mail
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

                <Input
                  type="email"
                  placeholder="admin@afaq.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 pl-12 rounded-xl border-gray-200 focus-visible:ring-[#1A535C] focus-visible:ring-2"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#1A535C] hover:bg-[#143f46] text-white font-semibold text-base shadow-lg transition-all duration-300 hover:scale-[1.01]"
            >
              {loading
                ? 'Envoi en cours...'
                : 'Envoyer le code'}
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

export default ForgotPassword;