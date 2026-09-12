# Casse

L'endpoint `/case` convertit un texte entre 9 formats de casse avec une tokenisation universelle (split camelCase, `_`, `-`, `.`, espaces).

<Endpoint method="get" path="/case" baseUrl="https://api.sylvain.sh" />

## Paramètres

| Paramètre | Requis | Défaut  | Description       |
| --------- | ------ | ------- | ----------------- |
| `text`    | Oui    | —       | Texte à convertir |
| `to`      | Non    | `camel` | Format cible      |

## Formats disponibles

| Format     | Description   | Exemple (`hello_world`) |
| ---------- | ------------- | ----------------------- |
| `camel`    | camelCase     | `helloWorld`            |
| `pascal`   | PascalCase    | `HelloWorld`            |
| `snake`    | snake_case    | `hello_world`           |
| `kebab`    | kebab-case    | `hello-world`           |
| `constant` | CONSTANT_CASE | `HELLO_WORLD`           |
| `title`    | Title Case    | `Hello World`           |
| `sentence` | Sentence case | `Hello world`           |
| `upper`    | MAJUSCULES    | `HELLO_WORLD`           |
| `lower`    | minuscules    | `hello_world`           |

## Champs de réponse

| Champ    | Type     | Description       |
| -------- | -------- | ----------------- |
| `text`   | `string` | Le texte d'entrée |
| `to`     | `string` | Le format cible   |
| `result` | `string` | Le texte converti |

## Exemples de code

<Examples method="get" path="/case" :params="{ text: 'hello_world', to: 'pascal' }" />

## Essayer

<Try name="Case" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                                                                                          | Description                                                                                    |
| --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `Please provide a text (?text={text})`                                                                    | Le paramètre `text` est manquant                                                               |
| `Text cannot exceed 1000 characters`                                                                      | Le `text` dépasse la longueur maximale                                                         |
| `Text must contain at least one alphanumeric character`                                                   | Le `text` ne contient que des séparateurs/de la ponctuation (ex. `---`), sans rien à convertir |
| `Invalid target case. Valid values: camel, pascal, snake, kebab, constant, title, sentence, upper, lower` | La valeur de `to` n'est pas valide                                                             |
