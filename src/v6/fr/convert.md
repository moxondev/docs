# Conversion d'unités

L'endpoint `/convert` permet de convertir des valeurs entre unités de la même catégorie. Vous devez fournir une valeur à convertir, une unité source et l'unité cible.

<Endpoint method="get" path="/convert" baseUrl="https://api.sylvain.sh" />

## Paramètres

| Paramètre | Requis | Description                                               |
| --------- | ------ | --------------------------------------------------------- |
| `value`   | Oui    | La valeur numérique à convertir                           |
| `from`    | Oui    | L'unité source (voir les unités disponibles ci-dessous)   |
| `to`      | Oui    | L'unité cible (doit être de la même catégorie que `from`) |

## Unités disponibles

**Température :**

| Unité        | Description       |
| ------------ | ----------------- |
| `celsius`    | Degrés Celsius    |
| `fahrenheit` | Degrés Fahrenheit |
| `kelvin`     | Kelvin            |

**Longueur :**

| Unité | Description |
| ----- | ----------- |
| `km`  | Kilomètres  |
| `mi`  | Miles       |
| `m`   | Mètres      |
| `ft`  | Pieds       |
| `cm`  | Centimètres |
| `in`  | Pouces      |
| `yd`  | Yards       |

**Poids :**

| Unité | Description      |
| ----- | ---------------- |
| `kg`  | Kilogrammes      |
| `lb`  | Livres           |
| `oz`  | Onces            |
| `g`   | Grammes          |
| `ton` | Tonnes métriques |

**Données :**

| Unité | Description |
| ----- | ----------- |
| `b`   | Octets      |
| `kb`  | Kilooctets  |
| `mb`  | Mégaoctets  |
| `gb`  | Gigaoctets  |
| `tb`  | Téraoctets  |

**Vitesse :**

| Unité   | Description      |
| ------- | ---------------- |
| `km/h`  | Kilomètres/heure |
| `mph`   | Miles/heure      |
| `m/s`   | Mètres/seconde   |
| `knots` | Nœuds            |

## Champs de réponse

| Champ    | Type     | Description                  |
| -------- | -------- | ---------------------------- |
| `from`   | `string` | Unité source                 |
| `to`     | `string` | Unité cible                  |
| `value`  | `number` | Valeur originale à convertir |
| `result` | `number` | Valeur convertie             |

## Exemples de code

<Examples method="get" path="/convert" :params="{ value: '100', from: 'km', to: 'mi' }" />

## Essayer

<Try name="Convert" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                                    | Description                                                      |
| --------------------------------------------------- | ---------------------------------------------------------------- |
| `Please provide a valid value (?value={value})`     | Le paramètre `value` est manquant ou invalide                    |
| `Please provide a valid source unit (&from={unit})` | Le paramètre `from` est manquant ou invalide                     |
| `Please provide a valid target unit (&to={unit})`   | Le paramètre `to` est manquant ou invalide                       |
| `Value must be a number`                            | La valeur n'est pas un nombre valide                             |
| `Invalid conversion unit`                           | La combinaison `from`/`to` n'est pas valide                      |
| `Value must be greater than absolute zero`          | La valeur est en dessous du zéro absolu (température uniquement) |
