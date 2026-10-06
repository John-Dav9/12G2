// Albums d'exemple. Chaque album est public ou réservé aux membres connectés.
export const CATEGORIES = [
  { id: 'ecole', label: 'Années d’école' },
  { id: 'retrouvailles', label: 'Retrouvailles' },
  { id: 'celebrations', label: 'Célébrations' },
  { id: 'activites', label: 'Activités' },
  { id: 'solidarite', label: 'Solidarité' },
  { id: 'hommages', label: 'Hommages' },
]

export const categoryLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label ?? ''

export const VISIBILITY = {
  public: 'Public',
  membres: 'Réservé aux membres',
}

// Une entrée texte = une photo ; { video, duree } = une vidéo.
const media = (prefix, entries) =>
  entries.map((entry, i) => {
    const id = `${prefix}-${i + 1}`
    if (typeof entry === 'string') return { id, kind: 'photo', caption: entry, seed: id }
    return { id, kind: 'video', caption: entry.video, duration: entry.duree, seed: id }
  })

export const initialAlbums = [
  {
    id: 'classe-12g2',
    title: 'La classe 12G2 au complet',
    category: 'ecole',
    year: null,
    period: 'Archives de l’école',
    visibility: 'public',
    description: 'Photos de classe et moments passés ensemble au lycée.',
    items: media('classe', [
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
    visibility: 'public',
    description: 'Les derniers mois ensemble avant les épreuves.',
    items: media('examens', ['Groupe de révision', 'Le tableau de la veille', 'Résultats affichés', 'Photo souvenir']),
  },
  {
    id: 'retrouvailles-2025',
    title: 'Retrouvailles 2025',
    category: 'retrouvailles',
    year: 2025,
    visibility: 'public',
    description: 'Les camarades réunis pour la rencontre annuelle.',
    items: media('retro25', [
      { video: 'Le mot de bienvenue', duree: '2:40' },
      'Accueil des camarades',
      'Photo de groupe',
      'Repas partagé',
      { video: 'L’ambiance de la soirée', duree: '1:55' },
      'Danse',
      'Au revoir et à l’année prochaine',
    ]),
  },
  {
    id: 'retrouvailles-2024',
    title: 'Retrouvailles 2024',
    category: 'retrouvailles',
    year: 2024,
    visibility: 'membres',
    description: 'Une journée pour se revoir et prendre des nouvelles.',
    items: media('retro24', ['Arrivée', 'Photo de groupe', 'Discours du bureau', 'Souvenirs partagés', 'Fin de journée']),
  },
  {
    id: 'mariage-exemple',
    title: 'Mariage d’un camarade',
    category: 'celebrations',
    year: 2026,
    visibility: 'membres',
    description: 'Exemple d’album de célébration, visible par les membres.',
    items: media('mariage', ['Les mariés', 'La délégation du 12G2', { video: 'Le chant des camarades', duree: '3:10' }, 'Photo de groupe']),
  },
  {
    id: 'visite-solidarite',
    title: 'Visite de solidarité',
    category: 'solidarite',
    year: 2026,
    visibility: 'public',
    description: 'Une délégation du 12G2 auprès d’une famille éprouvée.',
    items: media('solidarite', ['Départ de la délégation', 'Auprès de la famille', 'Remise de l’enveloppe du 12G2']),
  },
  {
    id: 'obseques-martine-tchuente',
    title: 'Obsèques de Martine Tchuente',
    category: 'hommages',
    year: null,
    period: 'Espace mémoire',
    memorial: 'martine-tchuente',
    visibility: 'membres',
    description: 'Pour celles et ceux qui n’ont pas pu être présents.',
    items: media('obs-martine', [
      'Arrivée de la famille',
      'Recueillement',
      { video: 'Le mot de l’association', duree: '4:05' },
      'Les camarades du 12G2',
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
    visibility: 'public',
    description: 'Martine sur nos photos d’école et de retrouvailles.',
    items: media('sv-martine', ['En classe', 'Lors des retrouvailles', 'Un moment partagé']),
  },
  {
    id: 'obseques-simon-nanfa',
    title: 'Obsèques de Simon Nanfa',
    category: 'hommages',
    year: null,
    period: 'Espace mémoire',
    memorial: 'simon-nanfa',
    visibility: 'membres',
    description: 'Les photos et vidéos des camarades présents.',
    note: 'Les membres présents aux obsèques peuvent proposer leurs photos et vidéos depuis « Mon espace ».',
    items: media('obs-simon', [
      'La délégation du 12G2',
      'Recueillement',
      { video: 'Arrivée de la délégation', duree: '1:45' },
      'Le mot de l’association',
      'Dernier hommage',
    ]),
  },
  {
    id: 'souvenirs-simon-nanfa',
    title: 'Simon parmi nous',
    category: 'hommages',
    year: null,
    period: 'Espace mémoire',
    memorial: 'simon-nanfa',
    visibility: 'public',
    description: 'Simon sur nos photos d’école et de retrouvailles.',
    items: media('sv-simon', ['En classe', 'Lors des retrouvailles', 'Un moment partagé']),
  },
]
