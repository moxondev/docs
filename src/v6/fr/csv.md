# Conversion CSV

L'endpoint `/csv` convertit entre CSV et JSON : `parse` transforme un texte CSV en tableau d'objets, `format` fait l'inverse.

<Endpoint method="post" path="/csv" baseUrl="https://api.sylvain.sh" />

::: info Comment ça marche ?
Le parseur respecte les champs entre guillemets, y compris les guillemets échappés (`""`) et les sauts de ligne à l'intérieur d'un champ entre guillemets. Les fins de ligne CRLF et CR sont normalisées en LF avant l'analyse.
:::

## Paramètres

Le corps de la requête doit être en JSON :

| Paramètre   | Requis | Description                                                                    |
| ----------- | ------ | ------------------------------------------------------------------------------ |
| `action`    | Oui    | Action à effectuer : `parse` ou `format`                                       |
| `csv`       | Cond.  | Texte CSV à convertir (requis pour `parse`)                                    |
| `json`      | Cond.  | Tableau d'objets à convertir (requis pour `format`)                            |
| `delimiter` | Non    | Séparateur de champ, un seul caractère. Par défaut : `,`                       |
| `headers`   | Non    | `parse` uniquement : utilise la première ligne comme clés. Par défaut : `true` |

## Actions disponibles

| Action   | Description                                |
| -------- | ------------------------------------------ |
| `parse`  | Convertit un texte CSV en tableau d'objets |
| `format` | Convertit un tableau d'objets en texte CSV |

## Champs de réponse

**Action `parse` :**

| Champ    | Type       | Description                  |
| -------- | ---------- | ---------------------------- |
| `action` | `string`   | `parse`                      |
| `rows`   | `object[]` | Tableau des lignes analysées |
| `count`  | `number`   | Nombre de lignes retournées  |

**Action `format` :**

| Champ    | Type     | Description                 |
| -------- | -------- | --------------------------- |
| `action` | `string` | `format`                    |
| `csv`    | `string` | Le texte CSV généré         |
| `count`  | `number` | Nombre de lignes converties |

## Exemples de code

<Examples method="post" path="/csv" :body="{ action: 'parse', csv: 'name,age\nAlice,30' }" />

## Essayer

<Try name="CSV" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                                        | Description                                                                       |
| ------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `Please provide an action (?action=parse\|format)`      | Le paramètre `action` est manquant                                                |
| `Please provide a valid action (?action=parse\|format)` | La valeur de `action` n'est ni `parse` ni `format`                                |
| `Delimiter must be a single character`                  | Le `delimiter` ne fait pas exactement un caractère                                |
| `Please provide CSV data (?csv={data})`                 | Le paramètre `csv` est manquant pour `parse`                                      |
| `CSV cannot exceed 50000 characters`                    | Le texte `csv` dépasse la longueur maximale                                       |
| `CSV cannot exceed 1000 rows`                           | Les données analysées dépassent la limite de lignes                               |
| `Please provide a JSON array (?json=[...])`             | Le paramètre `json` est manquant, n'est pas un tableau, ou est vide pour `format` |
| `JSON cannot exceed 1000 rows`                          | Le tableau `json` dépasse la limite de lignes                                     |
