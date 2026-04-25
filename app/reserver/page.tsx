"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// ── Helpers ──────────────────────────────────────────────────────────────────
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isValidTel   = (v: string) => /^(\+?\d[\d\s\-().]{7,})$/.test(v.trim());

export default function Reserver() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ── Validation states ────────────────────────────────────────────────────
  const [emailTouched, setEmailTouched] = useState(false);
  const [telTouched,   setTelTouched]   = useState(false);

  // États pour les demandes de l'entreprise
  const [typeClient, setTypeClient] = useState('PARTICULIER'); 
  const [problemes, setProblemes] = useState<string[]>([]);

  // États classiques
  const [services, setServices] = useState<string[]>([]);
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
        setServices([serviceFromUrl]);
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
    { label: "Diagnostic électronique complet", value: "DIAGNOSTIC_ELECTRONIQUE", img: "/diagnostic electric complet.jpeg", desc: "Analyse complète de votre véhicule avec valise professionnelle. Lecture des codes défaut, effacement des voyants et explication claire de la panne." },
    { label: "Décalaminage moteur hydrogène", value: "DECALAMINAGE_MOTEUR", img: "/Decalaminage.jpeg", desc: "Nettoyage interne du moteur. Élimine la calamine, améliore les performances, réduit la consommation et facilite le passage au contrôle technique." },
    { label: "Régénération FAP", value: "REGENERATION_FAP", img: "/Regeneration FAP.jpeg", desc: "Nettoyage du filtre à particules encrassé. Régénération forcée via outil de diagnostic pour brûler les suies." },
    { label: "Débouchage du filtre à particules (FAP)", value: "DEBOUCHAGE_FAP", img: "/Débouchage du filtre a particules.jpg", desc: "Traitement des filtres fortement encrassés par injection de produit nettoyant et rinçage en profondeur." },
    { label: "Diagnostic système hybride", value: "DIAGNOSTIC_HYBRIDE", img: "/diagnostic systeme hybride.jpeg", desc: "Contrôle spécifique du système hybride (haute tension, onduleur, cellules) pour s'assurer du bon fonctionnement électrique." },
    { label: "Test batterie hybride", value: "TEST_BATTERIE_HYBRIDE", img: "/test de batterie hybride.jpeg", desc: "Analyse de l'état de santé réel (SOH) de votre batterie hybride. Idéal pour anticiper une défaillance ou avant un achat/revente." },
    { label: "Entretien du système hybride", value: "NETTOYAGE_REFROIDISSEMENT_HYBRIDE", img: "/Entretien du systeme hybride.jpg", desc: "Préservation des performances du système hybride : ventilateur batterie, conduits d'air et composants de refroidissement." },
    { label: "Pack hybride complet", value: "PACK_HYBRIDE_COMPLET", img: "/diagnostic systeme hybride.jpeg", desc: "Le service ultime : Diagnostic hybride + Test de la batterie + Nettoyage complet du système de refroidissement." }
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
      ...client, nom, prenom, typeClient, ...vehicle, problemes,
      services,
      service: services[0] || '',
      date: `${dateTime.date}T${dateTime.time}:00`,
      moyenPaiement: 'SUR_PLACE',
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

  // ── Helpers navigation ────────────────────────────────────────────────────
  const goNext = (n: number) => { setDirection('forward'); setStep(n); };
  const goBack = (n: number) => { setDirection('back');    setStep(n); };

  const stepAnim = direction === 'forward'
    ? 'animate-in fade-in slide-in-from-right-4 duration-400'
    : 'animate-in fade-in slide-in-from-left-4 duration-400';

  // ── Validation classes ────────────────────────────────────────────────────
  const emailBorder = !emailTouched ? 'border-white/80'
    : isValidEmail(client.email) ? 'border-green-400' : 'border-red-400';
  const telBorder = !telTouched ? 'border-white/80'
    : isValidTel(client.tel) ? 'border-green-400' : 'border-red-400';

  if (success) {
    return (
      <main className="relative min-h-screen flex items-center justify-center overflow-hidden p-4 sm:p-6 text-center selection:bg-[#43A047] selection:text-white">
        <video autoPlay loop muted playsInline preload="none" className="fixed inset-0 w-full h-full object-cover -z-50 scale-105">
          <source src="/dshylec1 compress.mp4" type="video/mp4" />
        </video>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] -z-40" />

        <div className="animate-in zoom-in duration-500 bg-white/90 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-white/50 max-w-lg w-full mx-4">
          {/* Checkmark animé */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-[#43A047]/10 flex items-center justify-center">
              <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="22" stroke="#43A047" strokeWidth="3" opacity="0.3" />
                <polyline
                  points="12,25 20,33 36,16"
                  stroke="#43A047"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-draw-check"
                />
              </svg>
            </div>
          </div>
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
    <main className="relative min-h-screen w-full max-w-[100vw] overflow-x-hidden font-sans selection:bg-[#43A047] selection:text-white">
      
      <video
        autoPlay loop muted playsInline preload="none"
        className="fixed inset-0 w-full h-full object-cover -z-50 scale-105"
      >
        <source src="/dshylec1 compress.mp4" type="video/mp4" />
      </video>

      <div className="fixed inset-0 bg-black/30 backdrop-blur-[6px] -z-40" />
      <div className="fixed top-1/4 -left-20 w-96 h-96 bg-[#E30613]/40 rounded-full blur-[120px] -z-30 animate-pulse" />
      <div className="fixed bottom-1/4 -right-20 w-96 h-96 bg-[#43A047]/40 rounded-full blur-[120px] -z-30 animate-pulse" style={{ animationDelay: '2s' }} />

      <nav className="fixed w-full bg-white/80 backdrop-blur-xl z-50 border-b border-white/50 shadow-sm transition-all duration-300 nav-safe-top">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="text-gray-900 font-bold text-xs sm:text-sm hover:text-[#E30613] transition bg-white/60 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-gray-200 shadow-sm">
            ← Retour
          </Link>
          <div className="relative h-16 w-auto sm:h-16">
            <Image src="/logo-ds_hylec_neuf.webp" alt="DS HY'LEC Logo" width={144} height={64} className="h-16 w-auto object-contain" priority />
          </div>
        </div>
      </nav>

      <div className="w-full max-w-xl mx-auto px-3 sm:px-4 pt-28 sm:pt-32 relative z-10 box-border">
        <div className="bg-white/90 backdrop-blur-2xl rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl p-5 sm:p-10 border border-white/60 w-full box-border">
          
          {/* Progress bar */}
          <div className="mb-6 sm:mb-8">
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-[#E30613] to-[#B3050F] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
            <div className="flex justify-between px-1 sm:px-0">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-xs sm:text-sm transition-all duration-500 ${step >= num ? 'bg-gradient-to-br from-[#E30613] to-[#B3050F] text-white shadow-lg shadow-[#E30613]/30 scale-110' : 'bg-white/50 border-2 border-gray-200 text-gray-400'}`}>
                  {num}
                </div>
              ))}
            </div>
          </div>

          {/* ÉTAPE 1 */}
          {step === 1 && (
            <div className={`${stepAnim} w-full`}>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 drop-shadow-sm text-center sm:text-left">Quel(s) service(s) ?</h2>
              <p className="text-xs text-gray-400 font-medium mb-4 text-center sm:text-left">Vous pouvez sélectionner plusieurs services</p>
              <div className="flex flex-col gap-3 h-[380px] sm:h-[440px] overflow-y-auto pr-1 hide-scrollbar pb-8">
                {servicesList.map((item) => {
                  const selected = services.includes(item.value);
                  return (
                    <div
                      key={item.value}
                      onClick={() => {
                        if (selected) setServices(services.filter(s => s !== item.value));
                        else setServices([...services, item.value]);
                      }}
                      className={`relative flex items-center gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all cursor-pointer select-none
                        ${selected ? 'border-[#E30613] bg-[#E30613]/8 shadow-md' : 'border-transparent bg-gray-50/80 hover:border-[#E30613]/30 hover:bg-white'}`}
                    >
                      {/* Checkmark */}
                      {selected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shrink-0 shadow">
                          <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
                            <polyline points="3,8 6,11 13,4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}
                      {/* Image */}
                      <img src={item.img} alt={item.label} className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg shrink-0" />
                      {/* Text */}
                      <div className="flex-1 min-w-0 pr-5">
                        <div className={`font-bold text-sm sm:text-base leading-tight ${selected ? 'text-[#E30613]' : 'text-gray-800'}`}>{item.label}</div>
                        <div className="text-[11px] sm:text-xs text-gray-500 mt-0.5 line-clamp-2 font-medium">{item.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {services.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {services.map(s => (
                    <span key={s} className="inline-flex items-center gap-1 bg-[#E30613]/10 text-[#E30613] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#E30613]/20">
                      {servicesList.find(i => i.value === s)?.label ?? s}
                    </span>
                  ))}
                </div>
              )}
              <button onClick={() => goNext(2)} disabled={services.length === 0} className="mt-4 sm:mt-6 w-full py-3.5 sm:py-4 rounded-xl font-black text-base sm:text-lg bg-[#E30613] text-white disabled:opacity-30 hover:bg-[#B3050F] active:scale-[0.97] hover:shadow-lg transition-all shadow-[#E30613]/20">
                Continuer {services.length > 0 && `(${services.length} service${services.length > 1 ? 's' : ''})`}
              </button>
            </div>
          )}

          {/* ÉTAPE 2 */}
          {step === 2 && (
            <div className={`${stepAnim} w-full max-w-full overflow-hidden`}>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-5 sm:mb-6 drop-shadow-sm text-center sm:text-left">Le Véhicule</h2>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Marque"
                    value={vehicle.marque}
                    onChange={(e) => { setVehicle({...vehicle, marque: e.target.value}); setShowBrands(true); }}
                    onFocus={() => setShowBrands(true)}
                    onBlur={() => setTimeout(() => setShowBrands(false), 200)}
                    className="w-full box-border border-2 border-white/80 rounded-xl p-3.5 sm:p-4 bg-gray-50/80 backdrop-blur-sm outline-none focus:border-[#E30613] focus:bg-white transition-colors font-bold text-gray-800 text-sm sm:text-base shadow-inner appearance-none"
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
                    placeholder="Modèle"
                    value={vehicle.modele}
                    onChange={(e) => { setVehicle({...vehicle, modele: e.target.value}); setShowModels(true); }}
                    onFocus={() => setShowModels(true)}
                    onBlur={() => setTimeout(() => setShowModels(false), 200)}
                    className="w-full box-border border-2 border-white/80 rounded-xl p-3.5 sm:p-4 bg-gray-50/80 backdrop-blur-sm outline-none focus:border-[#E30613] focus:bg-white transition-colors font-bold text-gray-800 text-sm sm:text-base shadow-inner appearance-none"
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

              <div className="mb-4">
                <input
                  type="number"
                  placeholder="Année (ex: 2018)"
                  min="1990"
                  max={new Date().getFullYear()}
                  value={vehicle.annee}
                  onChange={(e) => setVehicle({...vehicle, annee: e.target.value})}
                  className="w-full box-border border-2 border-white/80 rounded-xl p-3.5 sm:p-4 bg-gray-50/80 backdrop-blur-sm outline-none focus:border-[#E30613] focus:bg-white transition-colors font-bold text-gray-800 text-sm sm:text-base shadow-inner appearance-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
                {fuelTypes.map((fuel) => (
                  <button key={fuel.value} onClick={() => setVehicle({...vehicle, carburant: fuel.value})} className={`p-3 sm:p-4 rounded-xl border-2 text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all break-words ${vehicle.carburant === fuel.value ? 'border-[#E30613] bg-[#E30613] text-white shadow-md' : 'bg-gray-50/80 text-gray-500 border-transparent hover:border-gray-300 hover:bg-white'}`}>
                    {fuel.label}
                  </button>
                ))}
              </div>

              <h3 className="font-bold text-gray-700 mb-3 text-sm sm:text-base">Problème ? (Optionnel)</h3>
              <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
                {problemesList.map(prob => (
                  <button key={prob} onClick={() => toggleProbleme(prob)} className={`px-3 py-2 rounded-full border-2 text-xs font-bold transition-all shadow-sm ${problemes.includes(prob) ? 'border-[#E30613] bg-[#E30613]/10 text-[#E30613]' : 'border-gray-200 text-gray-500 bg-white hover:border-[#E30613]/40'}`}>
                    {prob}
                  </button>
                ))}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 sm:mb-6 drop-shadow-sm text-center sm:text-left">Date & Heure</h2>
              
              <div className="mb-6 w-full">
                <input 
                  type="date" 
                  min={today} 
                  value={dateTime.date} 
                  onChange={(e) => setDateTime({...dateTime, date: e.target.value})} 
                  className="w-full max-w-full box-border border-2 border-white/80 rounded-xl p-3 sm:p-4 bg-gray-50/80 backdrop-blur-sm outline-none focus:border-[#E30613] focus:bg-white font-bold text-gray-800 text-sm sm:text-base shadow-inner transition-colors appearance-none" 
                />
              </div>

              {dateTime.date && (
                <div className="mb-6 sm:mb-8 w-full">
                  <label className="block text-xs sm:text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider text-center sm:text-left">Créneaux</label>
                  {loadingSlots ? (
                    <div className="text-center py-6 text-gray-400 font-bold text-sm sm:text-base animate-pulse bg-gray-50 rounded-xl">Recherche...</div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full">
                      {availableSlots.map(slot => (
                        <button
                          key={slot}
                          onClick={() => setDateTime({...dateTime, time: slot})}
                          className={`py-3 px-1 rounded-xl font-black text-xs sm:text-sm border-2 transition-all shadow-sm truncate ${dateTime.time === slot ? 'bg-[#E30613] text-white border-[#E30613] scale-105' : 'bg-white text-gray-600 border-gray-200 hover:border-[#E30613]/50'}`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-100 text-[#E30613] p-4 rounded-xl text-center font-bold text-xs sm:text-sm">
                      Aucun créneau dispo.
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8 w-full">
                <button onClick={() => goBack(1)} className="py-3 sm:py-4 bg-gray-100/80 rounded-xl flex-1 font-bold text-sm sm:text-base text-gray-500 hover:bg-gray-200 active:scale-95 transition-all">Retour</button>
                <button onClick={() => goNext(3)} disabled={!vehicle.marque || !dateTime.date || !dateTime.time} className="py-3 sm:py-4 bg-[#E30613] hover:bg-[#B3050F] transition-all active:scale-[0.97] rounded-xl flex-[2] font-black text-sm sm:text-lg text-white disabled:opacity-30 shadow-lg shadow-[#E30613]/20">Suivant</button>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 */}
          {step === 3 && (
            <div className={`${stepAnim} w-full`}>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-5 sm:mb-6 drop-shadow-sm text-center sm:text-left">Vos Coordonnées</h2>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                <button onClick={() => setTypeClient('PARTICULIER')} className={`flex-1 py-3.5 sm:py-4 rounded-xl border-2 font-black text-xs sm:text-sm uppercase tracking-wider transition-all ${typeClient === 'PARTICULIER' ? 'border-[#E30613] bg-[#E30613]/10 text-[#E30613] shadow-inner' : 'border-transparent text-gray-500 bg-gray-50/80 hover:border-gray-200 hover:bg-white'}`}>Particulier</button>
                <button onClick={() => setTypeClient('PROFESSIONNEL')} className={`flex-1 py-3.5 sm:py-4 rounded-xl border-2 font-black text-xs sm:text-sm uppercase tracking-wider transition-all ${typeClient === 'PROFESSIONNEL' ? 'border-[#E30613] bg-[#E30613]/10 text-[#E30613] shadow-inner' : 'border-transparent text-gray-500 bg-gray-50/80 hover:border-gray-200 hover:bg-white'}`}>Pro (Taxi, VTC...)</button>
              </div>

              <div className="space-y-4 sm:space-y-5 mb-8 sm:mb-10">
                <input type="text" placeholder="Nom & Prénom" value={client.fullName} onChange={(e) => setClient({...client, fullName: e.target.value})} className="w-full box-border border-2 border-white/80 rounded-xl p-3.5 sm:p-4 bg-gray-50/80 backdrop-blur-sm outline-none focus:border-[#E30613] focus:bg-white font-bold text-gray-800 text-sm sm:text-base shadow-inner transition-colors" />
                <input
                  type="tel"
                  placeholder="Téléphone"
                  value={client.tel}
                  onChange={(e) => setClient({...client, tel: e.target.value})}
                  onBlur={() => setTelTouched(true)}
                  className={`w-full box-border border-2 ${telBorder} rounded-xl p-3.5 sm:p-4 bg-gray-50/80 backdrop-blur-sm outline-none focus:bg-white font-bold text-gray-800 text-sm sm:text-base shadow-inner transition-colors`}
                />
                <input
                  type="email"
                  placeholder="Email (facture & compte)"
                  value={client.email}
                  onChange={(e) => setClient({...client, email: e.target.value})}
                  onBlur={() => setEmailTouched(true)}
                  className={`w-full box-border border-2 ${emailBorder} rounded-xl p-3.5 sm:p-4 bg-gray-50/80 backdrop-blur-sm outline-none focus:bg-white font-bold text-gray-800 text-sm sm:text-base shadow-inner transition-colors`}
                />
                
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
                <button onClick={() => goBack(2)} className="py-3.5 sm:py-4 bg-gray-100/80 rounded-xl flex-1 font-bold text-sm sm:text-base text-gray-500 hover:bg-gray-200 active:scale-95 transition-all">Retour</button>
                <button onClick={() => goNext(4)} disabled={!client.email || !client.adresse} className="py-3.5 sm:py-4 bg-[#E30613] hover:bg-[#B3050F] transition-all active:scale-[0.97] rounded-xl flex-[2] font-black text-sm sm:text-lg text-white disabled:opacity-30 shadow-lg shadow-[#E30613]/20">Récapitulatif</button>
              </div>
            </div>
          )}

          {/* ÉTAPE 4 */}
          {step === 4 && (
            <div className={`${stepAnim} w-full`}>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-5 sm:mb-6 drop-shadow-sm text-center sm:text-left">Confirmation</h2>

              <div className="mb-6 sm:mb-8">
                <label className="block text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 sm:mb-3 ml-1">Avez-vous un code parrain ? (Optionnel)</label>
                <input type="text" placeholder="Ex: AMIGO10" value={codeParrain} onChange={(e) => setCodeParrain(e.target.value.toUpperCase())} className="w-full box-border border-2 border-white/80 rounded-xl p-3.5 sm:p-4 bg-gray-50/80 backdrop-blur-sm outline-none focus:border-[#43A047] focus:bg-white font-black text-gray-800 text-sm sm:text-base tracking-widest shadow-inner transition-colors" />
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6 rounded-2xl mb-8 sm:mb-10 border border-gray-100 shadow-sm space-y-3">
                <p className="text-xs sm:text-sm flex justify-between items-start gap-2"><span className="text-gray-500 font-medium shrink-0">Service(s) :</span> <span className="font-black text-[#E30613] text-[10px] sm:text-xs text-right">{services.map(s => servicesList.find(i => i.value === s)?.label ?? s).join(' + ')}</span></p>
                <div className="h-px w-full bg-gray-100" />
                <p className="text-xs sm:text-sm flex justify-between items-center"><span className="text-gray-500 font-medium">Véhicule :</span> <span className="font-bold text-gray-800 text-right">{vehicle.marque} {vehicle.modele} {vehicle.annee && <span className="text-gray-400">({vehicle.annee})</span>} <span className="text-gray-400 text-[10px] sm:text-xs block sm:inline">({vehicle.carburant})</span></span></p>
                <div className="h-px w-full bg-gray-100" />
                <p className="text-xs sm:text-sm flex justify-between items-center"><span className="text-gray-500 font-medium">Date :</span> <span className="font-bold text-gray-800 text-right">{new Date(dateTime.date).toLocaleDateString('fr-FR')} à {dateTime.time}</span></p>
              </div>

              <div className="flex gap-3 sm:gap-4">
                <button onClick={() => goBack(3)} className="py-3.5 sm:py-4 bg-gray-100/80 rounded-xl flex-1 font-bold text-sm sm:text-base text-gray-500 hover:bg-gray-200 active:scale-95 transition-all">Retour</button>
                <button onClick={handleConfirm} disabled={loading} className="py-3.5 sm:py-4 bg-gradient-to-r from-[#43A047] to-[#2E7D32] hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.97] transition-all rounded-xl flex-[2] font-black text-sm sm:text-lg text-white shadow-lg shadow-[#43A047]/30 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2">
                  {loading && (
                    <svg className="animate-spin h-5 w-5 text-white shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  )}
                  {loading ? 'Envoi en cours...' : 'Confirmer le rendez-vous'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}