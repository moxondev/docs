# Génération de Captcha

L'endpoint `/captcha` génère une image à partir d'un texte fourni en paramètre. Cet endpoint peut être utile pour tester un utilisateur avec le captcha généré en stockant le texte en mémoire.

<Endpoint method="get" path="/captcha" />

## Paramètres

| Paramètre | Requis | Description                                                        |
| --------- | ------ | ------------------------------------------------------------------ |
| `text`    | Oui    | Le texte du captcha à générer. Doit contenir au moins un caractère |

## Exemple de requête

```
GET /v3/captcha?text=test1234?ABCD
```

## Réponse

L'endpoint retourne une image PNG du captcha généré.

## cURL

```bash
curl -X GET "https://api.moxon.dev/v3/captcha?text=test1234?ABCD" --output captcha.png
```

::: tip Exemple
[Voir un exemple du captcha généré](https://api.moxon.dev/v3/captcha?text=test1234?ABCD)
:::

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                                 | Description                                  |
| ------------------------------------------------ | -------------------------------------------- |
| `Please provide a valid argument (?text={text})` | Le paramètre `text` est manquant ou invalide |
