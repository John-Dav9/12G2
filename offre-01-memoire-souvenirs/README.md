# Offre 01 · 12G2 Mémoire & Souvenirs (simulation)

Simulation d'interface de la formule simplifiée : un site sobre pour présenter le 12G2, conserver ses souvenirs en photos et rendre hommage à Martine Tchuente et Simon Nanfa. L'offre complète et sa proforma sont dans [`../propositions/OFFRE-01-Memoire-et-Souvenirs.md`](../propositions/OFFRE-01-Memoire-et-Souvenirs.md).

## Lancer

```bash
npm install
npm run dev      # simulation sur http://localhost:5173
npm run build    # site statique dans dist/
```

## Ce que montre la simulation

| Écran | À essayer |
|---|---|
| Accueil | Présentation du 12G2, accès aux espaces mémoire et aux derniers albums |
| Galerie des souvenirs | Filtres par catégorie et par année, ouverture d'un album, visionneuse plein écran (flèches, balayage, Échap) |
| Espaces « In memoriam » | Onglets Martine Tchuente et Simon Nanfa : hommage, programme des obsèques, albums, vidéo, livre de condoléances, partage WhatsApp |
| Album des obsèques | Protégé par un code : `12G2` |
| Livre de condoléances | Écrire un message : il part en validation, puis apparaît après accord d'un administrateur |
| Gestion | Connexion avec `presidente@example.org` et le code `482913` |
| Gestion · Messages | Publier ou refuser les messages en attente |
| Gestion · Photos | Choisir de vraies photos sur l'appareil : elles sont réduites (taille avant et après affichée) puis publiées dans l'album choisi |
| Gestion · Espaces mémoire | Créer un espace : son onglet apparaît aussitôt dans le menu In memoriam |
| Bandeau du haut | « Voir l'offre et le budget » ouvre le résumé de l'offre et sa proforma |

Tout se passe dans le navigateur : rien n'est envoyé, et l'exemple revient au rechargement de la page.

## Organisation du code

```
src/
  data/        textes, albums, espaces mémoire, messages et résumé de l'offre
  lib/         routage par ancre, état de la simulation, formats, réduction des photos
  components/  en-tête, visionneuse, livre de condoléances, partage, fenêtre de l'offre…
  pages/       accueil, galerie, album, espace mémoire, gestion
  styles.css   palette claire et sombre, typographies, mise en page
```

Pour la version définitive, ces écrans servent de base. Les données de `src/data/` seront remplacées par une API (Cloudflare Workers et D1), les photos stockées dans Cloudflare R2, et la connexion des administrateurs assurée par Cloudflare Access.
