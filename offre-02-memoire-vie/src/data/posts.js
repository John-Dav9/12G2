import { daysAgo } from '../lib/format.js'

// Actualités et événements d'exemple.
export const POST_TYPES = [
  { id: 'rencontre', label: 'Rencontres' },
  { id: 'compte-rendu', label: 'Comptes rendus' },
  { id: 'solidarite', label: 'Solidarité' },
  { id: 'joie', label: 'Heureux événements' },
]

export const postTypeLabel = (id) => POST_TYPES.find((t) => t.id === id)?.label ?? ''

function firstSaturdayNextMonth() {
  const d = new Date()
  d.setMonth(d.getMonth() + 1, 1)
  while (d.getDay() !== 6) d.setDate(d.getDate() + 1)
  d.setHours(15, 0, 0, 0)
  return d.toISOString()
}

export const initialPosts = [
  {
    id: 'rencontre-mensuelle',
    type: 'rencontre',
    title: 'Rencontre mensuelle du 12G2',
    date: firstSaturdayNextMonth(),
    lieu: 'Lieu à confirmer',
    text: 'Ordre du jour : point sur les espaces mémoire, cotisations de solidarité et organisation des prochaines retrouvailles.',
    rsvp: 14,
    visibility: 'membres',
  },
  {
    id: 'obseques-simon',
    type: 'solidarite',
    title: 'Le 12G2 aux obsèques de Simon',
    date: daysAgo(1),
    text: 'Exemple de publication : photos de la délégation, remerciements de la famille et rappel du livre de condoléances.',
    link: { to: '/memoire/simon-nanfa', label: 'Espace de Simon Nanfa' },
    visibility: 'public',
    example: true,
  },
  {
    id: 'naissance',
    type: 'joie',
    title: 'Naissance dans la famille 12G2',
    date: daysAgo(9),
    text: 'Exemple : félicitations à un camarade pour la naissance de son enfant. Les membres peuvent laisser un mot.',
    reactions: 18,
    visibility: 'public',
    example: true,
  },
  {
    id: 'assemblee-generale',
    type: 'compte-rendu',
    title: 'Compte rendu de l’assemblée générale',
    date: daysAgo(20),
    text: 'Exemple de compte rendu, visible par les membres connectés.',
    points: [
      'Adoption de la plateforme numérique du 12G2',
      'Désignation des cinq administrateurs',
      'Calendrier des rencontres de l’année',
      'Règles de la caisse de solidarité',
    ],
    visibility: 'membres',
    example: true,
  },
  {
    id: 'mariage',
    type: 'joie',
    title: 'Mariage d’un camarade',
    date: daysAgo(40),
    text: 'Exemple : l’album du mariage est disponible pour les membres.',
    link: { to: '/album/mariage-exemple', label: 'Voir l’album' },
    reactions: 26,
    visibility: 'public',
    example: true,
  },
]
