# Algorithmes

L'endpoint `/algorithms` fournit plusieurs algorithmes à utiliser comme paramètres. Vous pouvez entrer une ou deux valeurs selon l'algorithme.

<Endpoint method="get" path="/algorithms" baseUrl="https://api.sylvain.sh" />

## Paramètres

| Paramètre | Requis | Description                                                                      |
| --------- | ------ | -------------------------------------------------------------------------------- |
| `method`  | Oui    | L'algorithme à utiliser (voir les méthodes disponibles ci-dessous)               |
| `value`   | Oui    | La valeur à utiliser dans l'algorithme. Doit contenir au moins un caractère      |
| `value2`  | Non    | La deuxième valeur à utiliser si nécessaire. Doit contenir au moins un caractère |

## Méthodes disponibles

| Méthode        | Description                                                    | Nécessite `value2` | Limites             |
| -------------- | -------------------------------------------------------------- | ------------------ | ------------------- |
| `anagram`      | Vérifie si deux chaînes sont des anagrammes                    | Oui                | Max 1000 caractères |
| `bubblesort`   | Trie un tableau de nombres, séparés par des virgules           | Non                | Max 1000 éléments   |
| `factorial`    | Calcule la factorielle d'un nombre entre 0 et 170              | Non                | 0–170               |
| `fibonacci`    | Calcule une séquence de Fibonacci jusqu'à un nombre donné      | Non                | 0–1000              |
| `gcd`          | Calcule le plus grand commun diviseur de deux nombres          | Oui                | 1–100 000           |
| `isprime`      | Vérifie si un nombre est premier                               | Non                | 1–100 000           |
| `palindrome`   | Vérifie si une chaîne est un palindrome                        | Non                | Max 1000 caractères |
| `primelist`    | Retourne une liste de nombres premiers jusqu'à un nombre donné | Non                | 2–10 000            |
| `primefactors` | Retourne la liste des facteurs premiers d'un nombre            | Non                | 1–100 000           |
| `reverse`      | Inverse une chaîne                                             | Non                | Max 1000 caractères |
| `roman`        | Convertit entre chiffres romains et nombres (1–3999)           | Non                | 1–3999              |

## Champs de réponse

| Champ    | Type                                | Description                 |
| -------- | ----------------------------------- | --------------------------- |
| `answer` | `number\|string\|boolean\|number[]` | Le résultat de l'algorithme |

## Exemples de code

<Examples method="get" path="/algorithms" :params="{ method: 'gcd', value: '17', value2: '493' }" />

## Essayer

<Try name="Algorithms" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                                         | Description                                                         |
| -------------------------------------------------------- | ------------------------------------------------------------------- |
| `Please provide a valid algorithm (?method={algorithm})` | Le paramètre `method` est manquant ou invalide                      |
| `Value must be a number`                                 | `factorial`/`isprime` : `value` n'est pas numérique                 |
| `Value must be an integer`                               | `factorial`/`isprime` : `value` n'est pas un nombre entier          |
| `Number must be positive`                                | `factorial`/`isprime` : `value` est négatif (ou nul pour `isprime`) |
| `Number must be between 0 and 170`                       | `factorial` : `value` est hors de la plage autorisée                |
| `Number must be between 1 and 100000`                    | `isprime` : `value` est hors de la plage autorisée                  |
