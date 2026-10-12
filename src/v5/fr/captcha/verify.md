# Vérification de captcha

L'endpoint `/captcha` vérifie une réponse soumise pour un captcha en mode challenge : renvoyez le jeton issu de l'en-tête `X-Captcha-Token`, accompagné du texte saisi par l'utilisateur.

<Endpoint method="post" path="/captcha" baseUrl="https://api.moxon.dev" />

## Paramètres

Le corps de la requête doit être en JSON :

| Paramètre | Requis | Description                                                           |
| --------- | ------ | --------------------------------------------------------------------- |
| `token`   | Oui    | Jeton issu de l'en-tête `X-Captcha-Token`                             |
| `answer`  | Oui    | Texte saisi par l'utilisateur. Insensible à la casse, espaces ignorés |

## Champs de réponse

| Champ    | Type      | Description                                         |
| -------- | --------- | --------------------------------------------------- |
| `valid`  | `boolean` | `true` si la réponse correspond                     |
| `reason` | `string`  | Motif du rejet — absent lorsque `valid` vaut `true` |

## Motifs de rejet

| Motif     | Signification                                                   |
| --------- | --------------------------------------------------------------- |
| `wrong`   | La réponse ne correspond pas à l'image                          |
| `expired` | Le jeton a plus de 5 minutes                                    |
| `used`    | Le jeton a déjà été consommé — chacun ne sert qu'une seule fois |
| `invalid` | Le jeton est malformé                                           |

## Exemples de code

<Examples method="post" path="/captcha" :body="{ token: 'eyJ...', answer: 'a4Kf2p' }" />

## Essayer

<Try name="Captcha Verify" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                              | Description               |
| --------------------------------------------- | ------------------------- |
| `Please provide a token (?token={token})`     | Le `token` est manquant   |
| `Please provide an answer (&answer={answer})` | La `answer` est manquante |

## Endpoints associés

- <Method type="get" sm /> [/v5/captcha](../captcha) - Générer un captcha en mode challenge
- <Method type="get" sm /> [/v5/pow](../pow) - Preuve de travail, l'alternative recommandée
