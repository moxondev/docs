# Informations sur le temps

L'endpoint `/time` permet de récupérer des informations sur le temps en fonction de différents paramètres. Vous pouvez obtenir l'heure actuelle ou une heure aléatoire entre une plage spécifiée, dans différents formats et fuseaux horaires.

<Endpoint method="get" path="/time" baseUrl="https://api.sylvain.sh" />

## Paramètres

| Paramètre  | Requis | Description                                                                                            |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------ |
| `type`     | Non    | `live` (par défaut) pour le temps actuel, `random` pour un temps aléatoire, `countdown` vers une cible |
| `start`    | Non    | Date de début pour la plage `random` (format : `YYYY-MM-DD`)                                           |
| `end`      | Non    | Date de fin pour la plage `random` (format : `YYYY-MM-DD`)                                             |
| `target`   | Non    | Date cible pour le mode `countdown` (format : `YYYY-MM-DD` ou ISO 8601)                                |
| `format`   | Non    | Format de la réponse (voir les options ci-dessous)                                                     |
| `timezone` | Non    | Fuseau horaire à utiliser (voir les options ci-dessous)                                                |

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

## Champs de réponse

| Champ            | Type     | Description                   |
| ---------------- | -------- | ----------------------------- |
| `iso`            | `string` | Date au format ISO 8601       |
| `utc`            | `string` | Date au format UTC            |
| `timestamp`      | `number` | Timestamp Unix                |
| `locale`         | `string` | Date et heure au format local |
| `date`           | `string` | Date au format MM/DD/YYYY     |
| `time`           | `string` | Heure au format HH:MM:SS      |
| `year`           | `number` | Année                         |
| `month`          | `number` | Mois (1-12)                   |
| `day`            | `number` | Jour du mois                  |
| `hour`           | `number` | Heure (0-23)                  |
| `minute`         | `number` | Minutes                       |
| `second`         | `number` | Secondes                      |
| `ms`             | `number` | Millisecondes                 |
| `dayOfWeek`      | `number` | Jour de la semaine (0-6)      |
| `dayOfYear`      | `number` | Jour de l'année (1-365/366)   |
| `weekNumber`     | `number` | Numéro de semaine             |
| `timezone`       | `string` | Nom du fuseau horaire         |
| `timezoneOffset` | `number` | Décalage horaire en minutes   |

## Exemples de code

<Examples method="get" path="/time" :params="{ type: 'random', format: 'locale', timezone: 'Europe/Paris' }" />

## Essayer

<Try name="Time" />

## Gestion des erreurs

Si les paramètres sont invalides, l'API retournera une erreur :

| Message d'erreur                                          | Description                          |
| --------------------------------------------------------- | ------------------------------------ |
| `Please provide a valid type (?type={type})`              | Le paramètre `type` est invalide     |
| `Please provide a valid start date (?start={YYYY-MM-DD})` | Le paramètre `start` est invalide    |
| `Please provide a valid end date (?end={YYYY-MM-DD})`     | Le paramètre `end` est invalide      |
| `Please provide a valid target date (?target=...)`        | Le paramètre `target` est invalide   |
| `Please provide a valid format (?format={format})`        | Le paramètre `format` est invalide   |
| `Please provide a valid timezone (?timezone={timezone})`  | Le paramètre `timezone` est invalide |
