# Génération de noms d'utilisateur

L'endpoint `/username` renvoie une liste d'adjectifs, une autre avec des noms d'animaux et la dernière avec des métiers. Un nombre ainsi qu'un nom d'utilisateur aléatoire est généré à partir de toutes les informations. Cet endpoint ne nécessite aucune option.

<Endpoint method="get" path="/username" />

## Paramètres

Cet endpoint ne nécessite aucun paramètre.

## Exemple de requête

```
GET /v3/username
```

## Réponse

```json
{
  "adjective": [
    "Happy",
    "Silly",
    "Clever",
    "Creative",
    "Brave",
    ...
  ],
  "animal": [
    "Cat",
    "Dog",
    "Tiger",
    "Elephant",
    "Monkey",
    ...
  ],
  "job": [
    "Writer",
    "Artist",
    "Musician",
    "Explorer",
    "Scientist",
    ...
  ],
  "number": "99",
  "username": "HappyCat99"
}
```

## Champs de réponse

| Champ       | Description                            |
| ----------- | -------------------------------------- |
| `adjective` | Liste d'adjectifs                      |
| `animal`    | Liste de noms d'animaux                |
| `job`       | Liste de métiers                       |
| `number`    | Nombre généré aléatoirement            |
| `username`  | Nom d'utilisateur généré aléatoirement |

## cURL

```bash
curl -X GET "https://api.moxon.dev/v3/username"
```

## Cas d'utilisation

- **Inscription utilisateur** : Suggérer des noms d'utilisateur lors de l'inscription
- **Jeux** : Générer des noms de joueurs
- **Tests** : Créer des données d'utilisateurs de test
- **Contenu de remplacement** : Remplir des données d'exemple

## Note

Le nom d'utilisateur peut être composé d'un ou plusieurs éléments choisis parmi les listes ou du nombre généré.
