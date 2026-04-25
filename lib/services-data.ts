export type ServiceData = {
  slug: string;
  id: string;
  title: string;
  img: string;
  descCourte: string;
  descLongue: string;
  type: 'standard' | 'hybride' | 'premium';
  badge?: string;
};

export const SERVICES: ServiceData[] = [
  {
    slug: "diagnostic-electronique",
    id: "DIAGNOSTIC_ELECTRONIQUE",
    title: "Diagnostic électronique complet",
    img: "/diagnostic electric complet.jpeg",
    descCourte: "Analyse complète de votre véhicule avec valise professionnelle.",
    descLongue: "Le diagnostic automobile possède un rôle essentiellement préventif : il fournit des informations sur une panne possible, ce qui permet d'intervenir avant que les dysfonctionnements identifiés ne s'aggravent. Toute la mécanique de l'automobile peut être passée en revue durant le diagnostic moteur. Avec son système électronique embarqué, chaque automobile est dotée de multiples capteurs ayant chacun leur mission. Certains servent à injecter le carburant, d'autres régulent la pression d'air dans l'admission, d'autres encore déclenchent la recirculation des gaz d'échappement (EGR). Ces capteurs saisissent les informations qu'ils transmettent à l'unité de traitement appropriée. La voiture est donc équipée de ces différentes unités de traitements, le diagnostic auto analyse la situation de chaque unité.",
    type: "standard",
  },
  {
    slug: "decalaminage-moteur",
    id: "DECALAMINAGE_MOTEUR",
    title: "Décalaminage moteur hydrogène",
    img: "/Decalaminage.jpeg",
    descCourte: "Nettoyage interne du moteur par hydrogène. Élimine la calamine accumulée.",
    descLongue: "Le décalaminage à l'hydrogène est une solution rapide, économique et écologique pour l'entretien de votre moteur diesel ou essence. Il permet d'éliminer les dépôts de calamine à l'intérieur de votre moteur. Ces résidus noirâtres sont formés par la combustion du moteur. Ils se déposent ainsi progressivement sur les pièces sensibles et onéreuses jusqu'à les endommager, comme la vanne EGR, le filtre à particules (FAP), les injections, les soupapes ou encore le turbo. L'accumulation de ces dépôts obstrue les artères de votre moteur, ce qui l'encrasse et l'empêche de fonctionner correctement. Ce phénomène s'accentue sur les voitures qui réalisent de petits trajets en ville.",
    type: "standard",
  },
  {
    slug: "regeneration-fap",
    id: "REGENERATION_FAP",
    title: "Régénération FAP",
    img: "/Regeneration FAP.jpeg",
    descCourte: "Nettoyage du filtre à particules encrassé via outil de diagnostic.",
    descLongue: "La régénération du FAP à l'aide de l'outil diagnostic est le processus par lequel les particules de suie accumulées dans le filtre sont brûlées, permettant ainsi de nettoyer le filtre et de maintenir les performances du véhicule. Un FAP encrassé peut conduire à une réduction significative des performances du véhicule, augmenter la consommation de carburant, et dans certains cas, causer des dommages au moteur. La régénération du FAP est une procédure essentielle pour maintenir les performances du véhicule, prolonger la durée de vie du filtre, et minimiser les émissions polluantes.",
    type: "standard",
  },
  {
    slug: "debouchage-fap",
    id: "DEBOUCHAGE_FAP",
    title: "Débouchage du filtre à particules (FAP)",
    img: "/Débouchage du filtre a particules.jpg",
    descCourte: "Traitement des filtres fortement encrassés par injection de produit nettoyant.",
    descLongue: "Notre service de débouchage du filtre à particules permet de traiter efficacement les filtres fortement encrassés ou complètement bouchés. Grâce à un procédé spécifique avec injection de produit nettoyant, suivi d'un rinçage en profondeur, nous éliminons les dépôts de suie et de cendres accumulés dans le FAP. Un filtre à particules obstrué peut entraîner une perte de puissance, une surconsommation, voire un passage en mode dégradé du véhicule. Cette intervention permet de restaurer le bon fonctionnement du système d'échappement sans remplacement immédiat du filtre, évitant ainsi des coûts importants. Rapide et efficace, ce procédé redonne à votre véhicule ses performances tout en réduisant les émissions polluantes.",
    type: "standard",
  },
  {
    slug: "diagnostic-hybride",
    id: "DIAGNOSTIC_HYBRIDE",
    title: "Diagnostic système hybride",
    img: "/diagnostic systeme hybride.jpeg",
    descCourte: "Contrôle complet du système hybride haute tension.",
    descLongue: "Le diagnostic système hybride permet d'analyser avec précision l'ensemble des composants électriques et thermiques de votre véhicule hybride. Grâce à des outils de diagnostic de dernière génération, nous identifions rapidement les éventuelles anomalies liées à la batterie haute tension, au moteur électrique, au système de recharge, à la gestion électronique ou encore à la coordination entre le moteur thermique et électrique. Notre intervention permet de détecter les erreurs enregistrées dans les calculateurs, de vérifier l'état de la batterie hybride, de contrôler les systèmes de refroidissement et de s'assurer du bon fonctionnement de l'ensemble du système de propulsion.",
    type: "hybride",
    badge: "EXPERTISE",
  },
  {
    slug: "test-batterie-hybride",
    id: "TEST_BATTERIE_HYBRIDE",
    title: "Test batterie hybride",
    img: "/test de batterie hybride.jpeg",
    descCourte: "Analyse de l'état de santé de votre batterie hybride haute tension.",
    descLongue: "Notre service de test batterie hybride permet d'évaluer avec précision l'état de santé de votre batterie (SOH) haute tension. Grâce à des outils spécialisés, nous analysons les performances réelles de la batterie, sa capacité de charge, son niveau d'usure ainsi que l'équilibrage des cellules. La batterie hybride est un élément essentiel du véhicule. Avec le temps, elle peut perdre en efficacité, entraînant une baisse de performance, une surconsommation ou des dysfonctionnements. Un test régulier permet d'anticiper les pannes et d'éviter des réparations coûteuses. Notre intervention fournit un bilan complet et fiable, vous permettant de connaître l'état exact de votre batterie et de prendre les bonnes décisions pour l'entretien ou le remplacement.",
    type: "hybride",
  },
  {
    slug: "entretien-systeme-hybride",
    id: "NETTOYAGE_REFROIDISSEMENT_HYBRIDE",
    title: "Entretien du système hybride",
    img: "/Entretien du systeme hybride.jpg",
    descCourte: "Préservation des performances du système hybride.",
    descLongue: "Notre service d'entretien du système hybride permet de préserver les performances et la longévité de votre véhicule. Nous intervenons sur les éléments essentiels tels que le nettoyage du ventilateur de batterie, des conduits d'air et des composants liés au refroidissement du système hybride. Un système hybride mal entretenu peut entraîner une surchauffe de la batterie, une baisse d'efficacité et des dysfonctionnements. Un entretien régulier est donc indispensable pour garantir un fonctionnement optimal et éviter les pannes coûteuses. Grâce à une intervention complète et adaptée, nous assurons le bon état de votre système hybride et contribuons à maintenir ses performances dans le temps.",
    type: "hybride",
  },
  {
    slug: "pack-hybride-complet",
    id: "PACK_HYBRIDE_COMPLET",
    title: "Pack hybride complet",
    img: "/diagnostic systeme hybride.jpeg",
    descCourte: "Service complet incluant diagnostic hybride, test batterie et entretien du système.",
    descLongue: "Le Pack Hybride Complet est notre offre la plus complète pour les propriétaires de véhicules hybrides souhaitant un bilan exhaustif de leur véhicule. Ce pack inclut un diagnostic système hybride complet, un test approfondi de la batterie haute tension et un entretien complet du système de refroidissement hybride. Cette intervention globale vous permet d'avoir une vision claire et précise de l'état de votre véhicule hybride, d'anticiper les éventuelles pannes et de garantir des performances optimales sur le long terme. Idéal avant un achat, une revente ou simplement pour un entretien annuel complet.",
    type: "premium",
  },
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
