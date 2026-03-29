"use client";
import React from 'react';

export default function PrintButton() {
  return (
    <div className="flex justify-center my-8 print:hidden">
      <button 
        onClick={() => window.print()} 
        className="bg-[#E30613] text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-[#B3050F] transition-all shadow-xl shadow-[#E30613]/30 flex items-center gap-3 hover:-translate-y-1"
      >
        <span className="text-2xl">📄</span> Télécharger la Facture en PDF
      </button>
    </div>
  );
}