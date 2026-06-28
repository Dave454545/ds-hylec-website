"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const [email, setEmail]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch (_) {
      // Silencieux côté client : on affiche toujours le message de succès
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <main
      className="relative flex flex-col items-center justify-center min-h-screen font-sans selection:bg-[#E30613] selection:text-white overflow-hidden px-4 py-6"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1.5rem)' }}
    >
      <video autoPlay loop muted playsInline preload="none" className="fixed inset-0 w-full h-full object-cover -z-50 scale-105">
        <source src="/dshylec1 compress.mp4" type="video/mp4" />
      </video>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[6px] -z-40" />
      <div className="fixed top-1/4 -left-20 w-96 h-96 bg-[#E30613]/30 rounded-full blur-[120px] -z-30 animate-pulse" />
      <div className="fixed bottom-1/4 -right-20 w-96 h-96 bg-[#43A047]/30 rounded-full blur-[120px] -z-30 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-12 duration-700">
        <div
          className="bg-white/85 backdrop-blur-xl rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-white/60 relative"
          style={{ padding: 'calc(1rem + env(safe-area-inset-top)) 2rem 2rem' }}
        >
          <Link
            href="/login"
            className="absolute top-4 right-4 flex items-center justify-center w-11 h-11 bg-white/70 backdrop-blur-md rounded-full font-bold text-xl text-gray-800 hover:bg-white hover:scale-110 hover:shadow-lg transition-all duration-300 border border-white/50"
            style={{ marginTop: 'env(safe-area-inset-top)' }}
            aria-label="Retour à la connexion"
          >
            ×
          </Link>

          <div className="flex justify-center mb-5 pt-4">
            <div className="relative h-20 w-44">
              <Image src="/logo-ds_hylec_neuf.webp" alt="DS HY'LEC Logo" fill className="object-contain" priority />
            </div>
          </div>

          {submitted ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-[#43A047]/10 flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
                  <polyline points="10,25 20,35 38,14" stroke="#43A047" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h1 className="text-2xl font-black text-gray-900 mb-3">Email envoyé !</h1>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Si un compte existe pour <strong className="text-gray-700">{email}</strong>, vous recevrez un lien de réinitialisation dans quelques minutes.<br /><br />
                Pensez à vérifier vos spams.
              </p>
              <Link href="/login" className="text-sm font-bold text-[#E30613] hover:underline">
                ← Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-3xl font-black text-gray-900 mb-2">Mot de passe oublié ?</h1>
                <p className="text-gray-500 text-sm">Entrez votre email pour recevoir un lien de réinitialisation.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">Email</label>
                  <input
                    type="email"
                    className="w-full p-4 bg-white/60 backdrop-blur-sm border-2 border-white/80 rounded-2xl outline-none focus:border-[#E30613] focus:bg-white shadow-inner transition-all font-bold text-gray-800 placeholder-gray-400"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#E30613] to-[#B3050F] text-white py-4 rounded-2xl font-black text-lg shadow-[0_10px_25px_rgba(227,6,19,0.3)] hover:shadow-[0_15px_35px_rgba(227,6,19,0.4)] hover:-translate-y-1 active:scale-[0.97] transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-3"
                >
                  {loading && (
                    <svg className="animate-spin h-5 w-5 text-white shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  )}
                  {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/login" className="text-xs font-bold text-gray-500 hover:text-[#E30613] transition-colors duration-200">
                  ← Retour à la connexion
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
