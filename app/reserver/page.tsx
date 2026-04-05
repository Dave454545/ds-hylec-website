"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Reserver() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // États pour les demandes de l'entreprise
  const [typeClient, setTypeClient] = useState('PARTICULIER'); 
  const [problemes, setProblemes] = useState<string[]>([]);

  // États classiques
  const [service, setService] = useState('');
  const [vehicle, setVehicle] = useState({ marque: '', modele: '', annee: '', carburant: '' });
  const [dateTime, setDateTime] = useState({ date: '', time: '' });
  const [client, setClient] = useState({ fullName: '', tel: '', email: '', adresse: '' });
  const [payment, setPayment] = useState('');
  const [codeParrain, setCodeParrain] = useState('');

  // États pour la gestion des créneaux
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // États pour l'autocomplétion
  const [showBrands, setShowBrands] = useState(false);
  const [showModels, setShowModels] = useState(false);
  const [showAddresses, setShowAddresses] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const serviceFromUrl = params.get('service');
      if (serviceFromUrl) {
        setService(serviceFromUrl);
        setStep(2);
      }
    }
  }, []);

  // Base de données des Marques et Modèles
  const marquesVoitures = [
    "Abarth", "Alfa Romeo", "Audi", "BMW", "Citroën", "Cupra", "Dacia", "DS Automobiles", 
    "Fiat", "Ford", "Honda", "Hyundai", "Jeep", "Kia", "Land Rover", "Lexus", "Mazda", 
    "Mercedes-Benz", "MG", "Mini", "Nissan", "Opel", "Peugeot", "Porsche", "Renault", 
    "Seat", "Skoda", "Smart", "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo"
  ];

  const modelesParMarque: Record<string, string[]> = {
    "Peugeot": ["208", "308", "2008", "3008", "508", "5008", "Partner", "Expert", "Traveller", "108", "Rifter", "Boxer"],
    "Renault": ["Clio", "Megane", "Captur", "Twingo", "Kangoo", "Arkana", "Zoe", "Kadjar", "Scenic", "Espace", "Trafic", "Master", "Austral"],
    "Citroën": ["C3", "C4", "C3 Aircross", "C5 Aircross", "Berlingo", "C4 Cactus", "C1", "SpaceTourer", "Jumpy", "Jumper", "Ami"],
    "Volkswagen": ["Golf", "Polo", "Tiguan", "Passat", "T-Roc", "T-Cross", "Up!", "Touran", "ID.3", "ID.4", "Touareg", "Transporter", "Caddy"],
    "Audi": ["A1", "A3", "A4", "A5", "A6", "Q2", "Q3", "Q5", "Q7", "Q8", "e-tron"],
    "BMW": ["Série 1", "Série 2", "Série 3", "Série 4", "Série 5", "X1", "X2", "X3", "X4", "X5", "i3", "i4"],
    "Mercedes-Benz": ["Classe A", "Classe B", "Classe C", "Classe E", "GLA", "GLB", "GLC", "GLE", "Vito", "Sprinter", "EQA"],
    "Toyota": ["Yaris", "Corolla", "Aygo", "C-HR", "RAV4", "Prius", "Auris", "Camry", "Yaris Cross"],
    "Ford": ["Fiesta", "Focus", "Puma", "Kuga", "Mustang Mach-E", "Transit", "Tourneo", "Ecosport"],
    "Dacia": ["Sandero", "Duster", "Spring", "Jogger", "Logan", "Dokker"],
    "Fiat": ["500", "500X", "Panda", "Tipo", "Ducato", "Fiorino", "Talento"],
    "Kia": ["Picanto", "Rio", "Sportage", "Niro", "Ceed", "EV6", "Stonic"],
    "Hyundai": ["i10", "i20", "i30", "Tucson", "Kona", "Ioniq 5", "Santa Fe"],
    "Nissan": ["Micra", "Juke", "Qashqai", "Leaf", "X-Trail"],
    "Opel": ["Corsa", "Astra", "Mokka", "Crossland", "Grandland", "Vivaro"],
    "Seat": ["Ibiza", "Leon", "Arona", "Ateca", "Tarraco"],
    "Skoda": ["Fabia", "Octavia", "Kamiq", "Karoq", "Kodiaq", "Superb"],
    "Tesla": ["Model 3", "Model Y", "Model S", "Model X"],
    "Volvo": ["XC40", "XC60", "XC90", "V40", "V60"],
    "DS Automobiles": ["DS 3", "DS 3 Crossback", "DS 4", "DS 7 Crossback", "DS 9"]
  };

  const getModelSuggestions = () => {
    const baseList = (vehicle.marque && modelesParMarque[vehicle.marque]) 
      ? modelesParMarque[vehicle.marque] 
      : Object.values(modelesParMarque).flat();
      
    return baseList.filter(m => m.toLowerCase().includes(vehicle.modele.toLowerCase()));
  };

  const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setClient({ ...client, adresse: val });
    
    if (val.length > 3) {
      try {
        const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(val)}&limit=5`);
        const data = await res.json();
        setAddressSuggestions(data.features.map((f: any) => f.properties.label));
        setShowAddresses(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      setShowAddresses(false);
    }
  };

  useEffect(() => {
    if (!dateTime.date) {
      setAvailableSlots([]);
      setDateTime(prev => ({ ...prev, time: '' }));
      return;
    }

    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const res = await fetch(`/api/disponibilites?date=${dateTime.date}`);
        const data = await res.json();
        if (res.ok) {
          setAvailableSlots(data.slots || []);
          if (!data.slots.includes(dateTime.time)) {
            setDateTime(prev => ({ ...prev, time: '' }));
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des créneaux", error);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [dateTime.date, dateTime.time]);

  const servicesList = [
    { label: "Diagnostic électronique complet", value: "DIAGNOSTIC_ELECTRONIQUE", desc: "Analyse complète de votre véhicule avec valise professionnelle. Lecture des codes défaut, effacement des voyants et explication claire de la panne." },
    { label: "Décalaminage moteur hydrogène", value: "DECALAMINAGE_MOTEUR", desc: "Nettoyage interne du moteur. Élimine la calamine, améliore les performances, réduit la consommation et facilite le passage au contrôle technique." },
    { label: "Régénération FAP", value: "REGENERATION_FAP", desc: "Nettoyage de votre Filtre À Particules encrassé via une régénération forcée au diagnostic. Évite un remplacement très coûteux." },
    { label: "Nettoyage vanne EGR / admission", value: "NETTOYAGE_EGR", desc: "Nettoyage ciblé du système d'admission et de la vanne EGR pour retrouver de la puissance et diminuer les fumées noires." },
    { label: "Diagnostic système hybride", value: "DIAGNOSTIC_HYBRIDE", desc: "Contrôle spécifique du système hybride (haute tension, onduleur, cellules) pour s'assurer du bon fonctionnement électrique." },
    { label: "Test batterie hybride", value: "TEST_BATTERIE_HYBRIDE", desc: "Analyse de l'état de santé réel (SOH) de votre batterie hybride. Idéal pour anticiper une défaillance ou avant un achat/revente." },
    { label: "Nettoyage refroidissement hybride", value: "NETTOYAGE_REFROIDISSEMENT_HYBRIDE", desc: "Démontage et nettoyage du ventilateur et du filtre de refroidissement de la batterie haute tension pour éviter la surchauffe." },
    { label: "Pack hybride complet", value: "PACK_HYBRIDE_COMPLET", desc: "Le service ultime : Diagnostic hybride + Test de la batterie + Nettoyage complet du système de refroidissement." }
  ];

  const problemesList = [
    "Voyant moteur", "Perte de puissance", "Fumée noire", "Consommation élevée", "Problème hybride"
  ];

  const fuelTypes = [
    { label: "Essence", value: "ESSENCE" },
    { label: "Diesel", value: "DIESEL" },
    { label: "Hybride", value: "HYBRIDE" },
    { label: "Électrique", value: "ELECTRIQUE" }
  ];

  const toggleProbleme = (prob: string) => {
    if (problemes.includes(prob)) setProblemes(problemes.filter(p => p !== prob));
    else setProblemes([...problemes, prob]);
  };

  const handleConfirm = async () => {
    setLoading(true);
    const names = client.fullName.split(' ');
    const prenom = names[0];
    const nom = names.slice(1).join(' ') || ' ';

    const payload = {
      ...client, nom, prenom, typeClient, ...vehicle, problemes, service,
      date: `${dateTime.date}T${dateTime.time}:00`,
      moyenPaiement: payment === 'en_ligne' ? 'EN_LIGNE' : 'SUR_PLACE',
      codeParrainSaisi: codeParrain || null 
    };

    try {
      const res = await fetch('/api/reserver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/'), 3000);
      } else alert("Erreur lors de la réservation.");
    } catch (error) {
      console.error("Erreur de réservation:", error);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (success) {
    return (
      <main className="relative min-h-screen flex items-center justify-center overflow-hidden p-4 sm:p-6 text-center selection:bg-[#43A047] selection:text-white">
        <video autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover -z-50 scale-105">
          <source src="/dshylec1.mp4" type="video/mp4" />
        </video>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] -z-40" />

        <div className="animate-in zoom-in duration-500 bg-white/90 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-white/50 max-w-lg w-full mx-4">
          <span className="text-5xl sm:text-6xl mb-6 block drop-shadow-md">🌿</span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#E30613] mb-4">C'est confirmé !</h1>
          <p className="text-sm sm:text-base text-gray-700 mb-8 font-medium leading-relaxed">
            Votre rendez-vous a été enregistré. Un compte client a été créé automatiquement pour vous. Vérifiez vos emails !
          </p>
          <div className="inline-block px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-[#43A047] to-[#2E7D32] text-white rounded-full font-bold shadow-lg text-sm sm:text-base">
            Redirection vers l'accueil...
          </div>
        </div>
      </main>
    );
  }

  return (
    // FIX MAJEUR: w-full max-w-[100vw] overflow-x-hidden empêche le débordement horizontal
    <main className="relative min-h-screen w-full max-w-[100vw] overflow-x-hidden font-sans selection:bg-[#43A047] selection:text-white pb-20">
      
      <video 
        autoPlay loop muted playsInline 
        className="fixed inset-0 w-full h-full object-cover -z-50 scale-105"
      >
        <source src="/dshylec1.mp4" type="video/mp4" />
      </video>

      <div className="fixed inset-0 bg-black/30 backdrop-blur-[6px] -z-40" />
      <div className="fixed top-1/4 -left-20 w-96 h-96 bg-[#E30613]/40 rounded-full blur-[120px] -z-30 animate-pulse" />
      <div className="fixed bottom-1/4 -right-20 w-96 h-96 bg-[#43A047]/40 rounded-full blur-[120px] -z-30 animate-pulse" style={{ animationDelay: '2s' }} />

      <nav className="fixed w-full bg-white/80 backdrop-blur-xl z-50 border-b border-white/50 shadow-sm transition-all duration-300">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="text-gray-900 font-bold text-xs sm:text-sm hover:text-[#E30613] transition bg-white/60 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-gray-200 shadow-sm">
            ← Retour
          </Link>
          <div className="relative h-12 w-28 sm:h-16 sm:w-36">
            <Image src="/ds_hylec_logo.png" alt="DS HY'LEC Logo" fill className="object-contain" priority />
          </div>
        </div>
      </nav>

      {/* FIX CONTENEUR: px-3 pour plus d'espace sur les bords mobiles */}
      <div className="w-full max-w-xl mx-auto px-3 sm:px-4 pt-28 sm:pt-32 relative z-10 box-border">
        {/* FIX CARD: p-5 sur mobile au lieu de p-10 */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl p-5 sm:p-10 border border-white/60 w-full box-border">
          
          <div className="flex justify-between mb-8 sm:mb-10 px-2 sm:px-0">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-xs sm:text-sm transition-all duration-500 ${step >= num ? 'bg-gradient-to-br from-[#E30613] to-[#B3050F] text-white shadow-lg shadow-[#E30613]/30 scale-110' : 'bg-white/50 border-2 border-gray-200 text-gray-400'}`}>
                {num}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 w-full">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 sm:mb-8 drop-shadow-sm text-center sm:text-left">De quoi avez-vous besoin ?</h2>
              <div className="flex flex-col gap-3 sm:gap-4 h-[350px] sm:h-[420px] overflow-y-auto pr-1 sm:pr-2 hide-scrollbar pb-8">
                {servicesList.map((item) => (
                  <div key={item.value} className="flex flex-col">
                    <button 
                      onClick={() => setService(item.value)} 
                      className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all text-left font-bold text-sm sm:text-base ${service === item.value ? 'border-[#E30613] bg-[#E30613]/10 text-[#E30613] shadow-md' : 'border-transparent bg-gray-50/80 text-gray-700 hover:border-[#E30613]/30 hover:bg-white'}`}
                    >
                      {item.label}
                    </button>
                    {service === item.value && (
                      <div className="animate-in slide-in-from-top-2 duration-300 mt-2 p-4 sm:p-5 bg-white border border-[#E30613]/20 rounded-xl shadow-sm text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                        <span className="font-black text-[#E30613] block mb-1 sm:mb-2">Détail de la prestation :</span>
                        {item.desc}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(2)} disabled={!service} className="mt-6 sm:mt-8 w-full py-3.5 sm:py-4 rounded-xl font-black text-base sm:text-lg bg-[#E30613] text-white disabled:opacity-30 hover:bg-[#B3050F] hover:shadow-lg transition-all shadow-[#E30613]/20">Continuer</button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in slide-in-from-right-4 duration-500 w-full">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-5 sm:mb-6 drop-shadow-sm text-center sm:text-left">Le Véhicule</h2>
              
              {/* FIX MAJEUR: flex-col sur mobile, flex-row sur PC. Fini le texte coupé ! */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
                <div className="relative w-full">
                  <input 
                    type="text" 
                    placeholder="Marque (ex: Peugeot)" 
                    value={vehicle.marque} 
                    onChange={(e) => { setVehicle({...vehicle, marque: e.target.value}); setShowBrands(true); }}
                    onFocus={() => setShowBrands(true)}
                    onBlur={() => setTimeout(() => setShowBrands(false), 200)}
                    className="w-full box-border border-2 border-white/80 rounded-xl p-3.5 sm:p-4 bg-gray-50/80 backdrop-blur-sm outline-none focus:border-[#E30613] focus:bg-white transition-colors font-bold text-gray-800 text-sm sm:text-base shadow-inner" 
                  />
                  {showBrands && vehicle.marque.length > 0 && (
                    <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-xl max-h-48 overflow-y-auto hide-scrollbar">
                      {marquesVoitures.filter(m => m.toLowerCase().includes(vehicle.marque.toLowerCase())).map(marque => (
                        <div key={marque} onClick={() => { setVehicle({...vehicle, marque: marque}); setShowBrands(false); }} className="p-3 sm:p-4 hover:bg-red-50 hover:text-[#E30613] cursor-pointer font-bold text-gray-700 text-xs sm:text-sm border-b border-gray-50 transition-colors">
                          {marque}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative w-full">
                  <input 
                    type="text" 
                    placeholder="Modèle (ex: 208)" 
                    value={vehicle.modele} 
                    onChange={(e) => { setVehicle({...vehicle, modele: e.target.value}); setShowModels(true); }}
                    onFocus={() => setShowModels(true)}
                    onBlur={() => setTimeout(() => setShowModels(false), 200)}
                    className="w-full box-border border-2 border-white/80 rounded-xl p-3.5 sm:p-4 bg-gray-50/80 backdrop-blur-sm outline-none focus:border-[#E30613] focus:bg-white transition-colors font-bold text-gray-800 text-sm sm:text-base shadow-inner" 
                  />
                  {showModels && vehicle.modele.length > 0 && (
                    <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-xl max-h-48 overflow-y-auto hide-scrollbar">
                      {getModelSuggestions().map(mod => (
                        <div key={mod} onClick={() => { setVehicle({...vehicle, modele: mod}); setShowModels(false); }} className="p-3 sm:p-4 hover:bg-red-50 hover:text-[#E30613] cursor-pointer font-bold text-gray-700 text-xs sm:text-sm border-b border-gray-50 transition-colors">
                          {mod}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* FIX CARBURANT: Textes plus petits sur mobile (text-[11px]) pour ne pas déborder */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
                {fuelTypes.map((fuel) => (
                  <button key={fuel.value} onClick={() => setVehicle({...vehicle, carburant: fuel.value})} className={`p-3 sm:p-4 rounded-xl border-2 text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all break-words ${vehicle.carburant === fuel.value ? 'border-[#E30613] bg-[#E30613] text-white shadow-md' : 'bg-gray-50/80 text-gray-500 border-transparent hover:border-gray-300 hover:bg-white'}`}>
                    {fuel.label}
                  </button>
                ))}
              </div>

              <h3 className="font-bold text-gray-700 mb-3 text-sm sm:text-base">Quel problème a votre voiture ? (Optionnel)</h3>
              <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
                {problemesList.map(prob => (
                  <button key={prob} onClick={() => toggleProbleme(prob)} className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-full border-2 text-xs sm:text-sm font-bold transition-all shadow-sm ${problemes.includes(prob) ? 'border-[#E30613] bg-[#E30613]/10 text-[#E30613]' : 'border-gray-200 text-gray-500 bg-white hover:border-[#E30613]/40'}`}>
                    {prob}
                  </button>
                ))}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 sm:mb-6 drop-shadow-sm text-center sm:text-left">Date & Heure</h2>
              
              {/* FIX DATE: box-border indispensable */}
              <div className="mb-6">
                <input type="date" min={today} value={dateTime.date} onChange={(e) => setDateTime({...dateTime, date: e.target.value})} className="w-full box-border border-2 border-white/80 rounded-xl p-3.5 sm:p-4 bg-gray-50/80 backdrop-blur-sm outline-none focus:border-[#E30613] focus:bg-white font-bold text-gray-800 text-sm sm:text-base shadow-inner transition-colors" />
              </div>

              {dateTime.date && (
                <div className="mb-6 sm:mb-8">
                  <label className="block text-xs sm:text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">Vos disponibilités à domicile</label>
                  {loadingSlots ? (
                    <div className="text-center py-6 text-gray-400 font-bold text-sm sm:text-base animate-pulse bg-gray-50 rounded-xl">Recherche des disponibilités...</div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                      {availableSlots.map(slot => (
                        <button
                          key={slot}
                          onClick={() => setDateTime({...dateTime, time: slot})}
                          className={`py-3 sm:py-3.5 rounded-xl font-black text-xs sm:text-sm border-2 transition-all shadow-sm ${dateTime.time === slot ? 'bg-[#E30613] text-white border-[#E30613] scale-105' : 'bg-white text-gray-600 border-gray-200 hover:border-[#E30613]/50'}`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-100 text-[#E30613] p-4 sm:p-5 rounded-xl text-center font-bold text-xs sm:text-sm">
                      Mince ! Aucun créneau disponible à cette date.
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8">
                <button onClick={() => setStep(1)} className="py-3.5 sm:py-4 bg-gray-100/80 rounded-xl flex-1 font-bold text-sm sm:text-base text-gray-500 hover:bg-gray-200 transition-colors">Retour</button>
                <button onClick={() => setStep(3)} disabled={!vehicle.marque || !dateTime.date || !dateTime.time} className="py-3.5 sm:py-4 bg-[#E30613] hover:bg-[#B3050F] transition-all rounded-xl flex-[2] font-black text-sm sm:text-lg text-white disabled:opacity-30 shadow-lg shadow-[#E30613]/20">Suivant</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in slide-in-from-right-4 duration-500 w-full">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-5 sm:mb-6 drop-shadow-sm text-center sm:text-left">Vos Coordonnées</h2>
              
              {/* FIX TYPE CLIENT: flex-col sur petit mobile */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                <button onClick={() => setTypeClient('PARTICULIER')} className={`flex-1 py-3.5 sm:py-4 rounded-xl border-2 font-black text-xs sm:text-sm uppercase tracking-wider transition-all ${typeClient === 'PARTICULIER' ? 'border-[#E30613] bg-[#E30613]/10 text-[#E30613] shadow-inner' : 'border-transparent text-gray-500 bg-gray-50/80 hover:border-gray-200 hover:bg-white'}`}>Particulier</button>
                <button onClick={() => setTypeClient('PROFESSIONNEL')} className={`flex-1 py-3.5 sm:py-4 rounded-xl border-2 font-black text-xs sm:text-sm uppercase tracking-wider transition-all ${typeClient === 'PROFESSIONNEL' ? 'border-[#E30613] bg-[#E30613]/10 text-[#E30613] shadow-inner' : 'border-transparent text-gray-500 bg-gray-50/80 hover:border-gray-200 hover:bg-white'}`}>Pro (Taxi, VTC...)</button>
              </div>

              <div className="space-y-4 sm:space-y-5 mb-8 sm:mb-10">
                <input type="text" placeholder="Nom & Prénom" value={client.fullName} onChange={(e) => setClient({...client, fullName: e.target.value})} className="w-full box-border border-2 border-white/80 rounded-xl p-3.5 sm:p-4 bg-gray-50/80 backdrop-blur-sm outline-none focus:border-[#E30613] focus:bg-white font-bold text-gray-800 text-sm sm:text-base shadow-inner transition-colors" />
                <input type="tel" placeholder="Téléphone" value={client.tel} onChange={(e) => setClient({...client, tel: e.target.value})} className="w-full box-border border-2 border-white/80 rounded-xl p-3.5 sm:p-4 bg-gray-50/80 backdrop-blur-sm outline-none focus:border-[#E30613] focus:bg-white font-bold text-gray-800 text-sm sm:text-base shadow-inner transition-colors" />
                <input type="email" placeholder="Email (facture & compte)" value={client.email} onChange={(e) => setClient({...client, email: e.target.value})} className="w-full box-border border-2 border-white/80 rounded-xl p-3.5 sm:p-4 bg-gray-50/80 backdrop-blur-sm outline-none focus:border-[#E30613] focus:bg-white font-bold text-gray-800 text-sm sm:text-base shadow-inner transition-colors" />
                
                <div className="relative w-full">
                  <input 
                    type="text" 
                    placeholder="Adresse d'intervention (ex: 12 rue de Paris)" 
                    value={client.adresse} 
                    onChange={handleAddressChange}
                    onFocus={() => setShowAddresses(true)}
                    onBlur={() => setTimeout(() => setShowAddresses(false), 200)} 
                    className="w-full box-border border-2 border-white/80 rounded-xl p-3.5 sm:p-4 bg-gray-50/80 backdrop-blur-sm outline-none focus:border-[#E30613] focus:bg-white font-bold text-gray-800 text-sm sm:text-base shadow-inner transition-colors" 
                  />
                  {showAddresses && addressSuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-xl max-h-48 overflow-y-auto hide-scrollbar">
                      {addressSuggestions.map((addr, index) => (
                        <div key={index} onClick={() => { setClient({...client, adresse: addr}); setShowAddresses(false); }} className="p-3 sm:p-4 hover:bg-red-50 hover:text-[#E30613] cursor-pointer font-bold text-gray-700 text-xs sm:text-sm border-b border-gray-50 transition-colors">
                          📍 {addr}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3 sm:gap-4">
                <button onClick={() => setStep(2)} className="py-3.5 sm:py-4 bg-gray-100/80 rounded-xl flex-1 font-bold text-sm sm:text-base text-gray-500 hover:bg-gray-200 transition-colors">Retour</button>
                <button onClick={() => setStep(4)} disabled={!client.email || !client.adresse} className="py-3.5 sm:py-4 bg-[#E30613] hover:bg-[#B3050F] transition-all rounded-xl flex-[2] font-black text-sm sm:text-lg text-white disabled:opacity-30 shadow-lg shadow-[#E30613]/20">Récapitulatif</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in slide-in-from-right-4 duration-500 w-full">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-5 sm:mb-6 drop-shadow-sm text-center sm:text-left">Paiement</h2>
              
              <div className="mb-6 sm:mb-8">
                <label className="block text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 sm:mb-3 ml-1">Avez-vous un code parrain ? (Optionnel)</label>
                <input type="text" placeholder="Ex: AMIGO10" value={codeParrain} onChange={(e) => setCodeParrain(e.target.value.toUpperCase())} className="w-full box-border border-2 border-white/80 rounded-xl p-3.5 sm:p-4 bg-gray-50/80 backdrop-blur-sm outline-none focus:border-[#43A047] focus:bg-white font-black text-gray-800 text-sm sm:text-base tracking-widest shadow-inner transition-colors" />
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6 rounded-2xl mb-6 sm:mb-8 border border-gray-100 shadow-sm space-y-3">
                <p className="text-xs sm:text-sm flex justify-between items-center"><span className="text-gray-500 font-medium">Service :</span> <span className="font-black text-[#E30613] uppercase text-[10px] sm:text-xs text-right max-w-[60%]">{service.replace(/_/g, ' ')}</span></p>
                <div className="h-px w-full bg-gray-100" />
                <p className="text-xs sm:text-sm flex justify-between items-center"><span className="text-gray-500 font-medium">Véhicule :</span> <span className="font-bold text-gray-800 text-right">{vehicle.marque} {vehicle.modele} <span className="text-gray-400 text-[10px] sm:text-xs block sm:inline">({vehicle.carburant})</span></span></p>
                <div className="h-px w-full bg-gray-100" />
                <p className="text-xs sm:text-sm flex justify-between items-center"><span className="text-gray-500 font-medium">Date :</span> <span className="font-bold text-gray-800 text-right">{new Date(dateTime.date).toLocaleDateString('fr-FR')} à {dateTime.time}</span></p>
              </div>

              <div className="flex flex-col gap-3 sm:gap-4 mb-8 sm:mb-10">
                <button onClick={() => setPayment('en_ligne')} className={`flex items-center p-4 sm:p-5 rounded-2xl border-2 transition-all ${payment === 'en_ligne' ? 'border-[#43A047] bg-[#43A047]/5 shadow-md scale-[1.02]' : 'border-transparent bg-gray-50/80 hover:border-gray-200 hover:bg-white'}`}>
                  <span className="text-2xl sm:text-3xl mr-4 sm:mr-5">💳</span>
                  <div>
                    <p className="font-black text-gray-900 text-left text-base sm:text-lg">Payer en ligne</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium text-left">Sécurisé via Stripe</p>
                  </div>
                </button>
                <button onClick={() => setPayment('sur_place')} className={`flex items-center p-4 sm:p-5 rounded-2xl border-2 transition-all ${payment === 'sur_place' ? 'border-[#43A047] bg-[#43A047]/5 shadow-md scale-[1.02]' : 'border-transparent bg-gray-50/80 hover:border-gray-200 hover:bg-white'}`}>
                  <span className="text-2xl sm:text-3xl mr-4 sm:mr-5">🤝</span>
                  <div>
                    <p className="font-black text-gray-900 text-left text-base sm:text-lg">Payer sur place</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium text-left">Espèces ou CB le jour J</p>
                  </div>
                </button>
              </div>
              
              <div className="flex gap-3 sm:gap-4">
                <button onClick={() => setStep(3)} className="py-3.5 sm:py-4 bg-gray-100/80 rounded-xl flex-1 font-bold text-sm sm:text-base text-gray-500 hover:bg-gray-200 transition-colors">Retour</button>
                <button onClick={handleConfirm} disabled={!payment || loading} className="py-3.5 sm:py-4 bg-gradient-to-r from-[#43A047] to-[#2E7D32] hover:shadow-xl hover:-translate-y-0.5 transition-all rounded-xl flex-[2] font-black text-sm sm:text-lg text-white shadow-lg shadow-[#43A047]/30 disabled:opacity-50 disabled:hover:translate-y-0">
                  {loading ? 'Envoi...' : 'Confirmer'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}