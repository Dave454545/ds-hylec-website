"use client";
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function DashboardClientUI({ user, vehicules, factures, parrainages }: any) {
  const [activeTab, setActiveTab] = useState('garage');

  // Calcul de la cagnotte réelle à partir des parrainages validés (ou on prend user.cagnotte directement si c'est plus simple)
  const cagnotteTotale = user.cagnotte || 0; 

  return (
    <main className="relative min-h-screen font-sans pb-20 selection:bg-[#43A047] selection:text-white overflow-hidden">
      
      {/* VIDÉO EN ARRIÈRE-PLAN : Pleine luminosité */}
      <video
        autoPlay
        loop
        muted
        playsInline
       
        className="fixed inset-0 w-full h-full object-cover -z-50 scale-105"
      >
        <source src="/dshylec1.mp4" type="video/mp4" />
      </video>

      {/* OVERLAY CORRIGÉ : Verre dépoli allégé pour que la vidéo soit VRAIMENT visible */}
      <div className="fixed inset-0 bg-white/30 backdrop-blur-[4px] -z-40" />

      {/* HALOS LUMINEUX DYNAMIQUES */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-[#E30613]/15 rounded-full blur-[120px] -z-30 animate-pulse" style={{ animationDuration: '7s' }} />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-[#43A047]/15 rounded-full blur-[120px] -z-30 animate-pulse" style={{ animationDelay: '2s', animationDuration: '8s' }} />

      {/* HEADER CLIENT (Glassmorphism Rouge) */}
      <nav
        className="bg-gradient-to-r from-[#E30613]/95 to-[#B3050F]/95 backdrop-blur-xl px-6 pb-16 rounded-b-[40px] shadow-[0_20px_40px_-10px_rgba(227,6,19,0.4)] relative z-10 border-b border-white/20"
        style={{ paddingTop: 'calc(2.5rem + env(safe-area-inset-top))' }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between mb-6">
          <div className="flex items-baseline gap-1 text-white">
            <span className="text-2xl font-black tracking-tighter drop-shadow-md">DS HY'LEC</span>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-white/90 text-sm font-bold hover:text-white transition bg-white/10 hover:bg-white/25 px-5 py-2.5 rounded-full border border-white/10 backdrop-blur-sm"
          >
            Déconnexion
          </button>
        </div>
        
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-left-4 duration-700">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 drop-shadow-md">Bonjour, {user.prenom} 👋</h1>
          <p className="text-[#43A047] font-black text-sm uppercase tracking-wider bg-white/95 backdrop-blur-md inline-block px-4 py-1.5 rounded-xl shadow-sm border border-white/50">
            Votre espace personnel sécurisé
          </p>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-20">
        
        {/* MENU DES ONGLETS (Glassmorphism Blanc) */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white/60 p-2 flex gap-2 mb-8 overflow-x-auto hide-scrollbar">
          <button onClick={() => setActiveTab('garage')} className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${activeTab === 'garage' ? 'bg-gradient-to-br from-[#E30613] to-[#B3050F] text-white shadow-lg' : 'text-gray-700 hover:bg-white'}`}>
            🚗 Mon Garage
          </button>
          <button onClick={() => setActiveTab('factures')} className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${activeTab === 'factures' ? 'bg-gradient-to-br from-[#E30613] to-[#B3050F] text-white shadow-lg' : 'text-gray-700 hover:bg-white'}`}>
            📑 Interventions & Factures
          </button>
          <button onClick={() => setActiveTab('parrainage')} className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${activeTab === 'parrainage' ? 'bg-gradient-to-br from-[#43A047] to-[#2E7D32] text-white shadow-lg' : 'text-gray-700 hover:bg-white'}`}>
            🎁 Parrainage
          </button>
        </div>

        {/* CONTENU : MON GARAGE */}
        {activeTab === 'garage' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 space-y-4">
            <div className="flex justify-between items-end mb-4 px-2">
              <h2 className="text-xl font-black text-gray-900 drop-shadow-sm">Mes Véhicules</h2>
              <Link href="/reserver" className="text-[#E30613] font-black text-sm hover:text-[#43A047] transition bg-white/70 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm border border-white/50 hover:bg-white">
                + Ajouter un véhicule
              </Link>
            </div>
            
            {vehicules.length === 0 ? (
              <div className="bg-white/90 backdrop-blur-lg p-10 rounded-[24px] border border-white/50 shadow-sm text-center">
                <span className="text-4xl mb-3 block opacity-50">🚘</span>
                <p className="text-gray-600 font-medium">Aucun véhicule enregistré pour le moment.</p>
              </div>
            ) : vehicules.map((v: any) => (
              <div key={v.id} className="bg-white/95 backdrop-blur-xl p-6 rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)] hover:scale-[1.01] transition-all duration-300">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-black text-xl text-[#E30613] drop-shadow-sm">{v.marque} {v.modele}</h3>
                    <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider border border-gray-200">{v.carburant}</span>
                  </div>
                  <p className="text-gray-600 text-sm font-medium">Année {v.annee}</p>
                </div>
                
                {v.dateProchainCT && (
                  <div className="bg-orange-50/90 border border-orange-200/60 p-3 rounded-xl flex items-center gap-3 shadow-inner">
                    <span className="text-2xl animate-pulse">⚠️</span>
                    <div>
                      <p className="text-[10px] font-black text-orange-800 uppercase tracking-widest mb-0.5">Alerte Entretien</p>
                      <p className="text-sm text-orange-700 font-bold">CT : {new Date(v.dateProchainCT).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                )}
                
                <Link href="/reserver" className="bg-[#E30613]/10 text-[#E30613] font-black py-3 px-6 rounded-xl hover:bg-[#E30613] hover:text-white transition-colors text-center text-sm whitespace-nowrap shadow-sm border border-[#E30613]/20 hover:border-transparent">
                  Prendre RDV
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* CONTENU : FACTURES ET INTERVENTIONS */}
        {activeTab === 'factures' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
            <h2 className="text-xl font-black text-gray-900 mb-4 px-2 drop-shadow-sm">Historique des interventions</h2>
            
            <div className="bg-white/95 backdrop-blur-xl rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white/60 overflow-hidden">
              {user.reservations?.length === 0 ? (
                <div className="p-10 text-center">
                  <span className="text-4xl mb-3 block opacity-50">🧾</span>
                  <p className="text-gray-600 font-medium">Aucune intervention enregistrée.</p>
                </div>
              ) : (
                user.reservations?.map((rdv: any, idx: number) => (
                  <div key={rdv.id} className={`p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/50 transition-colors ${idx !== user.reservations.length - 1 ? 'border-b border-gray-100/80' : ''}`}>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-black text-[#E30613]">{rdv.service.replace(/_/g, ' ')}</p>
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${rdv.statut === 'TERMINEE' ? 'bg-[#43A047]/10 text-[#43A047] border border-[#43A047]/20' : 'bg-orange-100 text-orange-700 border border-orange-200'}`}>
                          {rdv.statut}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">
                        Le {new Date(rdv.dateIntervention).toLocaleDateString('fr-FR')} 
                        {rdv.vehicule && ` • ${rdv.vehicule.marque} ${rdv.vehicule.modele}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 justify-between sm:justify-end">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Montant</p>
                        <p className="font-black text-gray-900 text-xl">{rdv.montantTotal} €</p>
                      </div>

                      {rdv.statut === 'TERMINEE' ? (
                        <Link 
                          href={`/facture/${rdv.id}`} 
                          target="_blank" 
                          className="bg-gray-100/90 text-gray-800 px-5 py-3 rounded-xl text-sm font-black hover:bg-[#E30613] hover:text-white transition-colors flex items-center gap-2 shadow-sm border border-gray-200"
                        >
                          <span>📄</span> Facture
                        </Link>
                      ) : (
                        <div className="px-5 py-3 rounded-xl text-sm font-bold text-gray-500 bg-gray-50/80 border border-gray-200 cursor-not-allowed">
                          En attente
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            <p className="text-xs text-center text-gray-600 mt-5 font-medium bg-white/70 backdrop-blur-md p-3 rounded-xl inline-block mx-auto">
              Les factures sont générées automatiquement une fois l'intervention terminée par le technicien.
            </p>
          </div>
        )}

        {/* CONTENU : PARRAINAGE DYNAMIQUE */}
        {activeTab === 'parrainage' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
            <h2 className="text-xl font-black text-gray-900 mb-4 px-2 drop-shadow-sm">Programme Fidélité</h2>
            
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="bg-gradient-to-br from-[#43A047]/95 to-[#2E7D32]/95 backdrop-blur-xl p-8 rounded-[24px] text-white shadow-[0_15px_30px_rgba(67,160,71,0.3)] border border-[#43A047]/50 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 text-9xl opacity-10 group-hover:scale-110 transition-transform duration-700">💰</div>
                <p className="text-white/90 font-black text-xs mb-2 uppercase tracking-widest relative z-10">Cagnotte Disponible</p>
                <p className="text-6xl font-black mb-4 relative z-10 drop-shadow-lg">{cagnotteTotale} €</p>
                <p className="text-sm font-medium opacity-95 relative z-10 leading-relaxed">
                  Cette somme sera automatiquement déduite de votre prochaine intervention !
                </p>
              </div>

              <div className="bg-white/95 backdrop-blur-xl p-8 rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white/60 flex flex-col justify-center">
                <p className="font-black text-[#E30613] mb-3 text-lg drop-shadow-sm">Votre code parrain</p>
                <p className="text-sm text-gray-700 mb-6 font-medium leading-relaxed">
                  Partagez ce code avec vos proches. S'ils l'utilisent, vous gagnez <strong className="text-[#43A047] font-black">10€</strong> et ils obtiennent <strong className="text-[#43A047] font-black">10€</strong> de réduction !
                </p>
                
                <div className="bg-gray-50/90 border-2 border-dashed border-[#E30613]/40 px-4 py-4 rounded-xl text-center font-black tracking-[0.2em] text-gray-900 text-2xl shadow-inner">
                  {user.codeParrain || 'CODE-NON-GENERE'}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}