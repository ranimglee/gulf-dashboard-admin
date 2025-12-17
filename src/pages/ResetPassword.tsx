import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { API_BASE_URL } from '../lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get('email') || '';
  const code = new URLSearchParams(location.search).get('code') || '';

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/public/reset-password`, { email, code, newPassword });
      toast.success('Mot de passe réinitialisé avec succès.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la réinitialisation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F4E1D2] to-white">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-[#1A535C]">Réinitialisez votre mot de passe</h2>
        <form onSubmit={handleReset}>
          <label className="block mb-2 font-medium">Nouveau mot de passe</label>
          <Input
            type="password"
            placeholder="Entrez un nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            className="w-full mt-4 bg-[#1A535C] text-white"
            disabled={loading}
          >
            {loading ? 'Réinitialisation...' : 'Confirmer'}
          </Button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ResetPassword;
