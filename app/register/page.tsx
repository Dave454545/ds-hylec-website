"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'; // NOUVEAU : On importe Image pour le logo

export default function Register() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }
    setIsLoading(true);
    
    // Simulation de création de compte
    setTimeout(() => {
      router.push('/dashboard-client');
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 font-sans selection:bg-[#43A047] selection:text-white">
      
      {/* Bouton retour */}
      <div className="absolute top-6 left-6">
        {/* ROUGE AU LIEU DE BLEU, HOVER NOUVEAU VERT */}
        <Link href="/" className="text-[#E30613] font-bold text-sm hover:text-[#43A047] transition flex items-center gap-2">
          <span>←</span> Retour au site
        </Link>
      </div>

      <div className="w-full max-w-md">
        {/* En-tête Inscription */}
        <div className="flex flex-col items-center justify-center mb-8">
          {/* NOUVEAU : Le vrai logo image au lieu du texte */}
          <div className="relative h-16 w-56 mb-4">
            <Image 
              src="/ds_hylec_logo.png" 
              alt="DS HY'LEC Logo" 
              fill 
              className="object-contain" 
              priority
            />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Rejoignez l'aventure</h1>
          <p className="text-gray-500 text-sm">Créez votre compte client en 30 secondes.</p>
        </div>

        {/* Carte Formulaire */}
        <div className="bg-white rounded-[32px] shadow-xl shadow-red-900/5 p-8 border border-gray-100">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Nom complet</label>
              <input 
                type="text" 
                required
                placeholder="Jean Dupont"
                /* FOCUS ROUGE AU LIEU DE VERT */
                className="w-full border-2 border-gray-100 rounded-xl p-3.5 bg-gray-50 outline-none focus:border-[#E30613] font-medium transition-colors"
                onChange={(e) => setFormData({...formData, nom: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Adresse Email</label>
              <input 
                type="email" 
                required
                placeholder="jean@exemple.fr"
                /* FOCUS ROUGE AU LIEU DE VERT */
                className="w-full border-2 border-gray-100 rounded-xl p-3.5 bg-gray-50 outline-none focus:border-[#E30613] font-medium transition-colors"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Mot de passe</label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                /* FOCUS ROUGE AU LIEU DE VERT */
                className="w-full border-2 border-gray-100 rounded-xl p-3.5 bg-gray-50 outline-none focus:border-[#E30613] font-medium transition-colors"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Confirmer le mot de passe</label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                /* FOCUS ROUGE AU LIEU DE VERT */
                className="w-full border-2 border-gray-100 rounded-xl p-3.5 bg-gray-50 outline-none focus:border-[#E30613] font-medium transition-colors"
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>

            <div className="pt-2 text-xs text-gray-500">
              {/* ROUGE AU LIEU DE BLEU */}
              En vous inscrivant, vous acceptez nos <span className="text-[#E30613] underline cursor-pointer hover:text-[#43A047] transition-colors">Conditions Générales de Service</span>.
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              /* BOUTON ROUGE ET OMBRE ROUGE */
              className="w-full py-4 mt-2 bg-[#E30613] rounded-xl font-bold text-white shadow-lg shadow-[#E30613]/30 hover:bg-[#B3050F] transition-all flex justify-center items-center h-[56px] disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Création du compte...
                </span>
              ) : (
                "Créer mon compte"
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-50 text-center">
            <p className="text-sm text-gray-500">
              Déjà un compte ?{' '}
              {/* ROUGE AU LIEU DE BLEU, HOVER NOUVEAU VERT */}
              <Link href="/login" className="text-[#E30613] font-bold hover:text-[#43A047] transition">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}