import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import PrintButton from './PrintButton';

// NOUVEAU : On indique que params est une Promesse
export default async function FacturePage({ params }: { params: Promise<{ id: string }> }) {
  
  // 1. LE FIX NEXT.JS 15 : On "attend" de lire l'ID depuis l'URL
  const { id } = await params;

  // 2. On récupère toutes les infos de la réservation
  const reservation = await prisma.reservation.findUnique({
    where: { id: id },
    include: {
      user: true,
      vehicule: true,
    }
  });

  if (!reservation || !reservation.user) {
    notFound();
  }

  // 3. Calculs financiers (TVA Française à 20%)
  const tauxTVA = 0.20;
  const montantTTC = reservation.montantTotal;
  const remise = reservation.remiseAppliquee;
  const prixDeBase = montantTTC + remise; // Le prix avant remise
  
  const montantHT = montantTTC / (1 + tauxTVA);
  const montantTVA = montantTTC - montantHT;

  // Numéro de facture généré à partir de l'ID et de la date
  const numFacture = `F${new Date(reservation.dateIntervention).getFullYear()}-${reservation.id.slice(-5).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-gray-100 py-10 print:bg-white print:py-0 font-sans selection:bg-[#43A047] selection:text-white overflow-x-hidden">

      {/* BOUTON RETOUR (invisible sur le PDF) */}
      <div className="print:hidden sticky top-0 z-50 px-4 py-3 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <Link
          href="/dashboard-client"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#E30613] transition-colors duration-200"
          style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' } as React.CSSProperties}
        >
          <span className="text-base">←</span> Mon espace
        </Link>
      </div>

      {/* Le bouton de téléchargement (invisible sur le PDF) */}
      <PrintButton />

      {/* LA FEUILLE A4 DE LA FACTURE */}
      <div className="w-full max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none min-h-[297mm] relative overflow-hidden">

        {/* Bandeau supérieur Rouge */}
        <div className="h-4 w-full bg-[#E30613]"></div>

        <div className="p-4 sm:p-8 md:p-12">
          {/* HEADER : Logo et Titre */}
          <div className="flex flex-col sm:flex-row justify-between items-start mb-8 sm:mb-16 gap-4">
            <div>
              <div className="relative h-16 w-36 sm:h-20 sm:w-48 mb-3">
                <Image src="/ds_hylec_logo.png" alt="DS HY'LEC" fill className="object-contain object-left" priority />
              </div>
              <p className="text-gray-500 font-medium text-sm">Intervention à domicile</p>
              <p className="text-gray-500 font-medium text-sm">Expertise Hybride & Dépollution</p>
            </div>
            <div className="sm:text-right">
              <h1 className="text-3xl sm:text-5xl font-black text-gray-200 uppercase tracking-tighter mb-2">Facture</h1>
              <p className="text-gray-900 font-bold text-base sm:text-lg">N° {numFacture}</p>
              <p className="text-gray-500 font-medium text-sm">Date : {new Date(reservation.dateIntervention).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>

          {/* ADRESSES */}
          <div className="flex flex-col sm:flex-row justify-between mb-8 sm:mb-16 gap-4 sm:gap-8">
            {/* Émetteur */}
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Émetteur</p>
              <h2 className="text-xl font-black text-[#E30613] mb-1">DS HY'LEC</h2>
              <p className="text-gray-700 font-medium leading-relaxed">
                123 Avenue de la Dépollution<br />
                75000 Paris, France<br />
                contact@dshylec.fr<br />
                +33 6 12 34 56 78
              </p>
            </div>
            
            {/* Client */}
            <div className="flex-1 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Facturé à</p>
              <h2 className="text-xl font-black text-gray-900 mb-1">
                {reservation.user.nom} {reservation.user.prenom}
                {reservation.user.typeClient === 'PROFESSIONNEL' && (
                  <span className="ml-2 bg-[#E30613] text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider align-middle">PRO</span>
                )}
              </h2>
              <p className="text-gray-700 font-medium leading-relaxed">
                {reservation.adresse}<br />
                {reservation.user.email}<br />
                {reservation.user.telephone}
              </p>
              
              {/* Info Véhicule */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Véhicule concerné</p>
                <p className="text-sm font-bold text-gray-800">
                  {reservation.vehicule?.marque} {reservation.vehicule?.modele} ({reservation.vehicule?.carburant})
                </p>
                {reservation.vehicule?.immatriculation && (
                  <p className="text-sm text-gray-600 font-mono mt-1 border inline-block px-2 py-0.5 rounded bg-white">
                    {reservation.vehicule.immatriculation}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* TABLEAU DES PRESTATIONS */}
          <div className="mb-8 sm:mb-12 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[480px]">
              <thead>
                <tr className="bg-[#E30613] text-white text-sm uppercase tracking-wider">
                  <th className="py-4 px-6 rounded-tl-xl font-bold">Description du service</th>
                  <th className="py-4 px-6 font-bold text-center">Qté</th>
                  <th className="py-4 px-6 font-bold text-right">Prix Unitaire HT</th>
                  <th className="py-4 px-6 rounded-tr-xl font-bold text-right">Total TTC</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-6 px-6">
                    <p className="font-bold text-gray-900 text-lg">{reservation.service.replace(/_/g, ' ')}</p>
                    {reservation.problemes && reservation.problemes.length > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        Symptômes traités : {reservation.problemes.join(', ')}
                      </p>
                    )}
                  </td>
                  <td className="py-6 px-6 text-center font-bold text-gray-700">1</td>
                  <td className="py-6 px-6 text-right font-medium text-gray-700">{(prixDeBase / (1 + tauxTVA)).toFixed(2)} €</td>
                  <td className="py-6 px-6 text-right font-bold text-gray-900">{prixDeBase.toFixed(2)} €</td>
                </tr>
                
                {/* Ligne Remise (Si code parrain utilisé) */}
                {remise > 0 && (
                  <tr className="bg-green-50/50">
                    <td className="py-4 px-6 font-bold text-[#43A047]">Remise Parrainage</td>
                    <td className="py-4 px-6 text-center text-[#43A047]">1</td>
                    <td className="py-4 px-6 text-right text-[#43A047]">- {(remise / (1 + tauxTVA)).toFixed(2)} €</td>
                    <td className="py-4 px-6 text-right font-black text-[#43A047]">- {remise.toFixed(2)} €</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* RÉSUMÉ DES TOTAUX */}
          <div className="flex justify-end mb-8 sm:mb-16">
            <div className="w-full sm:w-1/2 bg-gray-50 rounded-2xl p-4 sm:p-6 border border-gray-100">
              <div className="flex justify-between py-2 text-gray-600 font-medium">
                <span>Total HT</span>
                <span>{montantHT.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between py-2 text-gray-600 font-medium border-b border-gray-200 mb-2">
                <span>TVA (20%)</span>
                <span>{montantTVA.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-xl font-black text-gray-900">Total TTC</span>
                <span className="text-2xl font-black text-[#E30613]">{montantTTC.toFixed(2)} €</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 font-medium text-center uppercase tracking-wider">
                  Moyen de paiement : <span className="font-bold text-gray-900">{reservation.moyenPaiement.replace(/_/g, ' ')}</span>
                </p>
              </div>
            </div>
          </div>

          {/* FOOTER MENTIONS LÉGALES */}
          <div className="text-center text-xs text-gray-400 mt-20 pt-8 border-t border-gray-100 leading-relaxed">
            <p className="font-bold text-gray-500 mb-2">Merci pour votre confiance !</p>
            <p>DS HY'LEC - Auto-entreprise (ou SASU) au capital de X € - SIRET : XXX XXX XXX XXXXX</p>
            <p>En cas de retard de paiement, une pénalité de 3 fois le taux d'intérêt légal sera appliquée.</p>
            <p>TVA Intracommunautaire : FRXX XXX XXX XXX</p>
          </div>

        </div>
      </div>
    </div>
  );
}