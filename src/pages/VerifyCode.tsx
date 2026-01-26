import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { API_BASE_URL } from '../lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';

const VerifyCode = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get('email') || '';

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/public/verify-reset-code`, { email, code });
      if (res.data.valid) {
        toast.success('Code vérifié avec succès.');
        navigate(`/reset-password?email=${email}&code=${code}`);
      } else {
        toast.error('Code invalide.');
      }
    } catch (error) {
      toast.error('Erreur lors de la vérification du code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F4E1D2] to-white">
        <button
                type="button"
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 p-2 text-[#1A535C] hover:text-[#3a7c86]"
              >
                <ArrowLeft size={20} /> {/* or just use "←" if no icon library */}
              </button>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-[#1A535C]">Vérifiez votre code</h2>
        <form onSubmit={handleVerify}>
          <label className="block mb-2 font-medium">Code reçu par e-mail</label>
          <Input
            type="text"
            placeholder="Entrez le code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <Button
            type="submit"
            className="w-full mt-4 bg-[#1A535C] text-white"
            disabled={loading}
          >
            {loading ? 'Vérification...' : 'Vérifier'}
          </Button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default VerifyCode;
