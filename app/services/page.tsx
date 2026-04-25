import Link from 'next/link';
import Image from 'next/image';
import { SERVICES } from '@/lib/services-data';

export default function ServicesPage() {
  return (
    <main className="relative min-h-screen font-sans selection:bg-[#43A047] selection:text-white overflow-x-hidden">

      {/* FOND VIDÉO */}
      <video autoPlay loop muted playsInline preload="none" className="fixed inset-0 w-full h-full object-cover -z-50">
        <source src="/dshylec2 compress.mp4" type="video/mp4" />
      </video>
      <div className="fixed inset-0 bg-white/10 -z-40" />
      <div className="fixed inset-x-0 bottom-0 h-64 bg-gradient-to-t from-white/90 to-transparent -z-35" />
      <div className="fixed -top-32 -left-32 w-[600px] h-[600px] bg-[#E30613]/20 rounded-full blur-[120px] -z-30 animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="fixed bottom-0 -right-32 w-[800px] h-[800px] bg-[#43A047]/15 rounded-full blur-[150px] -z-30 animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />

      {/* NAVBAR */}
      <nav className="fixed w-full bg-white/60 backdrop-blur-xl z-50 border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)] nav-safe-top">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-20 flex items-center justify-between">
          <Link href="/" className="hover:scale-105 transition-transform duration-300 shrink-0">
            <Image src="/logo-ds_hylec_neuf.webp" alt="DS HY'LEC Logo" width={140} height={48} className="h-14 md:h-12 w-auto object-contain" priority />
          </Link>
          <div className="hidden md:flex gap-8 text-sm font-bold text-gray-900 drop-shadow-sm">
            <Link href="/services" className="text-[#E30613] transition-colors duration-300">Nos Services</Link>
            <Link href="/a-propos" className="hover:text-[#43A047] transition-colors duration-300">À propos</Link>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/login" className="text-xs md:text-sm font-bold text-[#E30613] hover:text-[#43A047] transition-colors duration-300">Connexion</Link>
            <Link href="/reserver" className="bg-[#E30613] text-white px-4 py-2 md:px-6 md:py-2.5 rounded-full font-bold text-xs md:text-sm shadow-[0_8px_20px_rgba(227,6,19,0.3)] hover:bg-[#B3050F] hover:-translate-y-0.5 transition-all duration-300">
              Prendre RDV
            </Link>
          </div>
        </div>
      </nav>

      {/* CONTENU */}
      <div className="pt-20 md:pt-28 pb-28 relative z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">

          {/* EN-TÊTE */}
          <div className="text-center py-8 md:py-14 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
            <div className="inline-block bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full mb-4 border border-[#E30613]/20 shadow-sm">
              <span className="text-[#E30613] font-bold text-xs uppercase tracking-wider">Expertise Technique</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-3 drop-shadow-sm">
              Nos Prestations <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E30613] to-[#B3050F]">sur Mesure</span>
            </h1>
            <p className="text-sm md:text-lg text-gray-700 max-w-xl mx-auto font-medium">
              Expert hybride, diagnostic électronique et performance moteur
            </p>
          </div>

          {/* GRILLE — 2 cols mobile, 3 desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {SERVICES.map((srv, index) => (
              <Link
                key={srv.id}
                href={`/services/${srv.slug}`}
                className="animate-in fade-in slide-in-from-bottom-8 duration-600 fill-mode-both group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {/* Image */}
                <div className="h-32 sm:h-40 w-full overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src={srv.img}
                    alt={srv.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>

                {/* Contenu */}
                <div className="p-3 sm:p-4 flex flex-col flex-1">
                  {srv.badge && (
                    <span className="inline-block self-start text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-[#43A047]/10 text-[#43A047] px-2 py-0.5 rounded-full mb-2">
                      {srv.badge}
                    </span>
                  )}
                  <h2 className="text-xs sm:text-sm font-semibold text-gray-900 leading-snug mb-1.5 line-clamp-2">
                    {srv.title}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed line-clamp-2 flex-1">
                    {srv.descCourte}
                  </p>
                  <div className="flex justify-end mt-2">
                    <span className="text-[#E30613]/60 text-sm group-hover:text-[#E30613] group-hover:translate-x-0.5 transition-all duration-200">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#1A1A1A] py-16 text-center relative overflow-hidden z-20">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E30613] to-transparent opacity-70" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <p className="text-white/60 text-sm font-medium">
            © {new Date().getFullYear()} DS HY'LEC. Expert hybrid, diagnostic électronique et performance moteur.<br className="mb-2" />
            Créé par <span className="text-[#43A047] font-bold">Kreativ Academy</span>.
          </p>
        </div>
      </footer>
    </main>
  );
}
