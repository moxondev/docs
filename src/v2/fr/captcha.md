# Génération de Captcha

L'endpoint `/captcha` génère une image à partir d'un texte entré en paramètre. Cet endpoint peut être utile pour tester un utilisateur sur le captcha généré en sauvegardant le texte en mémoire.

<Endpoint method="get" path="/captcha" />

## Paramètres

| Paramètre | Requis | Description                                                          |
| --------- | ------ | -------------------------------------------------------------------- |
| `text`    | Oui    | Le texte du captcha à générer. Doit contenir au minimum un caractère |

## Exemple de requête

```
GET /v2/captcha?text=test1234?ABCD
```

## Réponse

L'endpoint retourne une image PNG du captcha généré.

## cURL

```bash
curl -X GET "https://api.moxon.dev/v2/captcha?text=test1234?ABCD" --output captcha.png
```

::: tip Exemple
[Voir un exemple de captcha généré](https://api.moxon.dev/v2/captcha?text=test1234?ABCD)
:::

## Gestion des erreurs

Si la valeur de `text` est vide, une erreur sera renvoyée.
