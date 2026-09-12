# Comparaison de textes

L'endpoint `/diff` compare deux textes et retourne une liste ordonnée des changements, ligne par ligne ou mot par mot.

<Endpoint method="post" path="/diff" baseUrl="https://api.sylvain.sh" />

::: info Comment ça marche ?
La comparaison repose sur l'algorithme de la plus longue sous-séquence commune (LCS) : il recherche le plus grand ensemble de segments partagés par les deux textes dans le même ordre, et tout ce qui en sort est signalé comme ajouté ou supprimé. En mode `line`, les textes sont découpés aux sauts de ligne, les lignes vides étant conservées ; en mode `word`, ils sont découpés sur les espaces et les segments vides sont ignorés.
:::

## Paramètres

Le corps de la requête doit être en JSON :

| Paramètre | Requis | Description                                                           |
| --------- | ------ | --------------------------------------------------------------------- |
| `a`       | Oui    | Texte original                                                        |
| `b`       | Oui    | Texte modifié, comparé à `a`                                          |
| `mode`    | Non    | Granularité de la comparaison : `line` ou `word`. Par défaut : `line` |

## Modes disponibles

| Mode   | Description                                                           |
| ------ | --------------------------------------------------------------------- |
| `line` | Découpe les deux textes aux sauts de ligne et compare ligne par ligne |
| `word` | Découpe les deux textes sur les espaces et compare mot par mot        |

## Champs de réponse

| Champ     | Type       | Description                                             |
| --------- | ---------- | ------------------------------------------------------- |
| `mode`    | `string`   | Granularité utilisée : `line` ou `word`                 |
| `added`   | `number`   | Nombre de segments présents uniquement dans `b`         |
| `removed` | `number`   | Nombre de segments présents uniquement dans `a`         |
| `changes` | `object[]` | Changements ordonnés reconstruisant `b` à partir de `a` |

**Entrées de `changes` :**

| Champ   | Type     | Description                 |
| ------- | -------- | --------------------------- |
| `type`  | `string` | `equal`, `add` ou `del`     |
| `value` | `string` | La ligne ou le mot concerné |

## Exemples de code

<Examples method="post" path="/diff" :body="{ a: 'line1\nline2', b: 'line1\nline2 edited' }" />

## Essayer

<Try name="Diff" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                          | Description                                           |
| ----------------------------------------- | ----------------------------------------------------- |
| `Please provide a first text (a={text})`  | Le paramètre `a` est manquant ou n'est pas une chaîne |
| `Please provide a second text (b={text})` | Le paramètre `b` est manquant ou n'est pas une chaîne |
| `Texts must be 10000 characters or fewer` | `a` ou `b` dépasse la longueur maximale               |
| `Mode must be one of: line, word`         | La valeur de `mode` n'est ni `line` ni `word`         |
| `Texts must contain 2000 lines or fewer`  | Un texte dépasse la limite de lignes en mode `line`   |
| `Texts must contain 2000 words or fewer`  | Un texte dépasse la limite de mots en mode `word`     |
