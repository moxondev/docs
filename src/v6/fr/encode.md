# Encodage

L'endpoint `/encode` encode ou décode du texte dans différents formats.

<Endpoint method="get" path="/encode" baseUrl="https://api.sylvain.sh" />

## Paramètres

| Paramètre | Requis | Description                                       |
| --------- | ------ | ------------------------------------------------- |
| `method`  | Oui    | Méthode d'encodage (voir les méthodes ci-dessous) |
| `text`    | Oui    | Texte à encoder ou décoder                        |
| `shift`   | Non    | Décalage pour le chiffre de César (défaut : 13)   |

## Méthodes disponibles

| Méthode        | Description                          |
| -------------- | ------------------------------------ |
| `base64encode` | Encoder en Base64                    |
| `base64decode` | Décoder du Base64                    |
| `urlencode`    | Encoder pour URL                     |
| `urldecode`    | Décoder une URL                      |
| `morse`        | Texte → Code Morse                   |
| `unmorse`      | Code Morse → Texte                   |
| `rot13`        | Chiffre ROT-13                       |
| `caesar`       | Chiffre de César (nécessite `shift`) |
| `binary`       | Texte → binaire 8 bits               |
| `unbinary`     | Binaire → Texte                      |

## Champs de réponse

| Champ    | Type     | Description                    |
| -------- | -------- | ------------------------------ |
| `method` | `string` | La méthode d'encodage utilisée |
| `result` | `string` | Le résultat encodé ou décodé   |

## Exemples de code

<Examples method="get" path="/encode" :params="{ method: 'base64encode', text: 'hello' }" />

## Essayer

<Try name="Encode" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                                                                 | Description                                    |
| -------------------------------------------------------------------------------- | ---------------------------------------------- |
| `A value is required`                                                            | Le paramètre `text` est manquant               |
| `Please provide a valid method (?method={base64encode\|base64decode\|morse\|…})` | Le paramètre `method` est manquant ou invalide |
