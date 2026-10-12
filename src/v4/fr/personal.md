# Génération d'informations personnelles

L'endpoint `/personal` génère des informations aléatoires sur une personne. Nom, email, localisation, numéro de téléphone, profession et bien plus sont générés. Cet endpoint ne nécessite aucune option.

<Endpoint method="get" path="/personal" baseUrl="https://api.moxon.dev" />

## Paramètres

Cet endpoint ne nécessite aucun paramètre. Il retourne une identité fictive générée aléatoirement avec nom, email, adresse, téléphone, profession et plus.

## Champs de réponse

| Champ                | Type       | Description                                                              |
| -------------------- | ---------- | ------------------------------------------------------------------------ |
| `name`               | `string`   | Nom complet                                                              |
| `email`              | `string`   | Adresse email                                                            |
| `localisation`       | `string`   | Code pays                                                                |
| `phone`              | `string`   | Numéro de téléphone                                                      |
| `job`                | `string`   | Profession                                                               |
| `hobbies`            | `string`   | Loisirs/intérêts                                                         |
| `language`           | `string`   | Langue parlée                                                            |
| `card`               | `string`   | Numéro de carte Luhn-valide (voir [Credit](/v4/fr/credit))               |
| `cvc`                | `string`   | Code de sécurité de la carte                                             |
| `expiration`         | `string`   | Date d'expiration de la carte                                            |
| `address`            | `object`   | Objet adresse complet (voir [Address](/v4/fr/address#champs-de-reponse)) |
| `birthday`           | `string`   | Date de naissance                                                        |
| `civil_status`       | `string`   | Situation matrimoniale                                                   |
| `children`           | `number`   | Nombre d'enfants                                                         |
| `vehicle`            | `string[]` | Tableau des véhicules possédés                                           |
| `social_profiles`    | `object`   | Objet des profils de réseaux sociaux                                     |
| `year_income`        | `string`   | Revenu annuel                                                            |
| `month_income`       | `string`   | Revenu mensuel                                                           |
| `education`          | `string`   | Niveau d'éducation                                                       |
| `work_experience`    | `string`   | Années d'expérience professionnelle                                      |
| `health_status`      | `string`   | État de santé                                                            |
| `emergency_contacts` | `object[]` | Tableau des contacts d'urgence                                           |
| `subscriptions`      | `string[]` | Tableau des abonnements                                                  |
| `pets`               | `string[]` | Tableau des animaux de compagnie                                         |

## Exemples de code

<Examples method="get" path="/personal" />

## Essayer

<Try name="Personal" />

::: warning Note
Toutes les données générées sont fictives et créées de manière aléatoire. Les numéros de carte sont Luhn-valides mais ne correspondent à aucun compte réel.
:::
