import Link from 'next/link';
import Image from 'next/image';

export default function APropos() {
  const avantages = [
    { icon: "🏠", title: "Intervention à domicile", desc: "Nous venons chez vous ou sur votre lieu de travail, sans contrainte de déplacement." },
    { icon: "⏱️", title: "Gain de temps", desc: "Plus besoin de déposer votre véhicule en garage. Nous intervenons quand ça vous arrange." },
    { icon: "⚡", title: "Expertise hybride", desc: "Spécialistes des systèmes hybrides haute tension, de la batterie à l'onduleur." },
    { icon: "🔍", title: "Diagnostic précis", desc: "Valise professionnelle, lecture des défauts, analyse des capteurs et rapport clair." },
    { icon: "📱", title: "Service moderne et accessible", desc: "Réservation en ligne, suivi par email, transparence totale sur les prix." },
  ];

  const expertises = [
    "Diagnostic électronique complet",
    "Systèmes hybrides haute tension",
    "Systèmes antipollution (FAP, EGR, AdBlue)",
    "Optimisation des performances moteur",
  ];

  return (
    <main className="relative min-h-screen font-sans selection:bg-[#43A047] selection:text-white overflow-x-hidden">

      {/* FOND VIDÉO */}
      <video
        autoPlay
        loop
        muted
        playsInline
       
        className="fixed inset-0 w-full h-full object-cover -z-50"
      >
        <source src="/dshylec2.mp4" type="video/mp4" />
      </video>
      <div className="fixed inset-0 bg-white/10 -z-40" />
      <div className="fixed inset-x-0 bottom-0 h-64 bg-gradient-to-t from-white/90 to-transparent -z-35" />
      <div className="fixed -top-32 -left-32 w-[600px] h-[600px] bg-[#E30613]/20 rounded-full blur-[120px] -z-30 animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="fixed bottom-0 -right-32 w-[800px] h-[800px] bg-[#43A047]/15 rounded-full blur-[150px] -z-30 animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />

      {/* NAVIGATION */}
      <nav className="fixed w-full bg-white/60 backdrop-blur-xl z-50 border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)] nav-safe-top">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="relative h-32 w-70 hover:scale-105 transition-transform duration-300">
            <Image src="/ds_hylec_logo.png" alt="DS HY'LEC Logo" fill className="object-contain object-left" priority />
          </Link>
          <div className="hidden md:flex gap-8 text-sm font-bold text-gray-900">
            <Link href="/#services" className="hover:text-[#43A047] transition-colors duration-300">Nos Services</Link>
            <Link href="/a-propos" className="text-[#E30613] transition-colors duration-300">À propos</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-[#E30613] hover:text-[#43A047] transition-colors duration-300">
              Connexion
            </Link>
            <Link href="/reserver" className="bg-[#E30613] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-[0_8px_20px_rgba(227,6,19,0.3)] hover:bg-[#B3050F] hover:-translate-y-0.5 transition-all duration-300">
              Prendre RDV
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-24 relative z-20">
        <div className="max-w-4xl mx-auto px-6 space-y-12">

          {/* QUI SOMMES-NOUS */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 fill-mode-both bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-8 sm:p-10 border border-white/80">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">
              Qui sommes-nous ?
            </h2>
            <p className="text-gray-700 leading-relaxed font-medium text-base sm:text-lg">
              <span className="text-[#E30613] font-black">DS HY'LEC</span> est une entreprise spécialisée dans le diagnostic automobile et l'entretien des véhicules hybrides, avec une intervention directe à domicile ou sur votre lieu de travail. Notre objectif est simple : vous offrir un service <strong>rapide, fiable et professionnel</strong>, sans contrainte de déplacement.
            </p>
          </div>

          {/* NOTRE EXPERTISE */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-8 sm:p-10 border border-white/80">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6">
              Notre expertise
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {expertises.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-gradient-to-r from-[#E30613]/5 to-transparent rounded-2xl border border-[#E30613]/10">
                  <span className="text-[#E30613] font-black text-lg mt-0.5">✦</span>
                  <span className="font-bold text-gray-800 text-sm sm:text-base">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* POURQUOI DS HY'LEC */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 text-center drop-shadow-sm">
              Pourquoi <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E30613] to-[#B3050F]">DS HY'LEC</span> ?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {avantages.map((item, i) => (
                <div
                  key={i}
                  className="animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 p-6 border border-white/80"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <span className="text-3xl block mb-3">{item.icon}</span>
                  <h3 className="font-black text-gray-900 mb-2 text-base">{item.title}</h3>
                  <p className="text-gray-600 text-sm font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* NOTRE MISSION */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400 fill-mode-both bg-gradient-to-br from-[#43A047] to-[#2E7D32] rounded-3xl shadow-[0_10px_30px_rgba(67,160,71,0.3)] p-8 sm:p-10 text-white">
            <h2 className="text-2xl sm:text-3xl font-black mb-4">Notre mission</h2>
            <p className="leading-relaxed font-medium text-white/90 text-base sm:text-lg">
              Permettre à chaque conducteur de maintenir son véhicule en parfait état, tout en réduisant les pannes et les coûts inutiles. Nous accompagnons aussi bien les <strong className="text-white">particuliers</strong> que les <strong className="text-white">professionnels</strong>, notamment les chauffeurs VTC et les flottes automobiles.
            </p>
          </div>

          {/* NOTRE ENGAGEMENT */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-8 sm:p-10 border border-white/80 text-center">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">Notre engagement</h2>
            <p className="text-gray-700 leading-relaxed font-medium text-base sm:text-lg max-w-2xl mx-auto">
              Un service de qualité, une transparence totale, des conseils adaptés.{' '}
              <span className="text-[#E30613] font-black">Votre satisfaction est notre priorité.</span>
            </p>
            <div className="mt-8">
              <Link
                href="/reserver"
                className="inline-block bg-[#E30613] text-white px-10 py-4 rounded-full font-bold text-base shadow-[0_10px_25px_rgba(227,6,19,0.35)] hover:bg-[#B3050F] hover:-translate-y-0.5 hover:shadow-[0_15px_35px_rgba(227,6,19,0.45)] transition-all duration-300"
              >
                Prendre rendez-vous
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#1A1A1A] py-16 text-center relative overflow-hidden z-20">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E30613] to-transparent opacity-70" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <p className="text-white/60 text-sm font-medium">
            © {new Date().getFullYear()} DS HY'LEC. Expert hybrid, diagnostic électronique et performance moteur.<br className="mb-2"/>
            Créé par <span className="text-[#43A047] font-bold">Kreativ Academy</span>.
          </p>
        </div>
      </footer>
    </main>
  );
}
