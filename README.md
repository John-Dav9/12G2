# 12G2 · Plateforme numérique de l'association

Propositions pour la plateforme pérenne du 12G2 : un espace pour présenter l'association, conserver ses souvenirs et rendre hommage aux camarades disparus, à commencer par **Martine Tchuente** et **Simon Nanfa**.

## Contenu du dépôt

| Dossier | Contenu |
|---|---|
| [`propositions/`](propositions/) | Les deux offres avec leurs proformas, et l'analyse des inspirations |
| [`offre-01-memoire-souvenirs/`](offre-01-memoire-souvenirs/) | Simulation React de l'**offre 01 « Mémoire & Souvenirs »** (formule simplifiée) |
| [`offre-02-memoire-vie/`](offre-02-memoire-vie/) | Simulation React de l'**offre 02 « Mémoire & Vie »** (formule complète) |

## Les deux offres en bref

| | Offre 01 · Mémoire & Souvenirs | Offre 02 · Mémoire & Vie |
|---|---|---|
| Pour qui | Un espace de souvenirs et de condoléances, vite et pour pas cher | La maison numérique du 12G2, où chaque membre contribue |
| Vidéo | Une par espace mémoire, via YouTube | Envoi depuis le téléphone (200 Mo par fichier), 1 000 minutes incluses |
| Membres | Pas de comptes : 3 administrateurs publient | Espace membre sur invitation, annuaire, contributions validées, 5 administrateurs |
| Réalisation | 300 000 F CFA | 650 000 F CFA |
| Total année 1 | ≈ 307 000 F CFA | ≈ 718 000 F CFA |
| Par an ensuite | ≈ 7 000 F CFA (≈ 43 000 avec l'assistance) | ≈ 68 000 F CFA (≈ 140 000 avec la maintenance) |
| Délai | Espaces mémoire sous 5 jours ouvrés, site complet sous 7 à 10 jours | Hommages sous 7 jours ouvrés, plateforme complète sous 15 à 20 jours |

Détails : [offre 01](propositions/OFFRE-01-Memoire-et-Souvenirs.md), [offre 02](propositions/OFFRE-02-Memoire-et-Vie.md), [analyse et optimisations](propositions/ANALYSE-ET-OPTIMISATIONS.md).

## Lancer une simulation

Il faut [Node.js](https://nodejs.org/) 20 ou plus récent.

```bash
cd offre-01-memoire-souvenirs   # ou offre-02-memoire-vie
npm install
npm run dev
```

Ouvrez ensuite l'adresse affichée (en général `http://localhost:5173`). `npm run build` produit un site statique dans `dist/`, publiable sur n'importe quel hébergement de fichiers.

Les simulations n'ont pas de serveur : les photos et les messages sont des exemples, et ce que vous ajoutez reste dans votre navigateur jusqu'au rechargement de la page. Les codes de démonstration sont indiqués à l'écran et dans le README de chaque dossier.

## Avant la version définitive

- Remplacer les emplacements photo par les vraies photos, avec l'accord des familles.
- Compléter les dates, biographies et programmes des obsèques.
- Indiquer le prestataire et le traitement des taxes sur les proformas.
- Vérifier la disponibilité du nom de domaine.
