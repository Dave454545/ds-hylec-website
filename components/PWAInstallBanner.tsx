"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "dshylec-pwa-dismissed";
const ANDROID_STORAGE_KEY = "dshylec-pwa-android-dismissed";
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

function isStandalone() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(display-mode: standalone)").matches;
}

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isSafari() {
  if (typeof navigator === "undefined") return false;
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export default function PWAInstallBanner() {
  const pathname = usePathname();
  const [showIOS, setShowIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showAndroid, setShowAndroid] = useState(false);

  const hiddenPrefixes = ["/admin", "/login", "/facture", "/register", "/reset-password", "/setup-admin"];
  const isHiddenPage = hiddenPrefixes.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (isHiddenPage || isStandalone()) return;

    // iOS Safari : afficher le banner si pas encore installé
    if (isIOS() && isSafari()) {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (!dismissed) {
        // Petit délai pour ne pas bloquer le rendu initial
        const t = setTimeout(() => setShowIOS(true), 3000);
        return () => clearTimeout(t);
      }
    }

    // Android : intercepter beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      const dismissed = localStorage.getItem(ANDROID_STORAGE_KEY);
      if (dismissed) {
        const dismissedAt = parseInt(dismissed, 10);
        if (Date.now() - dismissedAt < DISMISS_DURATION_MS) return;
      }
      setDeferredPrompt(e);
      setShowAndroid(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [isHiddenPage]);

  const dismissIOS = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setShowIOS(false);
  };

  const installAndroid = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    localStorage.setItem(ANDROID_STORAGE_KEY, Date.now().toString());
    setDeferredPrompt(null);
    setShowAndroid(false);
  };

  const dismissAndroid = () => {
    localStorage.setItem(ANDROID_STORAGE_KEY, Date.now().toString());
    setShowAndroid(false);
  };

  if (isHiddenPage) return null;

  // --- BANNER IOS ---
  if (showIOS) {
    return (
      <div
        className="fixed bottom-0 left-0 right-0 z-[200] animate-in slide-in-from-bottom-4 duration-500"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-3 mb-3 bg-white rounded-2xl shadow-[0_-4px_30px_rgba(0,0,0,0.15)] border border-gray-100 p-5">
          <div className="flex items-start gap-3 mb-4">
            {/* Icône PWA */}
            <div className="w-12 h-12 bg-[#E30613] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-white text-xl">🚗</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-gray-900 text-sm">Installer DS HY'LEC</p>
              <p className="text-gray-500 text-xs font-medium mt-0.5">Accès rapide depuis votre écran d'accueil</p>
            </div>
            <button
              onClick={dismissIOS}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none w-8 h-8 flex items-center justify-center flex-shrink-0"
              aria-label="Fermer"
            >
              ×
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 mb-4">
            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              <span className="inline-block mr-1">1.</span>
              Appuyez sur{" "}
              <span className="inline-flex items-center gap-0.5 bg-white border border-gray-200 px-1.5 py-0.5 rounded font-bold text-gray-800">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Partager
              </span>{" "}
              en bas de Safari
            </p>
            <p className="text-xs text-gray-600 font-medium leading-relaxed mt-1.5">
              <span className="inline-block mr-1">2.</span>
              Choisissez{" "}
              <span className="font-bold text-gray-800">"Sur l'écran d'accueil"</span>
            </p>
          </div>

          <button
            onClick={dismissIOS}
            className="w-full bg-[#E30613] text-white py-3 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-transform"
            style={{ touchAction: "manipulation" }}
          >
            J'ai compris
          </button>
        </div>
      </div>
    );
  }

  // --- BANNER ANDROID ---
  if (showAndroid) {
    return (
      <div
        className="fixed bottom-0 left-0 right-0 z-[200] animate-in slide-in-from-bottom-4 duration-500"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-3 mb-3 bg-white rounded-2xl shadow-[0_-4px_30px_rgba(0,0,0,0.15)] border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#E30613] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-white text-xl">🚗</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-gray-900 text-sm">Installer DS HY'LEC</p>
              <p className="text-gray-500 text-xs font-medium mt-0.5">Accès rapide, sans passer par le navigateur</p>
            </div>
            <button
              onClick={dismissAndroid}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none w-8 h-8 flex items-center justify-center flex-shrink-0"
              aria-label="Fermer"
            >
              ×
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={dismissAndroid}
              className="flex-1 py-3 rounded-xl font-bold text-sm border border-gray-200 text-gray-600 active:scale-95 transition-transform"
              style={{ touchAction: "manipulation" }}
            >
              Plus tard
            </button>
            <button
              onClick={installAndroid}
              className="flex-1 bg-[#E30613] text-white py-3 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-transform"
              style={{ touchAction: "manipulation" }}
            >
              Installer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
