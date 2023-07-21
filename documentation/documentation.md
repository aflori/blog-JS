# Les conventions d'écriture du dépôt

## Les commits

Les commits sont réalisé sous la forme
'type' ('version'): 'description courte'
- Où le **type** correspond à la nature d'une modification ( _feat_ pour ajouter des éléments, _refacto_ pour modifier l'organisation d'un projet, _doc_ pour la documentation, etc.)
- La **version** correspond au code de progression sur le planning (disponible [ici](https://github.com/users/aflori/projects/5/views/1)). Donc la version en 0.4.x correspond à l'ajoût de cette documentation
- La **description** indique quel est le sujet du commit.

## La structure du dépôt

Chaque dossier contient des informations sur le projet:

1. Dans le dossier de base, on retrouve toutes les pages HTML
2. Dans le dossier CSS, on y retrouve les feuilles de style
3. Dans le dossier image, on y retrouve les images qui apparaissent sur les différentes pages du site
4. Dans le dossier javascript, on y retrouve tous les script
5. Dans le dossier template, on y retrouve tout ce qui est lié aux donnée de base (fichier JSON, ...)
6. Dans le dossier documentation, on y retrouve la documentation avec ce fichier et le wireframe (maquette de début de projet des différentes pages)


## Les fonctions des scripts JS

### Fonctions lié à la mise à jour 1:

+ recupApiJoke() -> La fonction ne prend pas de paramètre et retourne un objet _Promise_ contenant une API de 10 blagues.