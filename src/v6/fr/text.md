# Texte

L'endpoint `/text` fournit des utilitaires de manipulation et de génération de texte.

<Endpoint method="get" path="/text" baseUrl="https://api.sylvain.sh" />

## Paramètres

| Paramètre | Requis | Description                                          |
| --------- | ------ | ---------------------------------------------------- |
| `method`  | Oui    | Méthode de texte (voir les méthodes ci-dessous)      |
| `value`   | Non    | Texte source (requis pour `stats`, `slug`, `number`) |
| `type`    | Non    | Type de Lorem : `words`, `sentences`, `paragraphs`   |
| `count`   | Non    | Nombre d'éléments pour `lorem` (défaut : 5)          |
| `lang`    | Non    | Langue pour `number` : `en` ou `fr`                  |

## Méthodes disponibles

| Méthode  | Description            | Paramètres requis |
| -------- | ---------------------- | ----------------- |
| `stats`  | Statistiques du texte  | `value`           |
| `slug`   | Convertir en slug URL  | `value`           |
| `lorem`  | Générer du Lorem Ipsum | `type`, `count`   |
| `number` | Nombre en lettres      | `value`, `lang`   |

## Champs de réponse

| Champ    | Type             | Description                  |
| -------- | ---------------- | ---------------------------- |
| `method` | `string`         | La méthode de texte utilisée |
| `result` | `string\|object` | Le résultat traité           |

**Limites :** `lorem` count 1–500, `number` max 999 999 999.

## Exemples de code

<Examples method="get" path="/text" :params="{ method: 'slug', value: 'Hello World' }" />

## Essayer

<Try name="Text" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                                                       | Description                                    |
| ---------------------------------------------------------------------- | ---------------------------------------------- |
| `Please provide a valid method (?method={slug\|stats\|lorem\|number})` | Le paramètre `method` est manquant ou invalide |
| `A value is required`                                                  | Le paramètre `value` est manquant quand requis |
