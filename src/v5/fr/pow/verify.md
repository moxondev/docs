# Vérification de preuve de travail

L'endpoint `/pow` vérifie un défi de preuve de travail résolu : renvoyez le jeton émis avec le défi, accompagné du nonce trouvé.

<Endpoint method="post" path="/pow" baseUrl="https://api.moxon.dev" />

## Paramètres

Le corps de la requête doit être en JSON :

| Paramètre | Requis | Description                |
| --------- | ------ | -------------------------- |
| `token`   | Oui    | Jeton émis par le défi     |
| `nonce`   | Oui    | Nonce trouvé par le client |

## Champs de réponse

| Champ    | Type      | Description                                         |
| -------- | --------- | --------------------------------------------------- |
| `valid`  | `boolean` | `true` si la preuve est acceptée                    |
| `reason` | `string`  | Motif du rejet — absent lorsque `valid` vaut `true` |

## Motifs de rejet

| Motif     | Signification                                                      |
| --------- | ------------------------------------------------------------------ |
| `wrong`   | Le nonce ne produit pas une empreinte avec assez de zéros initiaux |
| `expired` | Le jeton a plus de 5 minutes                                       |
| `used`    | Le jeton a déjà été consommé — chacun ne sert qu'une seule fois    |
| `invalid` | Le jeton est malformé ou n'est pas un jeton de preuve de travail   |

## Exemples de code

<Examples method="post" path="/pow" :body="{ token: 'eyJ...', nonce: '48123' }" />

## Essayer

<Try name="Pow Verify" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                          | Description             |
| ----------------------------------------- | ----------------------- |
| `Please provide a token (?token={token})` | Le `token` est manquant |
| `Please provide a nonce (&nonce={nonce})` | Le `nonce` est manquant |

## Endpoints associés

- <Method type="get" sm /> [/v5/pow](../pow) - Demander un défi à résoudre
