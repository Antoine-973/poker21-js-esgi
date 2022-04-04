https://antoine-973.github.io/poker21-js-esgi/

# POKER-JS-21
Notre application est une simulation de black-jack, dans ce jeu vous disposerez d'une main de carte, 2 au départ et vous pourrez piocher des cartes afin d'obtenir ou de se rapprocher du nombre 21. Attention cependant à ne pas dépasser ce nombre car vous perdrez directement la partie.
Bon courage !

## Les raccourcis en jeu
Piocher une carte : flèche directionnelle gauche
Arrêter de piocher : flèche directionnelle droite
Pour abandonner : flèche directionnelle bas

## Notes importantes
Si vous disposez d'un faible bande passante, le tirage prends un certains temps, durant celui-ci, 
vous pouvez appuyer sur 'flèche directionnelle haut' pour interrompre le tirage.

## Docker
Pour lancer l'application sous docker, vous devez disposez de la librairie make pour éxécuter les makefile
`make start`
Si vous souhaitez la stop faîtes :
`make stop`
Si vous souhaitez la relancer faîtes :
`make restart`

## Les fonctionnalités
- Possibilité de jouer au blackjack, en respectant les règles.
- Responsive
- Possibilité d'annuler le tirage d'une carte si la bande passante est mauvaise
- Affichage et sauvegarde de statistiques du joueurs
- Animation ( visuel et vibration) lors d'évènements comme les victoires / défaites / pioche.
- Sauvegarde des données et de la session dans le local storage
- Possibilité de lancer les fonctions via les touches du clavier
- Fonctionne sous docker
