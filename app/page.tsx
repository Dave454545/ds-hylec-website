import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  // Liste de nos services avec de VRAIES images spécifiques et fiables (Unsplash)
  const servicesList = [
    { 
      id: "DIAGNOSTIC_ELECTRONIQUE", 
      title: "Diagnostic électronique complet", 
      desc: "Analyse complète du véhicule avec valise professionnelle. Lecture des codes défaut, analyse des capteurs et calculateurs. Permet d'identifier rapidement les pannes avec explication.", 
      img: "/diagnostic electric complet.jpeg",
      type: "standard" 
    },
    { 
      id: "DECALAMINAGE_MOTEUR", 
      title: "Décalaminage moteur hydrogène", 
      desc: "Nettoyage interne du moteur par hydrogène. Élimine la calamine accumulée, améliore les performances, réduit la consommation et les émissions. Recommandé en entretien préventif.", 
      img: "/Decalaminage.jpeg",
      type: "standard" 
    },
    { 
      id: "REGENERATION_FAP", 
      title: "Régénération FAP", 
      desc: "Nettoyage du filtre à particules encrassé. Régénération forcée via outil de diagnostic pour brûler les suies. Permet d'éviter un remplacement coûteux du FAP.", 
      img: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=600&q=80", 
      type: "standard" 
    },
    { 
      id: "DIAGNOSTIC_HYBRIDE", 
      title: "Diagnostic système hybride", 
      desc: "Contrôle complet du système hybride. Lecture des défauts haute tension, analyse du fonctionnement électrique et thermique du véhicule.", 
      img: "/diagnostic systeme hybride.jpeg",
      type: "hybride", 
      badge: "EXPERTISE" 
    },
    { 
      id: "TEST_BATTERIE_HYBRIDE", 
      title: "Test batterie hybride", 
      desc: "Analyse de l'état de santé de la batterie (SOH). Vérification des modules, tensions et performances pour anticiper une défaillance.", 
      img: "/test de batterie hybride.jpeg",
      type: "hybride" 
    },
    { 
      id: "NETTOYAGE_REFROIDISSEMENT_HYBRIDE", 
      title: "Nettoyage refroidissement hybride", 
      desc: "Nettoyage du filtre, ventilateur et conduits d'air de la batterie hybride. Permet d'éviter la surchauffe et d'augmenter la durée de vie de la batterie.", 
      img: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80", 
      type: "hybride" 
    },
    { 
      id: "PACK_HYBRIDE_COMPLET", 
      title: "Pack hybride complet", 
      desc: "Service complet incluant diagnostic hybride, test batterie et nettoyage du système de refroidissement. Idéal pour un entretien global des véhicules hybrides.", 
      img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=600&q=80", 
      type: "premium" 
    }
  ];

  return (
    <main className="relative min-h-screen font-sans selection:bg-[#43A047] selection:text-white overflow-x-hidden">
      
      {/* VIDÉO FIXE EN ARRIÈRE-PLAN GLOBAL - CRYSTAL CLEAR */}
      {/* Pas de poster= : le fond body #000 s'affiche avant que la vidéo se charge */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover -z-50"
      >
        <source src="/dshylec2.mp4" type="video/mp4" />
        Votre navigateur ne supporte pas la vidéo.
      </video>

      {/* OVERLAY GLOBAL ULTRA LÉGER : Juste pour adoucir très légèrement les contrastes extrêmes */}
      <div className="fixed inset-0 bg-white/10 -z-40" />
      {/* Dégradé en bas pour une transition douce vers le footer */}
      <div className="fixed inset-x-0 bottom-0 h-64 bg-gradient-to-t from-white/90 to-transparent -z-35" />

      {/* Artefacts colorés dynamiques type "1337" - Plus grands et plus diffus */}
      <div className="fixed -top-32 -left-32 w-[600px] h-[600px] bg-[#E30613]/20 rounded-full blur-[120px] -z-30 animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="fixed bottom-0 -right-32 w-[800px] h-[800px] bg-[#43A047]/15 rounded-full blur-[150px] -z-30 animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />

      {/* NAVIGATION BAR - Effet Verre plus prononcé */}
      <nav className="fixed w-full bg-white/60 backdrop-blur-xl z-50 border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)] transition-all duration-300 nav-safe-top">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="relative h-10 w-32 md:h-32 md:w-70 hover:scale-105 transition-transform duration-300">
              <Image
                src="/ds_hylec_logo.png"
                alt="DS HY'LEC Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </Link>
          </div>

          <div className="hidden md:flex gap-8 text-sm font-bold text-gray-900 drop-shadow-sm">
            <Link href="#services" className="hover:text-[#43A047] transition-colors duration-300">Nos Services</Link>
            <Link href="/a-propos" className="hover:text-[#43A047] transition-colors duration-300">À propos</Link>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/login" className="text-xs md:text-sm font-bold text-[#E30613] hover:text-[#43A047] transition-colors duration-300">
              Connexion
            </Link>
            <Link href="/reserver" className="bg-[#E30613] text-white px-4 py-2 md:px-6 md:py-2.5 rounded-full font-bold text-xs md:text-sm shadow-[0_8px_20px_rgba(227,6,19,0.3)] hover:bg-[#B3050F] hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(227,6,19,0.4)] transition-all duration-300">
              Prendre RDV
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION DYNAMIQUE */}
      <section className="relative pt-20 pb-10 md:pt-32 md:pb-20 lg:pt-48 lg:pb-32 min-h-[100svh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* CONTENU TEXTE - Placé dans une carte "Glassmorphism" pour laisser la vidéo claire derrière */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center z-20 w-full">
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both p-5 sm:p-10 md:p-16 rounded-2xl md:rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.15)]" style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(4px)' }}>

            <div className="inline-block bg-white/90 backdrop-blur-md px-4 py-2 md:px-5 md:py-2.5 rounded-full mb-4 md:mb-6 shadow-sm border border-white/50 hover:scale-105 transition-transform duration-300 cursor-default">
              <span className="text-[#43A047] font-black text-xs uppercase tracking-[0.2em]">
                Intervention à domicile
              </span>
            </div>

            <h1 className="text-[2rem] sm:text-4xl md:text-6xl lg:text-7xl font-black text-black mb-4 md:mb-6 tracking-tight leading-[1.1]">
              Spécialiste hybride, <br className="hidden md:block"/>
              <span className="text-black">électrique & performance</span>.
            </h1>

            <p className="text-base sm:text-xl md:text-2xl text-black mb-3 md:mb-4 max-w-3xl mx-auto font-bold leading-relaxed">
              La durée de vie d'une voiture dépend de son entretien, arrêtez-vous avant qu'elle ne vous arrête pour éviter de perdre plus de temps et d'argent.
            </p>
            <p className="text-base sm:text-xl md:text-2xl text-black mb-6 md:mb-10 max-w-3xl mx-auto font-bold leading-relaxed">
              <span className="italic font-black">"On détecte, on répare, vous roulez."</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link href="/reserver" className="w-full sm:w-auto px-8 py-4 bg-[#43A047] text-white rounded-full font-bold text-lg shadow-[0_10px_25px_rgba(67,160,71,0.4)] hover:bg-[#388E3C] hover:shadow-[0_15px_35px_rgba(67,160,71,0.5)] hover:-translate-y-1 transition-all duration-300">
                Réserver une intervention
              </Link>
              <Link href="#services" className="w-full sm:w-auto px-8 py-4 bg-white/90 backdrop-blur-md text-[#E30613] border border-white/50 shadow-lg rounded-full font-bold text-lg hover:border-[#E30613] hover:bg-white hover:-translate-y-1 transition-all duration-300">
                Découvrir nos services
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION SERVICES (Fond Glassmorphism pour sublimer la vidéo en dessous) */}
      <section id="services" className="py-24 bg-white/40 backdrop-blur-lg relative z-20 border-t border-white/50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
            <div className="inline-block bg-white/80 px-4 py-1.5 rounded-full mb-4 mx-auto border border-[#E30613]/20 shadow-sm flex justify-center w-max">
              <span className="text-[#E30613] font-bold text-xs uppercase tracking-wider">Expertise Technique</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-center text-gray-900 mb-6 drop-shadow-sm">
              Nos prestations <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E30613] to-[#B3050F]">sur-mesure</span>
            </h2>
            <p className="text-center text-gray-800 mb-16 max-w-2xl mx-auto font-bold text-lg drop-shadow-sm">
              De la mécanique classique aux systèmes haute tension, nous avons l'expertise qu'il faut pour prendre soin de votre véhicule.
            </p>
          </div>
          
          {/* Grille des 8 services */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            {servicesList.map((srv, index) => (
              <div 
                key={srv.id} 
                className={`animate-in fade-in slide-in-from-bottom-12 duration-700 fill-mode-both bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:-translate-y-2 transition-all duration-500 group flex flex-col overflow-hidden relative
                  ${srv.type === 'hybride' ? 'border border-[#43A047]/30 hover:border-[#43A047]/60' : 'border border-white/80'}
                  ${srv.type === 'premium' ? 'bg-gradient-to-br from-[#43A047] to-[#2E7D32] text-white border-0' : ''}
                `}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Badge optionnel (ex: EXPERTISE) */}
                {srv.badge && (
                  <div className="absolute top-4 right-4 z-10 bg-[#43A047]/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                    {srv.badge}
                  </div>
                )}

                {/* Image de couverture animée */}
                <div className="h-48 w-full relative overflow-hidden bg-gray-200">
                  <img
                    src={srv.img}
                    alt={srv.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                  />
                  {/* Voile noir pour la carte Premium, ou dégradé blanc pour les autres */}
                  <div className={`absolute inset-0 ${srv.type === 'premium' ? 'bg-black/30' : 'bg-gradient-to-t from-white/95 via-white/40 to-transparent'}`}></div>
                </div>

                <div className="p-6 flex flex-col flex-1 z-10 -mt-6">
                  <h3 className={`text-xl font-black mb-3 leading-tight ${srv.type === 'premium' ? 'text-white' : 'text-gray-900'}`}>
                    {srv.title}
                  </h3>
                  <p className={`text-sm leading-relaxed mb-6 flex-1 font-medium ${srv.type === 'premium' ? 'text-white/90' : 'text-gray-600'}`}>
                    {srv.desc}
                  </p>
                  
                  {/* LIEN DE RÉSERVATION */}
                  <Link 
                    href={`/reserver?service=${srv.id}`} 
                    className={`font-bold text-sm flex items-center justify-between w-full transition-all mt-auto p-4 rounded-2xl
                      ${srv.type === 'premium' 
                        ? 'bg-white text-[#43A047] shadow-xl hover:scale-[1.02] hover:shadow-2xl' 
                        : srv.type === 'hybride' 
                          ? 'bg-green-50 text-[#43A047] group-hover:bg-[#43A047] group-hover:text-white' 
                          : 'bg-red-50 text-[#E30613] group-hover:bg-[#E30613] group-hover:text-white'
                      }`}
                  >
                    <span>{srv.type === 'premium' ? 'Choisir ce pack' : 'Réserver maintenant'}</span>
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </Link>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1A1A1A] py-16 text-center relative overflow-hidden z-20">
        {/* Ligne rouge technologique sur le bord supérieur */}
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