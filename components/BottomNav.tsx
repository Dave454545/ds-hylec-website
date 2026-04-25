"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wrench, CalendarCheck, Info, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const hiddenPrefixes = ['/admin', '/login', '/register', '/reset-password', '/setup-admin'];
  if (hiddenPrefixes.some(p => pathname.startsWith(p))) return null;

  const items = [
    { href: '/',                 Icon: Home,          label: 'Accueil',    active: pathname === '/' },
    { href: '/services',          Icon: Wrench,         label: 'Services',   active: pathname.startsWith('/services') },
    { href: '/reserver',         Icon: CalendarCheck,  label: 'Réserver',   active: pathname === '/reserver', cta: true },
    { href: '/a-propos',         Icon: Info,           label: 'À propos',   active: pathname === '/a-propos' },
    { href: '/dashboard-client', Icon: User,           label: 'Mon espace', active: pathname.startsWith('/dashboard') },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.10)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-end justify-around px-1 pt-2 pb-1">
        {items.map(({ href, Icon, label, active, cta }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center px-2 py-1.5 rounded-2xl transition-all duration-200 select-none
              ${cta
                ? 'bg-[#E30613] text-white shadow-lg shadow-[#E30613]/40 scale-110 -translate-y-1 min-w-[56px] min-h-[52px] mx-1 active:scale-100 active:shadow-md'
                : active
                  ? 'bg-[#E30613]/10 text-[#E30613] min-w-[48px] min-h-[48px]'
                  : 'text-gray-400 min-w-[48px] min-h-[48px] hover:text-gray-600'
              }`}
            style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
          >
            <Icon
              size={cta ? 22 : 20}
              strokeWidth={active || cta ? 2.5 : 1.8}
              className="mb-0.5"
            />
            <span className={`font-bold leading-none ${cta ? 'text-[10px]' : active ? 'text-[11px] text-[#E30613]' : 'text-[11px]'}`}>
              {label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
