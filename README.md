# Petits Loups

Site pour enfants (comptines, histoires, petits jeux) pensé pour un vieil **iPad 2 sous iOS 9.3.5**.

- Tout est en HTML, CSS et JavaScript ES5, sans bibliothèque, pour rester compatible avec Safari 9.
- Une seule page (`index.html`) : en mode « écran d'accueil », un lien classique ouvrirait Safari.
- **Espace parent** : appui long de 3 secondes sur le cadenas en haut à droite.
- **Minuteur** : choisi dans l'espace parent. À la fin, tous les sons s'arrêtent et un écran « C'est fini » s'affiche jusqu'à ce qu'un parent relance.

## Installer sur l'iPad

1. Ouvrir l'adresse du site dans Safari.
2. Bouton Partager, puis « Sur l'écran d'accueil ».
3. Lancer « Petits Loups » depuis l'icône : il s'ouvre en plein écran.

## Tester sur un ordinateur

Ouvrir `index.html` dans un navigateur. Pour la compatibilité, vérifier `js/app.js` en ES5 :
`npx acorn --ecma5 js/app.js`
