# Analyse de User-Agent

L'endpoint `/agent` analyse un User-Agent et retourne des informations structurées sur le navigateur, le système d'exploitation, l'appareil, le moteur de rendu et si le client est un bot. Si aucun UA n'est fourni, le header `User-Agent` de la requête est utilisé.

<Endpoint method="get" path="/agent" baseUrl="https://api.sylvain.sh" />

::: tip Cas d'utilisation
Détectez le navigateur et le système de vos visiteurs, identifiez les bots et crawlers, servez du contenu adapté à l'appareil (mobile vs bureau), ou journalisez les métadonnées client structurées à partir de User-Agent bruts.
:::

## Paramètres

| Paramètre | Requis | Description                                                                               |
| --------- | ------ | ----------------------------------------------------------------------------------------- |
| `ua`      | Non    | Chaîne User-Agent brute à analyser. Utilise le header `User-Agent` de la requête si omis. |

## Champs de réponse

| Champ             | Type      | Description                                                         |
| ----------------- | --------- | ------------------------------------------------------------------- |
| `raw`             | `string`  | La chaîne User-Agent d'origine                                      |
| `browser.name`    | `string`  | Navigateur détecté (ex. `Chrome`, `Firefox`, `Safari`)              |
| `browser.version` | `string`  | Version complète du navigateur                                      |
| `browser.major`   | `string`  | Numéro de version majeure uniquement                                |
| `os.name`         | `string`  | Nom du système d'exploitation (ex. `macOS`, `Windows 10/11`, `iOS`) |
| `os.version`      | `string`  | Version du système d'exploitation                                   |
| `device.type`     | `string`  | Catégorie d'appareil : `desktop`, `mobile` ou `tablet`              |
| `device.vendor`   | `string`  | Fabricant de l'appareil (ex. `Apple`, `Samsung`, `Google`)          |
| `engine.name`     | `string`  | Moteur de rendu (ex. `Blink`, `Gecko`, `WebKit`)                    |
| `engine.version`  | `string`  | Version du moteur                                                   |
| `bot`             | `boolean` | `true` si le UA correspond à un bot ou crawler connu                |

## Exemples de code

<Examples method="get" path="/agent" />

## Essayer

<Try name="Agent" />

## Gestion des erreurs

| Message d'erreur                   | Description                                                            |
| ---------------------------------- | ---------------------------------------------------------------------- |
| `A User-Agent string is required.` | Le paramètre `ua` est vide et aucun header `User-Agent` n'a été envoyé |
