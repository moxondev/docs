# Distance de Levenshtein

L'endpoint `/levenshtein` permet de calculer la distance de Levenshtein entre deux chaînes de caractères. Cette distance représente le nombre minimum d'opérations nécessaires pour transformer une chaîne en une autre.

<Endpoint method="post" path="/levenshtein" baseUrl="https://api.sylvain.sh" />

::: warning Changement en 6.0.0
Cet endpoint passe de `GET` à `POST`. Les deux chaînes comparées sont désormais envoyées dans un corps JSON plutôt qu'en paramètres d'URL : elles ne transitent donc plus par l'URL, ni par l'historique de navigation, ni par les journaux d'un intermédiaire.
:::

::: info Comment ça marche ?
La distance de Levenshtein compte le nombre minimum d'éditions (insertions, suppressions, substitutions) pour transformer une chaîne en une autre. Utile pour la vérification orthographique, la correspondance approximative, l'analyse ADN et la détection de plagiat.
:::

## Paramètres

| Paramètre | Requis | Description                              |
| --------- | ------ | ---------------------------------------- |
| `str1`    | Oui    | La première chaîne (max 1000 caractères) |
| `str2`    | Oui    | La deuxième chaîne (max 1000 caractères) |

Les deux paramètres sont envoyés dans un corps JSON avec `Content-Type: application/json`.

## Champs de réponse

| Champ      | Type     | Description                                       |
| ---------- | -------- | ------------------------------------------------- |
| `str1`     | `string` | La première chaîne d'entrée                       |
| `str2`     | `string` | La deuxième chaîne d'entrée                       |
| `distance` | `number` | La distance de Levenshtein entre les deux chaînes |

## Exemples de code

<Examples method="post" path="/levenshtein" :body="{ str1: 'example', str2: 'samples' }" />

## Essayer

<Try name="Levenshtein" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                        | Description                      |
| --------------------------------------- | -------------------------------- |
| `Please provide a first string (str1)`  | Le paramètre `str1` est manquant |
| `Please provide a second string (str2)` | Le paramètre `str2` est manquant |
