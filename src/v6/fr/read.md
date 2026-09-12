# Analyse de lisibilité

L'endpoint `/read` analyse un texte et retourne son nombre de mots, de phrases et de syllabes, ses scores de lisibilité Flesch et un temps de lecture estimé.

<Endpoint method="post" path="/read" baseUrl="https://api.sylvain.sh" />

::: info Comment ça marche ?
L'anglais utilise les coefficients Flesch d'origine, qui fournissent aussi un niveau scolaire Flesch-Kincaid. Le français utilise l'adaptation de Kandel & Moles, qui n'a pas d'équivalent de niveau scolaire : `fleschKincaidGrade` vaut donc `null`.

Les syllabes sont estimées par une heuristique propre à chaque langue : groupes de voyelles, moins le `e` final muet (`e` ou `es` en français), avec un minimum d'une syllabe par mot. Les phrases sont découpées sur `.`, `!`, `?` et `…`, et un texte sans aucun de ces signes compte pour une seule phrase. Le temps de lecture est basé sur 200 mots par minute.
:::

## Paramètres

Le corps de la requête doit être en JSON :

| Paramètre | Requis | Description                                       |
| --------- | ------ | ------------------------------------------------- |
| `text`    | Oui    | Texte à analyser, 50000 caractères maximum        |
| `lang`    | Non    | Langue du texte : `en` ou `fr`. Par défaut : `en` |

## Champs de réponse

| Champ                | Type           | Description                                                                                     |
| -------------------- | -------------- | ----------------------------------------------------------------------------------------------- |
| `lang`               | `string`       | Langue utilisée pour l'analyse                                                                  |
| `words`              | `number`       | Nombre de mots — les tokens contenant au moins une lettre ou un chiffre                         |
| `sentences`          | `number`       | Nombre de phrases, toujours au minimum `1`                                                      |
| `syllables`          | `number`       | Nombre total estimé de syllabes                                                                 |
| `fleschReadingEase`  | `number`       | Score de lisibilité Flesch, arrondi à 2 décimales — plus il est élevé, plus le texte est facile |
| `fleschKincaidGrade` | `number\|null` | Niveau scolaire Flesch-Kincaid, arrondi à 2 décimales — `null` si `lang` vaut `fr`              |
| `readingTime`        | `string`       | Temps de lecture estimé, en secondes en dessous d'une minute (ex. `45s`, `3min`)                |

## Exemples de code

<Examples method="post" path="/read" :body="{ text: 'The cat sat on the mat. It was happy.', lang: 'en' }" />

## Essayer

<Try name="Read" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                         | Description                                                      |
| ---------------------------------------- | ---------------------------------------------------------------- |
| `Please provide a text`                  | Le paramètre `text` est manquant, vide, ou ne contient aucun mot |
| `Text must be 50000 characters or fewer` | Le `text` dépasse la longueur maximale                           |
| `Language must be one of: en, fr`        | La valeur de `lang` n'est ni `en` ni `fr`                        |
