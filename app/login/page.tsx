"use client";
import { signIn, getSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Identifiants incorrects. Vérifiez votre email et mot de passe.");
      setLoading(false);
    } else {
      // On récupère la session pour connaître le rôle
      const session = await getSession();
      
      if ((session?.user as any)?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard-client");
      }
      router.refresh();
    }
  };

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen font-sans selection:bg-[#E30613] selection:text-white overflow-hidden p-4">

      {/* BOUTON FERMER (Top Right) */}
      <Link
        href="/"
        className="absolute top-6 right-6 z-50 flex items-center justify-center w-11 h-11 bg-white/70 backdrop-blur-md rounded-full font-bold text-xl text-gray-800 hover:bg-white hover:scale-110 hover:shadow-lg transition-all duration-300 border border-white/50"
        aria-label="Retour à l'accueil"
      >
        ×
      </Link>

      {/* VIDÉO FIXE EN ARRIÈRE-PLAN */}
      <video
        autoPlay
        loop
        muted
        playsInline

        className="fixed inset-0 w-full h-full object-cover -z-50 scale-105"
      >
        <source src="/dshylec1.mp4" type="video/mp4" />
        Votre navigateur ne supporte pas la vidéo.
      </video>

      {/* OVERLAY : Verre dépoli sombre pour un effet cinématique qui fait ressortir le formulaire blanc */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[6px] -z-40" />

      {/* HALOS LUMINEUX DYNAMIQUES */}
      <div className="fixed top-1/4 -left-20 w-96 h-96 bg-[#E30613]/30 rounded-full blur-[120px] -z-30 animate-pulse" />
      <div className="fixed bottom-1/4 -right-20 w-96 h-96 bg-[#43A047]/30 rounded-full blur-[120px] -z-30 animate-pulse" style={{ animationDelay: '2s' }} />

      {/* FORMULAIRE FLOTTANT (Glassmorphism) */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-12 duration-1000">

        <div className="bg-white/85 backdrop-blur-xl rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] p-10 border border-white/60">
          {/* LOGO INTÉGRÉ EN HAUT DU FORMULAIRE */}
          <div className="flex justify-center mb-6">
            <div className="relative h-16 w-40">
              <Image
                src="/ds_hylec_logo.png"
                alt="DS HY'LEC Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-2">Connexion</h1>
            <p className="text-[#E30613] font-bold text-sm bg-[#E30613]/10 inline-block px-3 py-1 rounded-lg">Accédez à votre espace DS HY'LEC</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">Mot de passe</label>
              <input 
                type="password" 
                className="w-full p-4 bg-white/60 backdrop-blur-sm border-2 border-white/80 rounded-2xl outline-none focus:border-[#E30613] focus:bg-white shadow-inner transition-all font-bold text-gray-800 placeholder-gray-400"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {error && (
              <div className="bg-red-50/90 backdrop-blur-sm border border-red-100 text-[#E30613] p-4 rounded-2xl text-xs font-bold text-center animate-in shake">
                ⚠️ {error}
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#E30613] to-[#B3050F] text-white py-4 rounded-2xl font-black text-lg shadow-[0_10px_25px_rgba(227,6,19,0.3)] hover:shadow-[0_15px_35px_rgba(227,6,19,0.4)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/60 text-xs font-medium mt-8 drop-shadow-md">
          Espace sécurisé • DS HY'LEC
        </p>
      </div>
    </main>
  );
}
