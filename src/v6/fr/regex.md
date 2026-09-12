# Testeur de regex

L'endpoint `/regex` teste un pattern d'expression régulière contre une chaîne de texte et retourne les correspondances structurées avec leurs groupes capturants et groupes nommés.

<Endpoint method="get" path="/regex" baseUrl="https://api.sylvain.sh" />

::: tip Cas d'utilisation
Validez des patterns regex lors du développement, extrayez des données structurées depuis du texte brut, déboguez des groupes capturants complexes, ou construisez des aperçus de recherche basés sur des regex sans exécuter de code côté serveur.
:::

## Paramètres

| Paramètre | Requis | Description                                                                                |
| --------- | ------ | ------------------------------------------------------------------------------------------ |
| `pattern` | Oui    | Le pattern d'expression régulière à tester (max 200 caractères).                           |
| `text`    | Oui    | Le texte à tester contre le pattern (max 1000 caractères).                                 |
| `flags`   | Non    | Flags regex à appliquer. Acceptés : `i`, `m`, `s`, `u`. Le flag `g` est toujours appliqué. |

## Champs de réponse

| Champ                   | Type       | Description                                                                      |
| ----------------------- | ---------- | -------------------------------------------------------------------------------- |
| `valid`                 | `boolean`  | `true` si le pattern est une regex valide                                        |
| `pattern`               | `string`   | Le pattern tel que fourni                                                        |
| `flags`                 | `string`   | Les flags effectifs utilisés (inclut toujours `g`)                               |
| `count`                 | `number`   | Nombre total de correspondances trouvées                                         |
| `matches`               | `object[]` | Tableau des objets de correspondance                                             |
| `matches[].match`       | `string`   | La chaîne complète correspondante                                                |
| `matches[].index`       | `number`   | Index de début de la correspondance dans le texte                                |
| `matches[].groups`      | `string[]` | Tableau des valeurs de groupes capturants numérotés (chaîne vide si non capturé) |
| `matches[].namedGroups` | `object`   | Map clé-valeur des groupes capturants nommés (`(?<nom>...)`)                     |

## Exemples de code

<Examples method="get" path="/regex" :params="{ pattern: '\\d+', text: 'Commande 42 et article 7' }" />

## Essayer

<Try name="Regex" />

## Gestion des erreurs

| Message d'erreur                                      | Description                                          |
| ----------------------------------------------------- | ---------------------------------------------------- |
| `Please provide a pattern (?pattern=...)`             | Le paramètre `pattern` est manquant                  |
| `Please provide a text (?text=...)`                   | Le paramètre `text` est manquant                     |
| `Pattern must be at most 200 characters`              | Le `pattern` dépasse la longueur maximale            |
| `Text must be at most 1000 characters`                | Le `text` dépasse la longueur maximale               |
| `Invalid flag: {flag}. Accepted flags: g, i, m, s, u` | Un ou plusieurs flags ne sont pas supportés          |
| `Invalid regular expression`                          | Le pattern n'est pas une expression régulière valide |
