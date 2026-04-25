"use client";
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; 

export default function AdminUI({ initialReservations, initialUsers, initialIndisponibilites, initialTarifications, stats }: any) {
  const [adminTab, setAdminTab] = useState('planning'); 
  const [activeFilter, setActiveFilter] = useState('tous');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  // États pour le formulaire de congés
  const [dateConge, setDateConge] = useState('');
  const [motifConge, setMotifConge] = useState('');
  const [loadingConge, setLoadingConge] = useState(false);

  // États pour les Tarifications
  const [prixInputs, setPrixInputs] = useState<Record<string, string>>(() => {
    const initialState: Record<string, string> = {};
    if (initialTarifications) {
      initialTarifications.forEach((t: any) => {
        initialState[t.service] = t.prix.toString();
      });
    }
    return initialState;
  });
  const [loadingTarif, setLoadingTarif] = useState<string | null>(null);

  const servicesList = [
    { label: "Diagnostic électronique complet", value: "DIAGNOSTIC_ELECTRONIQUE" },
    { label: "Décalaminage moteur hydrogène", value: "DECALAMINAGE_MOTEUR" },
    { label: "Régénération FAP", value: "REGENERATION_FAP" },
    { label: "Nettoyage vanne EGR / admission", value: "NETTOYAGE_EGR" },
    { label: "Diagnostic système hybride", value: "DIAGNOSTIC_HYBRIDE" },
    { label: "Test batterie hybride", value: "TEST_BATTERIE_HYBRIDE" },
    { label: "Nettoyage refroidissement hybride", value: "NETTOYAGE_REFROIDISSEMENT_HYBRIDE" },
    { label: "Pack hybride complet", value: "PACK_HYBRIDE_COMPLET" }
  ];

  const filteredRDV = initialReservations.filter((rdv: any) => {
    if (activeFilter === 'tous') return true;
    const dateInter = new Date(rdv.dateIntervention).toDateString();
    const today = new Date().toDateString();
    if (activeFilter === 'aujourdhui') return dateInter === today;
    return true;
  });

  const validerRDV = async (reservationId: string) => {
    if (!confirm("Confirmer la fin de cette intervention ? (Cela validera la cagnotte du parrain si applicable)")) return;
    setLoadingId(reservationId);
    try {
      const res = await fetch('/api/admin/terminer-rdv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId })
      });
      if (res.ok) router.refresh();
      else alert("Erreur lors de la validation de la réservation.");
    } catch (error) {
      console.error(error);
      alert("Erreur réseau.");
    } finally {
      setLoadingId(null);
    }
  };

  const supprimerClient = async (userId: string) => {
    if (!confirm("⚠️ ATTENTION : Êtes-vous sûr de vouloir supprimer ce client ?")) return;
    try {
      const res = await fetch('/api/admin/utilisateurs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        alert("Client supprimé avec succès.");
        router.refresh();
      } else alert("Erreur lors de la suppression.");
    } catch (error) {
      alert("Erreur réseau.");
    }
  };

  const resetPasswordClient = async (userId: string) => {
    if (!confirm("Générer un mot de passe temporaire pour ce client ?")) return;
    try {
      const res = await fetch('/api/admin/utilisateurs/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Nouveau mot de passe généré :\n\n${data.newPassword}\n\nCommuniquez ce mot de passe au client.`);
      } else alert("Erreur lors de la réinitialisation.");
    } catch (error) {
      alert("Erreur réseau.");
    }
  };

  const ajouterConge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateConge) return;
    setLoadingConge(true);
    try {
      const res = await fetch('/api/admin/indisponibilites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateConge, motif: motifConge })
      });
      if (res.ok) {
        setDateConge('');
        setMotifConge('');
        router.refresh();
      } else {
        alert("Erreur lors de l'ajout du congé.");
      }
    } catch (error) {
      alert("Erreur réseau.");
    } finally {
      setLoadingConge(false);
    }
  };

  const supprimerConge = async (id: string) => {
    if (!confirm("Débloquer cette date ? Les clients pourront à nouveau réserver.")) return;
    try {
      const res = await fetch('/api/admin/indisponibilites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) router.refresh();
    } catch (error) {
      alert("Erreur réseau.");
    }
  };

  const handleUpdateTarif = async (serviceValue: string) => {
    const prix = prixInputs[serviceValue];
    if (!prix || isNaN(Number(prix))) {
      alert("Veuillez entrer un prix valide.");
      return;
    }

    setLoadingTarif(serviceValue);
    try {
      const res = await fetch('/api/admin/tarifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: serviceValue, prix: Number(prix) })
      });
      
      if (res.ok) {
        router.refresh();
      } else {
        alert("Erreur lors de la sauvegarde.");
      }
    } catch (error) {
      alert("Erreur réseau.");
    } finally {
      setLoadingTarif(null);
    }
  };

  return (
    <main className="relative min-h-screen font-sans pb-20 selection:bg-[#43A047] selection:text-white overflow-x-hidden">
      
      {/* VIDÉO EN ARRIÈRE-PLAN : Pleine luminosité */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        className="fixed inset-0 w-full h-full object-cover -z-50 scale-105"
      >
        <source src="/dshylec1 compress.mp4" type="video/mp4" />
      </video>

      {/* OVERLAY CORRIGÉ : Verre dépoli allégé pour que la vidéo soit VRAIMENT visible */}
      <div className="fixed inset-0 bg-white/30 backdrop-blur-[4px] -z-40" />

      {/* HALOS LUMINEUX DYNAMIQUES */}
      <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-[#E30613]/15 rounded-full blur-[120px] -z-30 animate-pulse" style={{ animationDuration: '7s' }} />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-[#1A1A1A]/15 rounded-full blur-[120px] -z-30 animate-pulse" style={{ animationDelay: '2s', animationDuration: '8s' }} />

      {/* HEADER GÉRANT (Dark Glassmorphism) */}
      <nav className="bg-[#1A1A1A]/90 backdrop-blur-xl px-6 pt-10 pb-6 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] sticky top-0 z-50 border-b-4 border-[#E30613]">
        <div className="max-w-5xl mx-auto flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-md">Espace Gérant</h1>
            <p className="text-[#43A047] font-bold text-sm uppercase tracking-widest mt-1">DS HY'LEC</p>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold hover:bg-[#E30613] hover:border-[#E30613] transition-all px-5 py-2.5 rounded-full shadow-sm"
          >
            Déconnexion
          </button>
        </div>

        {/* STATS GRID */}
        <div className="max-w-5xl mx-auto grid grid-cols-4 gap-3 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center hover:bg-white/15 transition-colors">
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">RDV Total</p>
            <p className="text-xl font-black text-white">{stats.total}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center hover:bg-white/15 transition-colors">
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">En attente</p>
            <p className="text-xl font-black text-orange-400">{stats.pending}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center hover:bg-white/15 transition-colors">
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Clients</p>
            <p className="text-xl font-black text-blue-400">{stats.totalClients}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center hover:bg-white/15 transition-colors">
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">CA Estimé</p>
            <p className="text-xl font-black text-[#43A047]">{stats.ca}€</p>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 mt-8 relative z-20">
        
        {/* MENU DES ONGLETS ADMIN (Glassmorphism) */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[1.25rem] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white/60 p-2 flex gap-2 mb-10 overflow-x-auto hide-scrollbar">
          <button onClick={() => setAdminTab('planning')} className={`flex-1 py-3.5 px-4 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${adminTab === 'planning' ? 'bg-gradient-to-br from-[#E30613] to-[#B3050F] text-white shadow-lg' : 'text-gray-700 hover:bg-white'}`}>
            📅 Planning RDV
          </button>
          <button onClick={() => setAdminTab('clients')} className={`flex-1 py-3.5 px-4 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${adminTab === 'clients' ? 'bg-gradient-to-br from-[#E30613] to-[#B3050F] text-white shadow-lg' : 'text-gray-700 hover:bg-white'}`}>
            👥 Base Clients
          </button>
          <button onClick={() => setAdminTab('conges')} className={`flex-1 py-3.5 px-4 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${adminTab === 'conges' ? 'bg-gradient-to-br from-[#E30613] to-[#B3050F] text-white shadow-lg' : 'text-gray-700 hover:bg-white'}`}>
            🏖️ Congés & Horaires
          </button>
          <button onClick={() => setAdminTab('tarifs')} className={`flex-1 py-3.5 px-4 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${adminTab === 'tarifs' ? 'bg-gradient-to-br from-[#43A047] to-[#2E7D32] text-white shadow-lg' : 'text-gray-700 hover:bg-white'}`}>
            💰 Tarifs
          </button>
        </div>

        {/* ONGLET 1 : PLANNING */}
        {adminTab === 'planning' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar">
              {['aujourdhui', 'tous'].map((f) => (
                <button 
                  key={f}
                  onClick={() => setActiveFilter(f)} 
                  className={`px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all ${activeFilter === f ? 'bg-gradient-to-br from-[#E30613] to-[#B3050F] text-white shadow-md' : 'bg-white/90 backdrop-blur-md text-gray-700 border border-white/60 hover:bg-white'}`}
                >
                  {f === 'aujourdhui' ? "Aujourd'hui" : "Tout le planning"}
                </button>
              ))}
            </div>

            <div className="space-y-5">
              {filteredRDV.length === 0 ? (
                <div className="bg-white/90 backdrop-blur-lg p-10 rounded-[24px] border border-white/50 shadow-sm text-center">
                  <span className="text-4xl mb-3 block opacity-50">📅</span>
                  <p className="text-gray-600 font-medium">Aucun RDV à afficher pour cette sélection.</p>
                </div>
              ) : filteredRDV.map((rdv: any) => (
                <div key={rdv.id} className="bg-white/95 backdrop-blur-xl rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white/60 overflow-hidden hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-300">
                  <div className="bg-gray-50/80 backdrop-blur-sm px-6 py-4 border-b border-gray-100/50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-[#E30613] text-lg drop-shadow-sm">
                        {new Date(rdv.dateIntervention).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-gray-500 text-sm font-bold uppercase tracking-wider">| {new Date(rdv.dateIntervention).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <span className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest ${rdv.statut === 'TERMINEE' ? 'bg-[#43A047]/10 text-[#43A047] border border-[#43A047]/20' : 'bg-orange-100 text-orange-700 border border-orange-200'}`}>
                      {rdv.statut.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                      <div>
                        <h2 className="text-xl font-black text-gray-900 mb-2">{rdv.service.replace(/_/g, ' ')}</h2>
                        <div className="flex items-center gap-2">
                          <span className="bg-[#E30613]/10 text-[#E30613] px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider">{rdv.vehicule?.carburant}</span>
                          <p className="text-gray-700 font-bold text-sm">{rdv.vehicule?.marque} {rdv.vehicule?.modele}</p>
                        </div>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Montant à régler :</p>
                        <p className="text-2xl font-black text-[#43A047] drop-shadow-sm">{rdv.montantTotal} €</p>
                      </div>
                    </div>

                    {rdv.problemes && rdv.problemes.length > 0 && (
                      <div className="mb-6">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2.5">Symptômes signalés :</p>
                        <div className="flex flex-wrap gap-2">
                          {rdv.problemes.map((prob: string, idx: number) => (
                            <span key={idx} className="bg-red-50 text-[#E30613] border border-red-100 text-xs px-3 py-1.5 rounded-lg font-bold shadow-sm">
                              ⚠️ {prob}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-gray-100/50 shadow-inner">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <p className="font-black text-gray-900 text-lg">{rdv.user?.nom} {rdv.user?.prenom}</p>
                          {rdv.user?.typeClient === 'PROFESSIONNEL' && (
                            <span className="bg-gradient-to-r from-[#E30613] to-[#B3050F] text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-black shadow-sm">PRO</span>
                          )}
                        </div>
                        <a href={`tel:${rdv.user?.telephone}`} className="bg-white px-4 py-2 rounded-xl text-[#E30613] font-black text-sm hover:bg-[#E30613] hover:text-white transition-colors border border-gray-200 shadow-sm flex items-center gap-2">
                          <span>📞</span> Appeler
                        </a>
                      </div>
                      <p className="text-gray-700 text-sm font-medium flex items-center gap-2">
                        <span>📍</span> {rdv.adresse}
                      </p>
                    </div>

                    {rdv.statut !== 'TERMINEE' ? (
                      <button onClick={() => validerRDV(rdv.id)} disabled={loadingId === rdv.id} className="w-full bg-gradient-to-r from-[#43A047] to-[#2E7D32] hover:shadow-lg hover:-translate-y-0.5 text-white py-4 rounded-xl font-black text-lg transition-all shadow-[#43A047]/30 disabled:opacity-50 disabled:hover:translate-y-0">
                        {loadingId === rdv.id ? 'Validation en cours...' : 'Terminer l\'intervention'}
                      </button>
                    ) : (
                      <Link href={`/facture/${rdv.id}`} target="_blank" className="w-full flex items-center justify-center gap-2 bg-gray-100/90 hover:bg-gray-200 text-gray-800 py-4 rounded-xl font-black transition-colors border border-gray-200 shadow-sm">
                        📄 Consulter la facture PDF
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ONGLET 2 : BASE CLIENTS */}
        {adminTab === 'clients' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 space-y-5">
            {initialUsers.length === 0 ? (
              <div className="bg-white/90 backdrop-blur-lg p-10 rounded-[24px] border border-white/50 shadow-sm text-center">
                <span className="text-4xl mb-3 block opacity-50">👥</span>
                <p className="text-gray-600 font-medium">Aucun client dans la base de données.</p>
              </div>
            ) : initialUsers.map((client: any) => (
              <div key={client.id} className="bg-white/95 backdrop-blur-xl rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white/60 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-xl font-black text-gray-900 drop-shadow-sm">{client.nom} {client.prenom}</h2>
                    <span className={`text-[10px] px-3 py-1 rounded-md uppercase tracking-widest font-black ${client.typeClient === 'PROFESSIONNEL' ? 'bg-[#E30613]/10 text-[#E30613] border border-[#E30613]/20' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                      {client.typeClient}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1.5 font-medium">
                    <p className="flex items-center gap-2"><span>📧</span> {client.email}</p>
                    <p className="flex items-center gap-2"><span>📞</span> {client.telephone || 'Non renseigné'}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#43A047]/10 to-[#43A047]/5 border border-[#43A047]/20 px-6 py-4 rounded-2xl text-center min-w-[140px] shadow-inner">
                  <p className="text-[10px] font-black text-[#43A047] uppercase tracking-widest mb-1">Cagnotte</p>
                  <p className="text-3xl font-black text-[#43A047] drop-shadow-sm">{client.cagnotte} €</p>
                </div>

                <div className="flex flex-col gap-3 w-full md:w-auto">
                  <button onClick={() => resetPasswordClient(client.id)} className="bg-gray-100/90 text-gray-800 hover:bg-gray-200 px-5 py-3 rounded-xl text-xs font-black transition-colors w-full border border-gray-200 shadow-sm flex items-center justify-center gap-2">
                    <span>🔑</span> Nouveau MDP
                  </button>
                  <button onClick={() => supprimerClient(client.id)} className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 px-5 py-3 rounded-xl text-xs font-black transition-colors w-full shadow-sm flex items-center justify-center gap-2">
                    <span>🗑️</span> Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ONGLET 3 : CONGÉS & HORAIRES */}
        {adminTab === 'conges' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="bg-white/95 backdrop-blur-xl rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white/60 p-8 mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🏖️</span>
                <h2 className="text-2xl font-black text-gray-900 drop-shadow-sm">Bloquer une journée</h2>
              </div>
              <p className="text-sm text-gray-600 mb-8 font-medium">Sélectionnez une date pour empêcher les clients de prendre rendez-vous.</p>
              
              <form onSubmit={ajouterConge} className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="date" 
                  value={dateConge}
                  onChange={(e) => setDateConge(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="flex-1 border-2 border-gray-200 rounded-xl p-4 bg-white/80 backdrop-blur-sm outline-none focus:border-[#43A047] focus:bg-white font-bold text-gray-800 shadow-inner transition-colors"
                />
                <input 
                  type="text" 
                  placeholder="Motif (ex: Vacances)"
                  value={motifConge}
                  onChange={(e) => setMotifConge(e.target.value)}
                  className="flex-[2] border-2 border-gray-200 rounded-xl p-4 bg-white/80 backdrop-blur-sm outline-none focus:border-[#43A047] focus:bg-white font-bold text-gray-800 shadow-inner transition-colors"
                />
                <button 
                  type="submit" 
                  disabled={loadingConge || !dateConge}
                  className="bg-gradient-to-r from-[#43A047] to-[#2E7D32] hover:shadow-lg hover:-translate-y-0.5 text-white px-8 py-4 rounded-xl font-black transition-all shadow-[#43A047]/30 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {loadingConge ? '...' : 'Bloquer'}
                </button>
              </form>
            </div>

            <h2 className="text-xl font-black text-gray-900 mb-5 ml-2 drop-shadow-sm">Jours actuellement bloqués</h2>
            <div className="space-y-4">
              {(!initialIndisponibilites || initialIndisponibilites.length === 0) ? (
                <div className="bg-white/90 backdrop-blur-lg p-8 rounded-[24px] border border-white/50 shadow-sm text-center">
                  <p className="text-gray-600 font-medium">Aucun jour n'est bloqué actuellement.</p>
                </div>
              ) : (
                initialIndisponibilites.map((indispo: any) => (
                  <div key={indispo.id} className="bg-white/95 backdrop-blur-xl p-5 rounded-2xl border border-white/60 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-5">
                      <div className="bg-orange-50 text-orange-600 w-14 h-14 rounded-xl flex items-center justify-center text-2xl border border-orange-100 shadow-inner">🏖️</div>
                      <div>
                        <p className="font-black text-gray-900 text-lg">{new Date(indispo.dateDebut).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        <p className="text-sm text-gray-600 font-medium mt-0.5">Motif : <span className="font-bold text-gray-800">{indispo.motif || 'Non renseigné'}</span></p>
                      </div>
                    </div>
                    <button onClick={() => supprimerConge(indispo.id)} className="text-[#E30613] bg-red-50 hover:bg-[#E30613] hover:text-white border border-red-100 px-5 py-2.5 rounded-xl transition-colors font-black text-sm shadow-sm">Débloquer</button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ONGLET 4 : TARIFS */}
        {adminTab === 'tarifs' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="bg-white/95 backdrop-blur-xl rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white/60 p-8 mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">💰</span>
                <h2 className="text-2xl font-black text-[#E30613] drop-shadow-sm">Grille Tarifaire</h2>
              </div>
              <p className="text-sm text-gray-600 mb-8 font-medium">Définissez ici le prix de chaque prestation. Ce prix sera automatiquement calculé lors de la réservation du client.</p>
              
              <div className="grid md:grid-cols-2 gap-5">
                {servicesList.map((srv) => (
                  <div key={srv.value} className="bg-gray-50/80 backdrop-blur-sm p-5 rounded-2xl border border-gray-200/80 flex flex-col gap-4 justify-between hover:border-[#43A047]/40 hover:shadow-md transition-all">
                    <p className="font-black text-gray-900 text-sm leading-snug">{srv.label}</p>
                    
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <input 
                          type="number" 
                          placeholder="89.00"
                          value={prixInputs[srv.value] || ''}
                          onChange={(e) => setPrixInputs({...prixInputs, [srv.value]: e.target.value})}
                          className="w-full border-2 border-gray-200 rounded-xl p-3 pr-10 outline-none focus:border-[#43A047] focus:bg-white font-black text-xl text-gray-900 bg-white/80 backdrop-blur-sm shadow-inner transition-colors"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-black">€</span>
                      </div>
                      
                      <button 
                        onClick={() => handleUpdateTarif(srv.value)}
                        disabled={loadingTarif === srv.value}
                        className="bg-[#1A1A1A] hover:bg-[#43A047] text-white px-5 py-3.5 rounded-xl font-black transition-colors shadow-md disabled:opacity-50 whitespace-nowrap"
                      >
                        {loadingTarif === srv.value ? '...' : 'Sauver'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-5 bg-orange-50 border border-orange-200 rounded-2xl shadow-inner">
                <p className="text-xs font-black text-orange-800 text-center uppercase tracking-wider leading-relaxed">
                  ⚠️ N'oubliez pas de cliquer sur "Sauver" pour chaque prix modifié.<br/>Si un prix n'est pas défini ici, le système utilisera le prix par défaut (89€).
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}