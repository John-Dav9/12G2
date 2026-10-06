# Analyse des inspirations et optimisations

Ce document retrace la démarche : mes deux propositions de départ, l'analyse des deux offres d'inspiration, puis les offres finales optimisées.

- Offre finale 01 : [OFFRE-01-Memoire-et-Souvenirs.md](OFFRE-01-Memoire-et-Souvenirs.md)
- Offre finale 02 : [OFFRE-02-Memoire-et-Vie.md](OFFRE-02-Memoire-et-Vie.md)

## 1. Le besoin

Le cahier des charges du 12G2 demande deux propositions et une simulation d'interface :

1. une plateforme **simplifiée** : photos et vidéos très limitées, une au maximum ;
2. une plateforme **complète** : photos et vidéos à volonté, pour « vivre pleinement le 12G2 ».

Les deux présentent le 12G2 et ses activités, avec un onglet par camarade disparu (Martine Tchuente, Simon Nanfa), un espace où chacun peut laisser un hommage et la possibilité d'ajouter facilement un onglet. La plateforme doit durer et rester gérable par les membres, « que je sois là ou pas ».

## 2. Mes deux propositions de départ

| | Formule simplifiée | Formule complète |
|---|---|---|
| Contenu | Accueil, galerie, espaces mémoire, livre de condoléances validé | Tout le simplifié + espace membre, fil d'actualité social (« j'aime », commentaires partout), albums collaboratifs, vidéothèque, agenda, notifications push |
| Vidéo | 1 par espace mémoire, via YouTube | Illimitée, lecture adaptée à la connexion |
| Gestion | 2 à 3 administrateurs | Rôles et modération avancée |
| Technique | Site statique et services Cloudflare gratuits | Même base, plus vidéo Cloudflare Stream |
| Réalisation | 250 000 F CFA | 850 000 F CFA |
| Frais annuels | ≈ 10 000 F CFA | ≈ 70 000 à 100 000 F CFA |
| Délai | 2 semaines | 6 semaines |

Leur point fort : des **frais annuels très bas**, sans serveur à entretenir. Leur point faible : la formule complète était chère et chargée de fonctions qui doublonnent WhatsApp.

## 3. Ce que les inspirations m'ont apporté

Les deux offres d'inspiration sont claires, bien structurées et proches du terrain. J'ai repris :

| Élément repris | Pourquoi |
|---|---|
| La structure du document : objectif, organisation, administration, livrables, périmètre, budget, délai, paiement, éléments à fournir, mentions | Lisible par le bureau et directement présentable |
| Les noms **« Mémoire & Souvenirs »** et **« Mémoire & Vie »** | Plus parlants que « simplifiée » et « complète » |
| Le **programme des obsèques** et les **informations pratiques** dans chaque espace | Indispensable, et absent de mes propositions |
| Albums légendés, affichage plein écran, classement par année et par événement | Attendu pour des souvenirs |
| Le **bouton de partage WhatsApp** | C'est là que vit le 12G2 |
| **3 administrateurs** (offre 01) et **5 avec des droits adaptés** (offre 02), chacun avec un compte personnel | Répond à « les accès seront donnés à tous » sans mot de passe partagé |
| Condoléances possibles **sans compte** pour les visiteurs | Les familles et amis n'ont pas à s'inscrire |
| Visibilité **publique ou réservée aux membres** par album et par espace | Respect des familles pour les images des obsèques |
| Actualités et événements : rencontres, **comptes rendus**, solidarité | Mieux ciblé qu'un fil social |
| « Retrouver ses contributions » | Le membre voit si son envoi est publié |
| Domaine et hébergement **au nom de l'association**, accès et documentation remis | Garantit la pérennité |
| Sauvegardes avec durée de conservation | Engagement concret |
| **200 Mo par vidéo** | Limite claire pour les envois depuis un téléphone |
| Maquettes avec séries de corrections, formations, guide, **30 jours d'accompagnement** | Livrables précis |
| Version **« hommages d'abord » sous 7 jours ouvrés** | Urgent pour Simon |
| Paiement **50/50** et **50/30/20** | Usages courants et rassurants |
| « Éléments à fournir », **accord des familles**, mention sur les taxes | Évite les malentendus |

## 4. Ce que j'ai gardé de mes propositions

| Élément conservé | Gain pour le 12G2 |
|---|---|
| Hébergement sans serveur sur les offres gratuites de Cloudflare | Frais annuels de l'offre 01 : **≈ 7 000 F CFA** au lieu de 140 000 F CFA |
| **Une vidéo par espace mémoire** dans l'offre 01, au lieu d'une pour tout le site | Chaque famille a sa vidéo, sans coût puisqu'elle reste sur YouTube |
| **Album des obsèques protégé par un code** dans l'offre 01 | Une protection simple, sans espace membre |
| Connexion par **code à usage unique** reçu par email | Aucun mot de passe à partager ni à oublier |
| Photos **réduites automatiquement** avant l'envoi | Pages légères sur les connexions mobiles |
| **Lecture vidéo adaptée à la connexion** dans l'offre 02 | Les membres ne paient pas leurs données en vidéo haute définition |
| Bougie du souvenir, anecdotes, rappel à la date anniversaire, annuaire | Fait vivre les espaces mémoire et le lien entre camarades |
| **Coût par membre** dans chaque offre | Aide le bureau à fixer une cotisation |
| **Évolution de l'offre 01 vers l'offre 02** sans refonte | On peut commencer petit |
| Maquettes **déjà réalisées en React**, qui serviront de base au vrai site | Gain de temps sur la réalisation |

## 5. Ce que j'ai changé

**Offre 01 : 250 000 → 300 000 F CFA de réalisation.** J'ai ajouté le programme des obsèques, les informations pratiques, le partage WhatsApp, trois comptes administrateurs personnels, les sauvegardes, la formation et le guide. Elle reste moins chère à la réalisation (300 000 contre 350 000 F CFA) et surtout dans la durée.

**Offre 02 : 850 000 → 650 000 F CFA de réalisation.** J'ai retiré le fil social avec « j'aime » et commentaires partout, qui doublonne le groupe WhatsApp et alourdit la modération. Je l'ai remplacé par des actualités structurées et des contributions validées, comme dans l'inspiration 2. Les notifications push passent en option.

**Points des inspirations que je n'ai pas repris :**

- 80 000 F CFA par an de domaine et d'hébergement : le domaine coûte environ 7 000 F CFA et l'hébergement peut être gratuit à cette échelle ;
- une seule vidéo pour tout le site (inspiration 1) : remplacée par une vidéo par espace ;
- 50 photos intégrées et 5 Go (inspiration 1) : portés à 100 photos et 10 Go, sans surcoût ;
- vidéos de 200 Mo lues telles quelles (inspiration 2) : lecture adaptée à la connexion ;
- maintenance à 150 000 F CFA par an (inspiration 2) : 72 000 F CFA, car il n'y a pas de serveur à entretenir.

## 6. Comparaison chiffrée

| | Inspiration 1 | **Offre 01** | Inspiration 2 | **Offre 02** |
|---|---:|---:|---:|---:|
| Réalisation | 350 000 | **300 000** | 650 000 | **650 000** |
| Total année 1 | 430 000 | **≈ 307 000** | 730 000 | **≈ 718 000** |
| Par an ensuite, avec maintenance | 140 000 | **≈ 43 000** | 230 000 | **≈ 140 000** |
| Par an ensuite, sans maintenance | non prévu | **≈ 7 000** | non prévu | **≈ 68 000** |
| **Coût sur 5 ans, avec maintenance** | 990 000 | **≈ 479 000** | 1 650 000 | **≈ 1 278 000** |
| Délai | 7 à 10 jours | 5 jours (hommages), 7 à 10 jours | 7 jours (hommages), 15 à 20 jours | 7 jours (hommages), 15 à 20 jours |

Montants en F CFA. Sur cinq ans, l'offre 01 coûte environ deux fois moins que l'inspiration 1, et l'offre 02 environ 370 000 F CFA de moins que l'inspiration 2, avec plus de fonctions.

## 7. Recommandation

Pour le 12G2, je recommande de **commencer par l'offre 01** : les espaces de Martine et de Simon sont en ligne sous 5 jours ouvrés, avec les photos des obsèques, pour environ 6 140 F CFA par membre. Si les camarades participent activement, le passage à l'offre 02 se fait plus tard en réglant la différence, sans rien refaire.

Si le bureau veut tout de suite une plateforme de vie pour le 12G2, l'offre 02 est prête, avec une première version centrée sur les hommages sous 7 jours ouvrés.

## 8. Sources des prix tiers

- Cloudflare Stream : 5 $ par tranche de 1 000 minutes stockées, 1 $ pour 1 000 minutes regardées, encodage gratuit ([tarifs](https://developers.cloudflare.com/stream/pricing/)).
- Cloudflare R2 : 10 Go gratuits par mois, puis 0,015 $ par Go et par mois, sans frais de sortie ([tarifs](https://developers.cloudflare.com/r2/pricing/)).
- Nom de domaine en .com chez Cloudflare Registrar : 10,46 $ par an au prix coûtant ([relevé de prix](https://domainoffer.net/tld/com/cloudflare)).
- Conversion sur la base de 600 F CFA pour 1 $, une base prudente à réviser au taux du jour.
