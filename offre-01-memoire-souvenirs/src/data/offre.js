// Résumé de l'offre 01 et de sa proforma, affiché dans la fenêtre « Voir l'offre et le budget ».
// Même contenu que propositions/OFFRE-01-Memoire-et-Souvenirs.md.
export const OFFRE = {
  numero: '01',
  nom: 'Mémoire & Souvenirs',
  accroche: 'Une plateforme simple et durable pour conserver nos souvenirs et honorer nos camarades.',
  reference: 'PF-12G2-2026-01',
  date: '6 octobre 2026',
  validite: '30 jours',
  objectif:
    'Un site consultable sur téléphone et sur ordinateur, qui présente le 12G2, conserve ses souvenirs en photos et rend hommage à Martine Tchuente et Simon Nanfa. Photos et messages de condoléances, une vidéo par espace mémoire, une gestion simple et des frais annuels limités au nom de domaine.',
  inclus: [
    'Accueil : présentation du 12G2, photo de groupe, accès directs aux albums et aux espaces mémoire',
    'Galerie des souvenirs : albums par catégorie et par année, photos légendées, affichage plein écran',
    'Espaces Martine Tchuente et Simon Nanfa : portrait, biographie, programme des obsèques, albums, une vidéo, livre de condoléances, partage WhatsApp',
    'Album des obsèques protégé par un code partagé dans le groupe du 12G2',
    'Création d’un nouvel espace mémoire en quelques minutes, sans développeur',
    '3 administrateurs avec comptes personnels, connexion par code reçu par email',
    'Messages publiés après validation, protection antispam, connexion sécurisée HTTPS',
    'Photos réduites automatiquement pour les téléphones, 10 Go de stockage',
    'Sauvegardes quotidiennes gardées 7 jours et copie hebdomadaire gardée 4 semaines',
    'Intégration de 100 photos, une formation à distance et un guide illustré',
  ],
  horsPerimetre: [
    'Comptes personnels pour chaque camarade (espace membre)',
    'Dépôt direct de photos ou de vidéos par les visiteurs : les photos passent par les administrateurs',
    'Rubrique actualités et événements',
  ],
  investissement: [
    { label: 'Conception et maquette interactive (déjà réalisée)', montant: 40000 },
    { label: 'Site, galerie des souvenirs et espaces mémoire', montant: 150000 },
    { label: 'Livre de condoléances avec validation et antispam', montant: 40000 },
    { label: 'Espace de gestion pour 3 administrateurs', montant: 50000 },
    { label: 'Mise en ligne, sécurité HTTPS et sauvegardes', montant: 20000 },
    { label: 'Intégration de 100 photos, formation et guide', offert: true },
  ],
  sousTotal: 300000,
  tiersAnnee1: [
    { label: 'Nom de domaine, 1re année (10,46 $)', montant: 7000, approx: true },
    { label: 'Hébergement et stockage 10 Go (offre gratuite Cloudflare)', montant: 0 },
    { label: 'Vidéos sur YouTube en mode non répertorié', montant: 0 },
  ],
  totalAnnee1: 307000,
  annuel: [
    { label: 'Renouvellement du nom de domaine', montant: 7000, approx: true },
    { label: 'Hébergement et stockage 10 Go', montant: 0 },
    { label: 'Assistance et maintenance (optionnelle)', montant: 36000, optionnel: true },
  ],
  totalAnnuel: { sans: 7000, avec: 43000 },
  delai:
    'Espaces mémoire en ligne sous 5 jours ouvrés, site complet sous 7 à 10 jours ouvrés après validation de la maquette et réception des contenus.',
  paiement: '50 % à la commande, 50 % après validation du site de test, avant la mise en ligne. Mobile Money ou virement.',
  parMembre:
    'Pour 50 membres cotisants : 6 140 F CFA chacun la première année, puis 140 F CFA par an (860 F CFA avec l’assistance).',
  evolution: 'Passage à l’offre 02 possible plus tard en réglant la différence de réalisation (350 000 F CFA), sans perdre les contenus.',
  mentions:
    'Prestataire à compléter. Montants en F CFA, hors taxes : leur traitement est à préciser selon le statut fiscal du prestataire. Frais tiers payés en dollars, convertis sur la base de 600 F CFA pour 1 $. Domaine proposé sous réserve de disponibilité.',
}
