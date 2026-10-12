# Génération de noms d'utilisateurs

L'endpoint `/username` renvoie une liste d'adjectifs, une autre avec des noms d'animaux et la dernière avec des métiers. Un nombre ainsi qu'un nom d'utilisateur aléatoire est généré à partir de toutes les informations. Cet endpoint ne nécessite aucune option.

_Le nom d'utilisateur peut être composé d'un ou plusieurs éléments choisis parmi les listes ou du nombre généré._

<Endpoint method="get" path="/username" />

## Exemple de requête

```
GET /v1/username
```

## Réponse

```json
{
    "adjective": ["Happy", "Silly", "Clever", "Creative", "Brave", "..."],
    "animal": ["Cat", "Dog", "Tiger", "Elephant", "Monkey", "..."],
    "job": ["Writer", "Artist", "Musician", "Explorer", "Scientist", "..."],
    "number": "99",
    "username": "HappyCat99"
}
```

## cURL

```bash
curl -X GET "https://api.moxon.dev/v1/username"
```
