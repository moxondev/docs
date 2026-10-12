# Conversion de température

L'endpoint `/convert` permet de convertir plusieurs unités de température entre elles. Il faut entrer une valeur à convertir, une unité de départ, et l'unité dans laquelle vous souhaitez la convertir.

<Endpoint method="get" path="/convert" />

## Paramètres

| Paramètre | Requis | Description                                                                           |
| --------- | ------ | ------------------------------------------------------------------------------------- |
| `value`   | Oui    | La valeur à convertir                                                                 |
| `from`    | Oui    | L'unité de départ (`celsius`, `fahrenheit`, ou `kelvin`)                              |
| `to`      | Oui    | L'unité dans laquelle vous souhaitez convertir (`celsius`, `fahrenheit`, ou `kelvin`) |

## Unités disponibles

- `celsius` : Degrés Celsius
- `fahrenheit` : Degrés Fahrenheit
- `kelvin` : Kelvin

## Exemple de requête

```
GET /v2/convert?value=30&from=celsius&to=kelvin
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
curl -X GET "https://api.moxon.dev/v2/convert?value=30&from=celsius&to=kelvin"
```

## Gestion des erreurs

Si la valeur de `value`, `from` ou `to` est vide ou invalide, une erreur sera renvoyée.
