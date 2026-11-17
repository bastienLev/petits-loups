# Petits Loups

Site pour enfants (comptines, histoires, petits jeux) pensé pour un vieil.

- Tout est en HTML, CSS et JavaScript ES5, sans bibliothèque, pour rester compatible avec Safari 9.
- Une seule page (`index.html`) : en mode « écran d'accueil », un lien classique ouvrirait Safari.
- **Espace parent** : appui long de 3 secondes sur le cadenas en haut à droite.
- **Minuteur** : choisi dans l'espace parent. À la fin, tous les sons s'arrêtent et un écran « C'est fini » s'affiche jusqu'à ce qu'un parent relance.

## Contenu (étape 2)

- **Comptines** (Petit) : Petit escargot, Meunier tu dors, Les crocodiles (paroles lues par la voix de l'iPad), Frère Jacques et Au clair de la lune (boîte à musique).
- **Noël** : Jingle Bells, We Wish You a Merry Christmas, Deck the Halls, Silent Night, Twinkle Twinkle (boîte à musique, paroles en anglais).
- **Histoires** (Grand) : les trois petits cochons, le Petit Chaperon rouge (version douce), Boucle d'or, Cendrillon. Bouton 🔊 pour la lecture à voix haute.
- **Dodo** : écran sombre, voix et musique plus lentes, l'histoire se lit toute seule puis un écran « Bonne nuit » s'affiche (le parent le ferme avec le cadenas).
- Tout le contenu est dans `js/contenu.js`.

## Jeux du grand (étape 3)

Dans `js/jeux.js` : Memory (3, 4 puis 6 paires), Les ombres (glisser chaque objet sur son ombre), Les couleurs (ranger les formes dans le panier de la même couleur), Le chemin (guider l'abeille jusqu'à la fleur avec le doigt). Chaque réussite affiche « Bravo ! » et la manche suivante est un peu plus difficile.

## Hors connexion et mises à jour (étape 4)

- `petits-loups.appcache` liste les fichiers que l'iPad garde pour marcher sans internet (Safari 9 ne connaît que l'« Application Cache »).
- **Après chaque modification du site, relancer** `python outils/manifeste.py` : la version change et l'iPad télécharge la nouvelle version tout seul, puis l'installe au retour à l'accueil.
- L'état « Hors connexion : prêt ✓ » s'affiche dans l'espace parent.

## Installer sur l'iPad

1. Ouvrir l'adresse du site dans Safari.
2. Bouton Partager, puis « Sur l'écran d'accueil ».
3. Lancer « Petits Loups » depuis l'icône : il s'ouvre en plein écran.

## Tester sur un ordinateur

Ouvrir `index.html` dans un navigateur. Pour la compatibilité, vérifier `js/app.js` en ES5 :
`npx acorn --ecma5 js/app.js`
