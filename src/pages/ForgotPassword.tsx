import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { API_BASE_URL } from '../lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/public/request-reset`, { email });
      toast.success('Le code a été envoyé à votre adresse e-mail.');
      navigate(`/verify-code?email=${email}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de l’envoi du code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F4E1D2] to-white">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-[#1A535C]">Mot de passe oublié</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">Adresse e-mail</label>
          <Input
            type="email"
            placeholder="Entrez votre adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button
            type="submit"
            className="w-full mt-4 bg-[#1A535C] text-white"
            disabled={loading}
          >
            {loading ? 'Envoi...' : 'Envoyer le code'}
          </Button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ForgotPassword;
