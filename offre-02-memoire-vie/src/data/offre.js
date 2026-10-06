// Résumé de l'offre 02 et de sa proforma, affiché dans la fenêtre « Voir l'offre et le budget ».
// Même contenu que propositions/OFFRE-02-Memoire-et-Vie.md.
export const OFFRE = {
  numero: '02',
  nom: 'Mémoire & Vie',
  accroche: 'La maison numérique du 12G2, pour partager les souvenirs, les activités, les joies et les peines.',
  reference: 'PF-12G2-2026-02',
  date: '6 octobre 2026',
  validite: '30 jours',
  objectif:
    'Une plateforme communautaire durable qui accompagne la vie du 12G2. Au-delà des hommages à Martine Tchuente et Simon Nanfa, elle conserve les archives de la classe, annonce les rencontres et permet à chaque membre de partager photos, vidéos et souvenirs, validés avant publication.',
  inclus: [
    'Tout le socle de l’offre 01 : accueil, galerie, espaces mémoire, livre de condoléances, gestion',
    'Archives par année, événement et catégorie, chaque album public ou réservé aux membres',
    'Actualités et événements : rencontres avec confirmation de présence, comptes rendus, solidarité, heureux événements',
    'Espaces mémoire enrichis : programme et informations pratiques, photos et vidéos, anecdotes, bougie du souvenir, rappel à la date anniversaire',
    'Espace membre sur invitation : connexion Google ou code par email, profil, contributions et suivi de leur validation',
    'Annuaire des membres, visible uniquement par les membres connectés',
    'Vidéos envoyées depuis le téléphone (200 Mo par fichier), lecture adaptée à la connexion',
    '5 administrateurs avec des droits adaptés, validation de tous les contenus avant publication',
    'Application installable sur l’écran d’accueil du téléphone, résumé des nouveautés par email',
    '30 Go pour les photos, 1 000 minutes de vidéo, sauvegardes quotidiennes gardées 30 jours',
    'Intégration de 300 photos et 10 vidéos, deux formations, guide d’administration et 30 jours d’accompagnement',
  ],
  horsPerimetre: [
    'Notifications push sur téléphone (option chiffrée sur demande)',
    'Cotisations et caisse de solidarité par Mobile Money (option chiffrée sur demande)',
    'Application publiée sur les stores Android et iPhone',
  ],
  investissement: [
    { label: 'Conception UX/UI et maquettes interactives (déjà réalisées)', montant: 60000 },
    { label: 'Site, archives et espaces mémoire enrichis', montant: 190000 },
    { label: 'Espace membre : invitations, profils, contributions, annuaire', montant: 140000 },
    { label: 'Actualités et événements, confirmations de présence', montant: 80000 },
    { label: 'Vidéothèque : envoi depuis le téléphone, lecture adaptée à la connexion', montant: 70000 },
    { label: 'Gestion : 5 administrateurs, rôles, validation, visibilité', montant: 70000 },
    { label: 'Mise en ligne, application installable, sécurité, sauvegardes', montant: 40000 },
    { label: 'Intégration de 300 photos et 10 vidéos, formations, guide, accompagnement', offert: true },
  ],
  sousTotal: 650000,
  tiersAnnee1: [
    { label: 'Nom de domaine, 1re année (10,46 $)', montant: 7000, approx: true },
    { label: 'Vidéo : 1 000 minutes stockées et diffusion (Cloudflare Stream)', montant: 58000, approx: true },
    { label: 'Stockage photos jusqu’à 30 Go (Cloudflare R2)', montant: 3000, approx: true },
    { label: 'Hébergement de l’application, base de données et emails', montant: 0 },
  ],
  totalAnnee1: 718000,
  annuel: [
    { label: 'Renouvellement du nom de domaine', montant: 7000, approx: true },
    { label: 'Vidéo : stockage et diffusion', montant: 58000, approx: true },
    { label: 'Stockage photos', montant: 3000, approx: true },
    { label: 'Maintenance et assistance (recommandée)', montant: 72000 },
  ],
  totalAnnuel: { sans: 68000, avec: 140000, label: 'avec la maintenance' },
  delai:
    'Version « hommages » en ligne sous 7 jours ouvrés, plateforme complète sous 15 à 20 jours ouvrés après validation des maquettes et réception des contenus.',
  paiement:
    '50 % à la commande, 30 % à la présentation de la plateforme fonctionnelle, 20 % après validation finale, avant la mise en ligne. Mobile Money ou virement.',
  parMembre:
    'Pour 50 membres cotisants : 14 360 F CFA chacun la première année, puis 2 800 F CFA par an avec la maintenance (1 360 F CFA sans).',
  evolution: 'Les frais vidéo suivent l’usage réel : ils baissent si les vidéos longues restent sur YouTube.',
  mentions:
    'Prestataire à compléter. Montants en F CFA, hors taxes : leur traitement est à préciser selon le statut fiscal du prestataire. Frais tiers payés en dollars, convertis sur la base de 600 F CFA pour 1 $. Domaine proposé sous réserve de disponibilité.',
}
