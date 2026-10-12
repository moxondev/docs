# Algorithmes

L'endpoint `/algorithms` propose plusieurs algorithmes à entrer en paramètre. Il est possible d'entrer une ou deux valeurs en fonction de l'algorithme.

<Endpoint method="get" path="/algorithms" />

## Paramètres

| Paramètre | Requis | Description                                                                       |
| --------- | ------ | --------------------------------------------------------------------------------- |
| `method`  | Oui    | L'algorithme à utiliser (voir les méthodes disponibles ci-dessous)                |
| `value`   | Oui    | La valeur à utiliser dans l'algorithme. Doit contenir au minimum un caractère     |
| `value2`  | Non    | La seconde valeur à utiliser si nécessaire. Doit contenir au minimum un caractère |

## Méthodes disponibles

| Méthode        | Description                                                    | Nécessite `value2` |
| -------------- | -------------------------------------------------------------- | ------------------ |
| `anagram`      | Vérifie si deux chaînes sont des anagrammes                    | Oui                |
| `bubblesort`   | Trie un tableau de nombres, séparés par des virgules           | Non                |
| `factorial`    | Calcule la factorielle d'un nombre situé entre 0 et 170        | Non                |
| `gcd`          | Calcule le plus grand diviseur commun de deux nombres          | Oui                |
| `isprime`      | Vérifie si un nombre est premier                               | Non                |
| `fibonacci`    | Calcule une séquence de Fibonacci jusqu'à un nombre donné      | Non                |
| `palindrome`   | Vérifie si une chaîne est un palindrome                        | Non                |
| `primelist`    | Retourne une liste de nombres premiers jusqu'à un nombre donné | Non                |
| `primefactors` | Retourne la liste des facteurs premiers d'un nombre            | Non                |
| `reverse`      | Inverse une chaîne de caractères                               | Non                |

## Exemple de requête

```
GET /v2/algorithms?method=gcd&value=17&value2=493
```

## Réponse

```json
{
    "answer": 17
}
```

## cURL

```bash
curl -X GET "https://api.moxon.dev/v2/algorithms?method=gcd&value=17&value2=493"
```

## Gestion des erreurs

Si la valeur de `method` ou `value` est vide ou invalide, ou que `value2` est nécessaire mais vide, une erreur sera renvoyée.
