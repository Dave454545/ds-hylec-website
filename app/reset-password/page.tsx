"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// On utilise un sous-composant pour utiliser useSearchParams proprement dans Next.js
function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      return setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas.' });
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Mot de passe créé ! Redirection vers la connexion...' });
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Une erreur est survenue.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    // AJOUT DES BORDS ARRONDIS COMME SUR LA PAGE LOGIN
    <div className="w-full max-w-md bg-white rounded-[32px] shadow-xl p-10 border border-gray-100">
      {/* ROUGE AU LIEU DE BLEU */}
      <h1 className="text-2xl font-black text-[#E30613] mb-2 text-center">Nouveau mot de passe</h1>
      {/* NOUVEAU NOM DS HY'LEC */}
      <p className="text-gray-500 text-sm text-center mb-8">Sécurisez votre compte client DS HY'LEC.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Email</label>
          <input 
            type="email" 
            /* FOCUS ROUGE AU LIEU DE BLEU ET TRANSITION */
            className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#E30613] outline-none font-medium transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            readOnly={!!searchParams.get('email')}
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Mot de passe</label>
          <input 
            type="password" 
            placeholder="Minimum 6 caractères"
            /* FOCUS ROUGE AU LIEU DE BLEU ET TRANSITION */
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
            /* FOCUS ROUGE AU LIEU DE BLEU ET TRANSITION */
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
          disabled={loading}
          /* NOUVEAU VERT ET OMBRE VERT FONCÉ */
          className="w-full bg-[#43A047] text-white py-4 rounded-2xl font-black shadow-lg shadow-[#43A047]/20 hover:bg-[#388E3C] transition-all disabled:opacity-50 mt-2"
        >
          {loading ? "Mise à jour..." : "Enregistrer mon mot de passe"}
        </button>
      </form>
    </div>
  );
}

// Composant principal avec Suspense (obligatoire pour useSearchParams dans Next.js 13+)
export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 selection:bg-[#43A047] selection:text-white">
      <Suspense fallback={<p className="font-bold text-[#E30613]">Chargement...</p>}>
        <ResetPasswordContent />
      </Suspense>
    </main>
  );
}