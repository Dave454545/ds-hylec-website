"use client";
import React, { useEffect, useState } from 'react';

type DeviceOS = 'ios' | 'android' | 'other';

function detectOS(): DeviceOS {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  if (/android/.test(ua)) return 'android';
  return 'other';
}

export default function PrintButton() {
  const [os, setOs] = useState<DeviceOS>('other');

  useEffect(() => {
    setOs(detectOS());
  }, []);

  const handleDownload = () => {
    window.print();
  };

  const hint =
    os === 'ios'
      ? 'Sur iPhone : appuyez sur "Télécharger PDF" puis choisissez "Enregistrer dans Fichiers" dans la feuille de partage.'
      : os === 'android'
      ? "Sur Android : choisissez \"Enregistrer en PDF\" dans les options d'impression."
      : null;

  return (
    <div className="flex flex-col items-center gap-4 my-6 print:hidden px-4">
      <button
        onClick={handleDownload}
        className="flex items-center justify-center gap-2 min-h-[48px] min-w-[200px] bg-[#E30613] text-white px-8 py-3 rounded-xl font-black text-base hover:bg-[#B3050F] transition-all shadow-xl shadow-[#E30613]/30 active:scale-95"
        style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' } as React.CSSProperties}
      >
        <span className="text-xl">📄</span>
        <span>Télécharger PDF</span>
      </button>

      {hint && (
        <p className="text-xs text-center text-gray-500 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 max-w-xs font-medium leading-relaxed">
          💡 {hint}
        </p>
      )}
    </div>
  );
}
