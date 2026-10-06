# Offre 02 · 12G2 Mémoire & Vie (simulation)

Simulation d'interface de la formule complète : la maison numérique du 12G2, avec archives, actualités, espaces mémoire enrichis, espace membre et gestion à cinq administrateurs. L'offre complète et sa proforma sont dans [`../propositions/OFFRE-02-Memoire-et-Vie.md`](../propositions/OFFRE-02-Memoire-et-Vie.md).

## Lancer

```bash
npm install
npm run dev      # simulation sur http://localhost:5173
npm run build    # site statique dans dist/
```

## Ce que montre la simulation

| Écran | À essayer |
|---|---|
| Accueil | Prochaine rencontre, dernières nouvelles, espaces mémoire, albums, bureau de l'association |
| Archives | Albums publics ou réservés aux membres, photos et vidéos, filtres par catégorie et par année |
| Album réservé | « Obsèques de Simon Nanfa » : visible après connexion d'un membre |
| Connexion membre | « Continuer avec Google », ou email `camarade@example.org` et code `271828` |
| Espaces mémoire | Bougie du souvenir, programme et informations pratiques, photos et vidéos, anecdotes, condoléances |
| Actualités | Confirmer sa présence à une rencontre, féliciter, lire un compte rendu réservé aux membres |
| Membres | Annuaire avec recherche, lien d'invitation |
| Mon espace | Proposer un hommage, un souvenir, des photos ou une vidéo (200 Mo au maximum), suivre leur validation |
| Gestion | Connexion avec `presidente@example.org` et le code `482913` |
| Gestion · À valider | Publier une contribution : elle apparaît dans l'espace ou l'album, et son statut passe à « Publié » dans Mon espace |
| Gestion · autres rubriques | Inscriptions, photos, espaces mémoire et albums (visibilité), actualités, sauvegardes, administrateurs |

Une vidéo choisie sur l'appareil se lit vraiment dans la visionneuse. Les vidéos d'exemple affichent une lecture simulée. Rien n'est envoyé : l'exemple revient au rechargement de la page.

## Organisation du code

```
src/
  data/        textes, albums, espaces mémoire, actualités, membres, contributions, offre
  lib/         routage par ancre, état de la simulation, formats, réduction des photos
  components/  en-tête, connexion, visionneuse et vidéos, bougie, barrière « membres »…
  pages/       accueil, archives, album, espace mémoire, actualités, membres, mon espace, gestion
  styles.css   palette claire et sombre, typographies, mise en page
```

Pour la version définitive, ces écrans servent de base. Les données de `src/data/` seront remplacées par une API (Cloudflare Workers et D1), les photos stockées dans Cloudflare R2, les vidéos dans Cloudflare Stream, et la connexion des membres assurée par compte Google ou code par email.
