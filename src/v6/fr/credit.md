# Génération de cartes bancaires

L'endpoint `/credit` génère des numéros de cartes bancaires fictifs à des fins de test. Tous les numéros passent l'algorithme de checksum Luhn et utilisent les préfixes IIN corrects pour chaque marque.

<Endpoint method="get" path="/credit" baseUrl="https://api.sylvain.sh" />

## Paramètres

| Paramètre | Requis | Défaut   | Description                                                                                     |
| --------- | ------ | -------- | ----------------------------------------------------------------------------------------------- |
| `brand`   | Non    | `random` | Marque de la carte : `visa`, `mastercard`, `amex`, `discover`                                   |
| `count`   | Non    | `1`      | Nombre de cartes à générer (1–10)                                                               |
| `format`  | Non    | `masked` | Format de sortie : `full` (tous les chiffres) ou `masked` (chiffres du milieu masqués avec `*`) |

## Champs de réponse

La réponse contient un tableau `cards`. Chaque objet carte possède les champs suivants :

| Champ       | Type      | Description                                                      |
| ----------- | --------- | ---------------------------------------------------------------- |
| `number`    | `string`  | Numéro de carte, masqué ou complet selon le `format`             |
| `formatted` | `string`  | Numéro de carte lisible avec espaces (ex. `4532 **** **** 1234`) |
| `brand`     | `string`  | Marque de la carte (`visa`, `mastercard`, `amex`, `discover`)    |
| `expiry`    | `string`  | Date d'expiration au format `MM/AA`                              |
| `cvv`       | `string`  | Code de sécurité (3 chiffres, 4 pour Amex)                       |
| `luhn`      | `boolean` | Toujours `true` — le numéro passe le checksum Luhn               |

## Exemples de code

<Examples method="get" path="/credit" :params="{ brand: 'visa', count: '2', format: 'full' }" />

## Essayer

<Try name="Credit" />

## Gestion des erreurs

| Message d'erreur                                                           | Description                                         |
| -------------------------------------------------------------------------- | --------------------------------------------------- |
| `Unknown brand "{brand}". Valid options: visa, mastercard, amex, discover` | La valeur de `brand` n'est pas reconnue             |
| `Count must be an integer between 1 and 10`                                | Le paramètre `count` est hors de la plage autorisée |
| `Format must be "full" or "masked"`                                        | La valeur de `format` n'est pas valide              |
