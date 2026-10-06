// Espaces mémoire. Les dates, biographies et programmes seront fournis par les familles :
// la simulation n'invente aucun fait, elle montre où chaque information prendra place.
export function defaultProgramme(intro = 'Programme communiqué par la famille.') {
  return {
    intro,
    etapes: [
      { label: 'Veillée', quand: 'Date et heure à compléter', ou: 'Lieu à compléter' },
      { label: 'Levée de corps', quand: 'Date et heure à compléter', ou: 'Lieu à compléter' },
      { label: 'Messe ou culte', quand: 'Date et heure à compléter', ou: 'Lieu à compléter' },
      { label: 'Inhumation', quand: 'Date et heure à compléter', ou: 'Lieu à compléter' },
    ],
    pratique: 'Plan d’accès, transport groupé du 12G2 et contacts de la famille : à compléter.',
  }
}

export const initialMemorials = [
  {
    slug: 'martine-tchuente',
    name: 'Martine Tchuente',
    firstName: 'Martine',
    monogram: 'MT',
    seed: 'martine-tchuente-couverture',
    dates: 'Dates à compléter avec la famille',
    accroche:
      'Pour celles et ceux qui n’ont pas pu être présents, cet espace permet de revivre ses obsèques en images et de lui rendre hommage.',
    bio: ['Martine était l’une des nôtres. Camarade de classe au 12G2, elle reste présente dans nos souvenirs d’école et dans nos cœurs.'],
    bioNote: 'Biographie à rédiger avec la famille : parcours, famille, ce qu’elle aimait.',
    programme: defaultProgramme('Les obsèques ont eu lieu. Le programme est conservé ici en souvenir.'),
    video: { title: 'Hommage du 12G2 à Martine' },
  },
  {
    slug: 'simon-nanfa',
    name: 'Simon Nanfa',
    firstName: 'Simon',
    monogram: 'SN',
    seed: 'simon-nanfa-couverture',
    dates: 'Dates à compléter avec la famille',
    accroche:
      'Cet espace rassemble les images de ses obsèques, nos messages et nos souvenirs, pour que sa mémoire reste vivante parmi nous.',
    bio: ['Simon était l’un des nôtres. Camarade de classe au 12G2, il reste présent dans nos souvenirs d’école et dans nos cœurs.'],
    bioNote: 'Biographie à rédiger avec la famille : parcours, famille, ce qu’il aimait.',
    programme: defaultProgramme(),
    video: { title: 'Hommage du 12G2 à Simon' },
  },
]
