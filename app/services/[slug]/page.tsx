import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { SERVICES, getServiceBySlug } from '@/lib/services-data';

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const srv = getServiceBySlug(slug);
  if (!srv) notFound();

  return (
    <main className="relative min-h-screen font-sans selection:bg-[#43A047] selection:text-white overflow-x-hidden">

      {/* FOND VIDÉO */}
      <video autoPlay loop muted playsInline preload="none" className="fixed inset-0 w-full h-full object-cover -z-50">
        <source src="/dshylec2 compress.mp4" type="video/mp4" />
      </video>
      <div className="fixed inset-0 bg-white/10 -z-40" />
      <div className="fixed inset-x-0 bottom-0 h-64 bg-gradient-to-t from-white/90 to-transparent -z-35" />
      <div className="fixed -top-32 -left-32 w-[600px] h-[600px] bg-[#E30613]/20 rounded-full blur-[120px] -z-30 animate-pulse" style={{ animationDuration: '6s' }} />

      {/* NAVBAR */}
      <nav className="fixed w-full bg-white/60 backdrop-blur-xl z-50 border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)] nav-safe-top">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-20 flex items-center justify-between">
          <Link href="/services" className="text-gray-900 font-bold text-xs sm:text-sm hover:text-[#E30613] transition bg-white/60 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-gray-200 shadow-sm">
            ← Services
          </Link>
          <Link href="/" className="hover:scale-105 transition-transform duration-300">
            <Image src="/logo-ds_hylec_neuf.webp" alt="DS HY'LEC Logo" width={140} height={48} className="h-12 md:h-12 w-auto object-contain" priority />
          </Link>
          <Link href="/reserver" className="bg-[#E30613] text-white px-4 py-2 rounded-full font-bold text-xs shadow-[0_8px_20px_rgba(227,6,19,0.3)] hover:bg-[#B3050F] transition-all duration-300">
            Prendre RDV
          </Link>
        </div>
      </nav>

      {/* CONTENU */}
      <div className="pt-14 md:pt-20 pb-32 relative z-20">

        {/* IMAGE HERO PLEINE LARGEUR */}
        <div className="w-full h-56 sm:h-64 md:h-80 relative overflow-hidden bg-gray-200">
          <img
            src={srv.img}
            alt={srv.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          {/* Badge type */}
          <div className="absolute bottom-4 left-4 md:left-8">
            <span className={`inline-block text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg
              ${srv.type === 'premium' ? 'bg-[#43A047]' : srv.type === 'hybride' ? 'bg-[#43A047]/90' : 'bg-[#E30613]/90'}
            `}>
              {srv.type === 'premium' ? 'Pack complet' : srv.type === 'hybride' ? 'Spécialité hybride' : 'Service standard'}
            </span>
          </div>
        </div>

        {/* CORPS */}
        <div className="max-w-3xl mx-auto px-4 md:px-6">

          {/* TITRE */}
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-white/80 p-6 sm:p-8 md:p-10 -mt-8 relative z-10 mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-3 leading-tight">
              {srv.title}
            </h1>
            <p className="text-[#E30613] font-bold text-sm sm:text-base">{srv.descCourte}</p>
          </div>

          {/* DESCRIPTION LONGUE */}
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-white/80 p-6 sm:p-8 md:p-10 mb-6">
            <h2 className="text-lg sm:text-xl font-black text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-[#E30613]">✦</span> À propos de cette prestation
            </h2>
            <p className="text-gray-700 leading-relaxed font-medium text-sm sm:text-base whitespace-pre-line">
              {srv.descLongue}
            </p>
          </div>

          {/* AUTRES SERVICES */}
          <div className="mt-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-400 fill-mode-both">
            <h2 className="text-lg font-black text-gray-900 mb-4 drop-shadow-sm">Autres prestations</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SERVICES.filter((s) => s.slug !== srv.slug).slice(0, 6).map((other) => (
                <Link
                  key={other.slug}
                  href={`/services/${other.slug}`}
                  className="bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group border border-white/80"
                >
                  <div className="h-20 overflow-hidden bg-gray-100">
                    <img src={other.img} alt={other.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-bold text-gray-800 line-clamp-2 leading-tight">{other.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* BOUTON RÉSERVER — inline, visible sur tous écrans, margin pour la BottomNav mobile */}
          <div
            className="mt-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500 fill-mode-both"
            style={{ marginBottom: 'calc(90px + env(safe-area-inset-bottom))' }}
          >
            <Link
              href={`/reserver?service=${srv.id}`}
              className="flex items-center justify-center gap-3 w-full py-5 bg-gradient-to-r from-[#E30613] to-[#B3050F] text-white rounded-2xl font-black text-base md:text-lg shadow-[0_10px_25px_rgba(227,6,19,0.35)] hover:shadow-[0_15px_35px_rgba(227,6,19,0.45)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
            >
              Réserver ce service →
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
