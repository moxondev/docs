# Informations sur le temps

L'endpoint `/time` permet de récupérer des informations sur le temps en fonction de différents paramètres. Vous pouvez obtenir l'heure actuelle ou une heure aléatoire entre une plage spécifiée, dans différents formats et fuseaux horaires.

<Endpoint method="get" path="/time" />

## Paramètres

| Paramètre  | Requis | Description                                                                |
| ---------- | ------ | -------------------------------------------------------------------------- |
| `type`     | Non    | `live` (par défaut) pour le temps actuel, `random` pour un temps aléatoire |
| `start`    | Non    | Date de début pour la plage aléatoire (format : `YYYY-MM-DD`)              |
| `end`      | Non    | Date de fin pour la plage aléatoire (format : `YYYY-MM-DD`)                |
| `format`   | Non    | Format de la réponse (voir les options ci-dessous)                         |
| `timezone` | Non    | Fuseau horaire à utiliser (voir les options ci-dessous)                    |

## Options de format

| Format           | Description                  |
| ---------------- | ---------------------------- |
| `iso`            | Format ISO 8601 (par défaut) |
| `timestamp`      | Timestamp Unix               |
| `locale`         | Format local                 |
| `date`           | Date au format `MM/DD/YYYY`  |
| `time`           | Heure au format `HH:MM:SS`   |
| `year`           | Année uniquement             |
| `month`          | Mois uniquement              |
| `day`            | Jour uniquement              |
| `hour`           | Heure uniquement             |
| `minute`         | Minutes uniquement           |
| `second`         | Secondes uniquement          |
| `ms`             | Millisecondes uniquement     |
| `dayOfWeek`      | Jour de la semaine (0-6)     |
| `dayOfYear`      | Jour de l'année (1-365/366)  |
| `weekNumber`     | Numéro de semaine            |
| `timezone`       | Nom du fuseau horaire        |
| `timezoneOffset` | Décalage horaire             |

## Options de fuseau horaire

| Fuseau horaire     | Description                            |
| ------------------ | -------------------------------------- |
| `UTC`              | Temps universel coordonné (par défaut) |
| `Europe/Paris`     | Fuseau horaire de Paris                |
| `America/New_York` | Fuseau horaire de New York             |
| `Asia/Tokyo`       | Fuseau horaire de Tokyo                |
| `Australia/Sydney` | Fuseau horaire de Sydney               |

## Exemples de requête

### Temps actuel (tous les formats)

```
GET /v3/time
```

```json
{
    "iso": "2000-01-01T12:00:00.000Z",
    "utc": "Sat, 01 Jan 2000 12:00:00 GMT",
    "timestamp": 946724400,
    "locale": "1/1/2000, 12:00:00 PM Coordinated Universal Time",
    "date": "3/3/2000",
    "time": "12:00:00 PM",
    "year": 2000,
    "month": 1,
    "day": 1,
    "hour": 12,
    "minute": 0,
    "second": 0,
    "ms": 0,
    "dayOfWeek": 6,
    "dayOfYear": 1,
    "weekNumber": 1,
    "timezone": "UTC",
    "timezoneOffset": 0
}
```

### Temps aléatoire avec format spécifique

```bash
curl -X GET "https://api.moxon.dev/v3/time?type=random&format=locale&timezone=Europe/Paris"
```

```json
{
    "date": "7/28/2024, 2:06:52 PM GMT+01:00"
}
```

## Gestion des erreurs

Si les paramètres sont invalides, l'API retournera une erreur :

| Message d'erreur                                          | Description                          |
| --------------------------------------------------------- | ------------------------------------ |
| `Please provide a valid type (?type={type})`              | Le paramètre `type` est invalide     |
| `Please provide a valid start date (?start={YYYY-MM-DD})` | Le paramètre `start` est invalide    |
| `Please provide a valid end date (?end={YYYY-MM-DD})`     | Le paramètre `end` est invalide      |
| `Please provide a valid format (?format={format})`        | Le paramètre `format` est invalide   |
| `Please provide a valid timezone (?timezone={timezone})`  | Le paramètre `timezone` est invalide |
