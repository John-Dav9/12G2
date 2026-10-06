// Albums d'exemple. Les légendes décrivent des emplacements : les vraies photos les remplaceront.
export const CATEGORIES = [
  { id: 'ecole', label: 'Années d’école' },
  { id: 'retrouvailles', label: 'Retrouvailles' },
  { id: 'activites', label: 'Activités de l’association' },
  { id: 'hommages', label: 'Hommages' },
]

export const categoryLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label ?? ''

const photos = (prefix, captions) =>
  captions.map((caption, i) => ({ id: `${prefix}-${i + 1}`, kind: 'photo', caption, seed: `${prefix}-${i + 1}` }))

export const DEMO_CODE = '12G2'

export const initialAlbums = [
  {
    id: 'classe-12g2',
    title: 'La classe 12G2 au complet',
    category: 'ecole',
    year: null,
    period: 'Archives de l’école',
    description: 'Photos de classe et moments passés ensemble au lycée.',
    items: photos('classe', [
      'Photo de classe officielle',
      'Dans la cour de récréation',
      'Devant la salle de classe',
      'Révisions avant les examens',
      'Sortie pédagogique',
      'Remise des bulletins',
      'Fête de fin d’année',
      'Entre camarades',
    ]),
  },
  {
    id: 'annee-examens',
    title: 'L’année des examens',
    category: 'ecole',
    year: null,
    period: 'Archives de l’école',
    description: 'Les derniers mois ensemble avant les épreuves.',
    items: photos('examens', ['Groupe de révision', 'Le tableau de la veille', 'Résultats affichés', 'Photo souvenir']),
  },
  {
    id: 'retrouvailles-2025',
    title: 'Retrouvailles 2025',
    category: 'retrouvailles',
    year: 2025,
    description: 'Les camarades réunis pour la rencontre annuelle.',
    items: photos('retro25', [
      'Accueil des camarades',
      'Photo de groupe',
      'Repas partagé',
      'Moment d’échange',
      'Danse',
      'Au revoir et à l’année prochaine',
    ]),
  },
  {
    id: 'retrouvailles-2024',
    title: 'Retrouvailles 2024',
    category: 'retrouvailles',
    year: 2024,
    description: 'Une journée pour se revoir et prendre des nouvelles.',
    items: photos('retro24', ['Arrivée', 'Photo de groupe', 'Discours du bureau', 'Souvenirs partagés', 'Fin de journée']),
  },
  {
    id: 'visite-solidarite',
    title: 'Visite de solidarité',
    category: 'activites',
    year: 2026,
    description: 'Une délégation du 12G2 auprès d’une famille éprouvée.',
    items: photos('solidarite', ['Départ de la délégation', 'Auprès de la famille', 'Remise de l’enveloppe du 12G2']),
  },
  {
    id: 'obseques-martine-tchuente',
    title: 'Obsèques de Martine Tchuente',
    category: 'hommages',
    year: null,
    period: 'Espace mémoire',
    memorial: 'martine-tchuente',
    protected: { code: DEMO_CODE },
    description: 'Pour celles et ceux qui n’ont pas pu être présents.',
    items: photos('obs-martine', [
      'Arrivée de la famille',
      'Recueillement',
      'Les camarades du 12G2',
      'Le mot de l’association',
      'Fleurs et couronnes',
      'Dernier hommage',
    ]),
  },
  {
    id: 'souvenirs-martine-tchuente',
    title: 'Martine parmi nous',
    category: 'hommages',
    year: null,
    period: 'Espace mémoire',
    memorial: 'martine-tchuente',
    description: 'Martine sur nos photos d’école et de retrouvailles.',
    items: photos('sv-martine', ['En classe', 'Lors des retrouvailles', 'Un moment partagé']),
  },
  {
    id: 'obseques-simon-nanfa',
    title: 'Obsèques de Simon Nanfa',
    category: 'hommages',
    year: null,
    period: 'Espace mémoire',
    memorial: 'simon-nanfa',
    protected: { code: DEMO_CODE },
    description: 'Les photos prises par les camarades présents.',
    note: 'Album à compléter avec les photos prises par les camarades présents aux obsèques.',
    items: photos('obs-simon', ['La délégation du 12G2', 'Recueillement', 'Le mot de l’association', 'Dernier hommage']),
  },
  {
    id: 'souvenirs-simon-nanfa',
    title: 'Simon parmi nous',
    category: 'hommages',
    year: null,
    period: 'Espace mémoire',
    memorial: 'simon-nanfa',
    description: 'Simon sur nos photos d’école et de retrouvailles.',
    items: photos('sv-simon', ['En classe', 'Lors des retrouvailles', 'Un moment partagé']),
  },
]
