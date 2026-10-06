import { daysAgo } from '../lib/format.js'

// Contributions des membres (souvenirs, hommages, photos, vidéos), toutes validées avant publication.
export const CONTRIBUTION_TYPES = [
  { id: 'hommage', label: 'Un hommage' },
  { id: 'souvenir', label: 'Un souvenir' },
  { id: 'photos', label: 'Des photos' },
  { id: 'video', label: 'Une vidéo' },
]

export const contributionLabel = (id) => CONTRIBUTION_TYPES.find((t) => t.id === id)?.label ?? ''

export const initialAnecdotes = [
  {
    id: 'anec-1',
    memorial: 'simon-nanfa',
    author: 'Camarade A.',
    text: 'Ici, un camarade raconte un souvenir d’école partagé avec Simon, avec une photo de l’époque.',
    date: daysAgo(2),
    withPhoto: true,
    example: true,
  },
  {
    id: 'anec-2',
    memorial: 'martine-tchuente',
    author: 'Camarade B.',
    text: 'Ici, une camarade raconte une anecdote des retrouvailles où Martine était présente.',
    date: daysAgo(15),
    withPhoto: false,
    example: true,
  },
]

export const initialContributions = [
  {
    id: 'contrib-1',
    type: 'souvenir',
    author: 'Camarade Démo',
    mine: true,
    target: { kind: 'memorial', id: 'simon-nanfa' },
    text: 'Exemple de souvenir déjà publié dans l’espace de Simon.',
    date: daysAgo(3),
    status: 'publié',
    example: true,
  },
  {
    id: 'contrib-2',
    type: 'photos',
    author: 'Camarade Démo',
    mine: true,
    target: { kind: 'album', id: 'retrouvailles-2025' },
    count: 3,
    date: daysAgo(1),
    status: 'en attente',
    example: true,
  },
  {
    id: 'contrib-3',
    type: 'video',
    author: 'Camarade C.',
    target: { kind: 'album', id: 'obseques-simon-nanfa' },
    caption: 'La chorale pendant la veillée',
    size: 148 * 1024 * 1024,
    duration: '2:20',
    date: daysAgo(0),
    status: 'en attente',
    example: true,
  },
  {
    id: 'contrib-4',
    type: 'souvenir',
    author: 'Camarade D.',
    target: { kind: 'memorial', id: 'martine-tchuente' },
    text: 'Exemple d’anecdote proposée par une camarade, en attente de validation.',
    date: daysAgo(0),
    status: 'en attente',
    example: true,
  },
]
