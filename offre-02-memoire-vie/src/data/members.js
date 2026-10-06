import { daysAgo } from '../lib/format.js'

// Annuaire d'exemple : noms génériques, villes et métiers indicatifs.
export const initialMembers = [
  { id: 'mb-a', nom: 'Camarade A.', ville: 'Douala', metier: 'Comptable' },
  { id: 'mb-b', nom: 'Camarade B.', ville: 'Yaoundé', metier: 'Enseignante' },
  { id: 'mb-c', nom: 'Camarade C.', ville: 'Bafoussam', metier: 'Commerçant' },
  { id: 'mb-d', nom: 'Camarade D.', ville: 'Paris', metier: 'Infirmière' },
  { id: 'mb-e', nom: 'Camarade E.', ville: 'Montréal', metier: 'Informaticien' },
  { id: 'mb-f', nom: 'Camarade F.', ville: 'Douala', metier: 'Banquière' },
  { id: 'mb-g', nom: 'Camarade G.', ville: 'Dschang', metier: 'Agronome' },
  { id: 'mb-h', nom: 'Camarade H.', ville: 'Bruxelles', metier: 'Entrepreneur' },
]

export const initialSignups = [
  {
    id: 'insc-1',
    nom: 'Nouvelle inscription',
    email: 'nouveau.membre@example.org',
    message: 'J’étais au 12G2, je souhaite rejoindre la plateforme.',
    date: daysAgo(0),
    example: true,
  },
  {
    id: 'insc-2',
    nom: 'Camarade de la diaspora',
    email: 'diaspora@example.org',
    message: 'J’ai reçu le lien d’invitation dans le groupe WhatsApp.',
    date: daysAgo(1),
    example: true,
  },
]
