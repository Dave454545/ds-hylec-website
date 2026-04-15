"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  // Hide on pages that have their own full navigation or don't need bottom nav
  const hiddenPrefixes = ['/admin', '/login', '/register', '/reset-password', '/setup-admin'];
  if (hiddenPrefixes.some(p => pathname.startsWith(p))) return null;

  const items = [
    { href: '/',                icon: '🏠', label: 'Accueil',    active: pathname === '/' },
    { href: '/#services',       icon: '🔧', label: 'Services',   active: false },
    { href: '/reserver',        icon: '📅', label: 'Réserver',   active: pathname === '/reserver', cta: true },
    { href: '/a-propos',        icon: 'ℹ️',  label: 'À propos',  active: pathname === '/a-propos' },
    { href: '/dashboard-client',icon: '👤', label: 'Mon espace', active: pathname.startsWith('/dashboard') },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.10)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-end justify-around px-1 pt-2 pb-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center px-2 py-1 rounded-2xl transition-all duration-200 select-none
              ${item.cta
                ? 'bg-[#E30613] text-white shadow-lg shadow-[#E30613]/40 scale-110 -translate-y-1 min-w-[56px] min-h-[52px] mx-1'
                : item.active
                  ? 'text-[#E30613] min-w-[48px] min-h-[48px]'
                  : 'text-gray-400 min-w-[48px] min-h-[48px] hover:text-gray-600'
              }`}
            style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
          >
            <span className={`leading-none mb-0.5 ${item.cta ? 'text-xl' : 'text-lg'}`}>{item.icon}</span>
            <span className={`font-bold leading-none ${item.cta ? 'text-[9px] text-white' : 'text-[10px]'}`}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
