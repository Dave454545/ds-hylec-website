"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [token, setToken]     = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [message, setMessage]   = useState({ type: '', text: '' });

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setMessage({ type: 'error', text: 'Lien invalide. Veuillez demander un nouveau lien de réinitialisation.' });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      return setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas.' });
    }
    if (password.length < 6) {
      return setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères.' });
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Mot de passe mis à jour ! Redirection vers la connexion...' });
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Une erreur est survenue.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-[32px] shadow-xl p-10 border border-gray-100">
      <h1 className="text-2xl font-black text-[#E30613] mb-2 text-center">Nouveau mot de passe</h1>
      <p className="text-gray-500 text-sm text-center mb-8">Sécurisez votre compte client DS HY'LEC.</p>

      {!token && message.type === 'error' ? (
        <div className="text-center space-y-4">
          <div className="bg-red-50 border border-red-100 text-[#E30613] p-4 rounded-2xl text-sm font-bold">
            {message.text}
          </div>
          <Link href="/forgot-password" className="inline-block text-sm font-bold text-[#43A047] hover:underline">
            Demander un nouveau lien →
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Nouveau mot de passe</label>
            <input
              type="password"
              placeholder="Minimum 6 caractères"
              className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#E30613] outline-none font-medium transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Confirmation</label>
            <input
              type="password"
              placeholder="Répétez le mot de passe"
              className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#E30613] outline-none font-medium transition-colors"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          {message.text && (
            <div className={`text-xs font-bold text-center p-3 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full bg-[#43A047] text-white py-4 rounded-2xl font-black shadow-lg shadow-[#43A047]/20 hover:bg-[#388E3C] transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Mise à jour...' : 'Enregistrer mon mot de passe'}
          </button>

          <div className="text-center pt-2">
            <Link href="/forgot-password" className="text-xs font-bold text-gray-400 hover:text-[#E30613] transition-colors">
              Demander un nouveau lien
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 selection:bg-[#43A047] selection:text-white">
      <Suspense fallback={<p className="font-bold text-[#E30613]">Chargement...</p>}>
        <ResetPasswordContent />
      </Suspense>
    </main>
  );
}
