# Parseur d'expressions cron

L'endpoint `/cron` analyse une expression cron à 5 champs et retourne une description lisible ainsi que les prochains timestamps d'exécution planifiés.

<Endpoint method="get" path="/cron" baseUrl="https://api.sylvain.sh" />

::: tip Cas d'utilisation
Prévisualisez les prochaines exécutions avant de planifier une tâche, affichez une description lisible d'une expression cron dans une interface, déboguez les problèmes de timing cron selon les fuseaux horaires, ou validez qu'une expression se déclenche aux intervalles attendus.
:::

## Paramètres

| Paramètre  | Requis | Défaut     | Description                                                                              |
| ---------- | ------ | ---------- | ---------------------------------------------------------------------------------------- |
| `expr`     | Oui    |            | Expression cron à 5 champs (`minute heure dom mois dow`). Exemple : `*/5 * * * *`.       |
| `count`    | Non    | `5`        | Nombre de prochains timestamps d'exécution à retourner (1–20).                           |
| `from`     | Non    | maintenant | Date de départ pour le calcul des prochaines exécutions (ISO 8601). Défaut : maintenant. |
| `timezone` | Non    | `UTC`      | Fuseau horaire IANA pour le calcul et le formatage des timestamps (ex. `Europe/Paris`).  |

## Champs de réponse

| Champ         | Type       | Description                                                     |
| ------------- | ---------- | --------------------------------------------------------------- |
| `expression`  | `string`   | L'expression cron telle que fournie                             |
| `description` | `string`   | Description lisible (ex. `Every 5 minutes`, `At 09:00 daily`)   |
| `timezone`    | `string`   | Fuseau horaire utilisé pour le calcul                           |
| `next`        | `string[]` | Tableau des prochains timestamps d'exécution au format ISO 8601 |

## Exemples de code

<Examples method="get" path="/cron" :params="{ expr: '0 9 * * 1-5' }" />

## Essayer

<Try name="Cron" />

## Gestion des erreurs

| Message d'erreur                                   | Description                                                     |
| -------------------------------------------------- | --------------------------------------------------------------- |
| `Please provide a cron expression (?expr=...)`     | Le paramètre `expr` est manquant                                |
| `Invalid cron expression`                          | L'expression ne correspond pas au format cron à 5 champs        |
| `Count must be between 1 and 20`                   | Le paramètre `count` est hors de la plage autorisée             |
| `Please provide a valid count (&count={n})`        | Le paramètre `count` n'est pas un nombre valide                 |
| `Please provide a valid ISO 8601 date (?from=...)` | Le paramètre `from` n'est pas une date ISO 8601 valide          |
| `Please provide a valid timezone (?timezone=...)`  | Le paramètre `timezone` n'est pas un fuseau horaire IANA valide |
