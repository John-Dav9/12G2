// Textes du site. Les passages entre crochets sont à compléter par le 12G2.
export const SITE = {
  offre: '02',
  formule: 'Mémoire & Vie',
  association: 'Association des anciens élèves du 12G2',
  // Domaine proposé, sous réserve de disponibilité.
  url: 'https://le12g2.com',
  accroche: 'La maison numérique du 12G2.',
  presentation: [
    'Nous sommes les anciens élèves de la classe 12G2. Depuis les bancs de l’école, nous sommes restés une famille : nous nous retrouvons, nous nous soutenons dans les épreuves et nous célébrons ensemble les moments heureux.',
    'Ici, chaque membre peut partager ses photos et ses vidéos, raconter un souvenir, suivre les rencontres et rendre hommage à nos camarades disparus. Les contenus sont validés par les administrateurs avant publication.',
  ],
  etablissement: '[Nom de l’établissement et années de scolarité à compléter]',
  objectifs: [
    { titre: 'Garder le lien', texte: 'Où que vivent les camarades, la plateforme rassemble nouvelles, photos et rencontres.' },
    { titre: 'Soutenir les familles', texte: 'Délégations, cotisations et messages : la solidarité du 12G2 reste visible et organisée.' },
    { titre: 'Conserver la mémoire', texte: 'Archives de la classe et espaces mémoire de nos disparus, gardés pour les années à venir.' },
    { titre: 'Célébrer les joies', texte: 'Mariages, naissances et réussites ont aussi leur place dans la maison du 12G2.' },
  ],
  bureau: [
    { role: 'Présidente', nom: '[Nom à compléter]' },
    { role: 'Secrétaire général', nom: '[Nom à compléter]' },
    { role: 'Trésorier', nom: '[Nom à compléter]' },
    { role: 'Chargée de communication', nom: '[Nom à compléter]' },
  ],
  // Offre 02 : cinq administrateurs, chacun avec des droits adaptés.
  admins: [
    { nom: 'Administratrice 1', role: 'Administration principale', droits: 'Tous les droits', email: 'presidente@example.org' },
    { nom: 'Administrateur 2', role: 'Modération', droits: 'Valide messages, souvenirs, photos et vidéos', email: 'moderation@example.org' },
    { nom: 'Administrateur 3', role: 'Albums', droits: 'Crée, classe et règle la visibilité des albums', email: 'albums@example.org' },
    { nom: 'Administratrice 4', role: 'Événements', droits: 'Publie rencontres et comptes rendus', email: 'evenements@example.org' },
    { nom: 'Administrateur 5', role: 'Membres', droits: 'Valide les inscriptions et les profils', email: 'membres@example.org' },
  ],
  membreDemo: {
    nom: 'Camarade Démo',
    email: 'camarade@example.org',
    ville: 'Douala',
    metier: 'Profession à compléter',
  },
  stockageTotal: 30 * 1024 ** 3,
  videoMinutesTotal: 1000,
  videoMaxMo: 200,
}
