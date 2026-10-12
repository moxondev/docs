# Conversion de température

L'endpoint `/convert` permet de convertir plusieurs unités de température entre elles. Vous devez fournir une valeur à convertir, une unité source et l'unité vers laquelle vous souhaitez convertir.

<Endpoint method="get" path="/convert" />

## Paramètres

| Paramètre | Requis | Description                                        |
| --------- | ------ | -------------------------------------------------- |
| `value`   | Oui    | La valeur à convertir                              |
| `from`    | Oui    | L'unité source (`celsius`, `fahrenheit`, `kelvin`) |
| `to`      | Oui    | L'unité cible (`celsius`, `fahrenheit`, `kelvin`)  |

## Unités disponibles

| Unité        | Description       |
| ------------ | ----------------- |
| `celsius`    | Degrés Celsius    |
| `fahrenheit` | Degrés Fahrenheit |
| `kelvin`     | Kelvin            |

## Exemple de requête

```
GET /v3/convert?value=30&from=celsius&to=kelvin
```

## Réponse

```json
{
    "from": "celsius",
    "to": "kelvin",
    "value": 30,
    "result": 303.15
}
```

## cURL

```bash
curl -X GET "https://api.moxon.dev/v3/convert?value=30&from=celsius&to=kelvin"
```

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                                    | Description                                   |
| --------------------------------------------------- | --------------------------------------------- |
| `Please provide a valid value (?value={value})`     | Le paramètre `value` est manquant ou invalide |
| `Please provide a valid source unit (&from={unit})` | Le paramètre `from` est manquant ou invalide  |
| `Please provide a valid target unit (&to={unit})`   | Le paramètre `to` est manquant ou invalide    |
