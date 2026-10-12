# Génération d'informations personnelles

L'endpoint `/personal` génère des informations aléatoires sur une personne. Nom, email, localisation, numéro de téléphone, profession et bien plus sont générés. Cet endpoint ne nécessite aucune option.

<Endpoint method="get" path="/personal" />

## Paramètres

Cet endpoint ne nécessite aucun paramètre.

## Exemple de requête

```
GET /v3/personal
```

## Réponse

```json
{
    "name": "Jane Martin",
    "email": "jane@example.com",
    "localisation": "FR",
    "phone": "+33 06 78 90 12 34",
    "job": "Engineer",
    "hobbies": "Reading",
    "language": "French",
    "card": "3231 5443 9131 6887",
    "cvc": 673,
    "expiration": "09/24",
    "address": "4 rue des prés, Paris",
    "birthday": "1985-08-07T18:29:38.213Z",
    "civil_status": "Single",
    "children": 0,
    "vehicle": ["Motorcycle", "Bus", "Bike"],
    "social_profiles": {
        "twitter": "@jane_martin",
        "facebook": "facebook.com/jane_martin",
        "linkedin": "linkedin.com/in/jane_martin",
        "instagram": "instagram.com/jane_martin"
    },
    "year_income": "88014 USD/year",
    "month_income": "7334.50 USD/month",
    "education": "Bachelor's",
    "work_experience": "5 years",
    "health_status": "Healthy",
    "emergency_contacts": [
        {
            "name": "John Doe",
            "relationship": "Sibling",
            "phone": "+33 06 78 90 12 34"
        }
    ],
    "subscriptions": ["Netflix", "Spotify"],
    "pets": ["Fish", "Dog"]
}
```

## Champs de réponse

| Champ                | Description                          |
| -------------------- | ------------------------------------ |
| `name`               | Nom complet                          |
| `email`              | Adresse email                        |
| `localisation`       | Code pays                            |
| `phone`              | Numéro de téléphone                  |
| `job`                | Profession                           |
| `hobbies`            | Loisirs/intérêts                     |
| `language`           | Langue parlée                        |
| `card`               | Numéro de carte de crédit            |
| `cvc`                | Code de sécurité de la carte         |
| `expiration`         | Date d'expiration de la carte        |
| `address`            | Adresse postale                      |
| `birthday`           | Date de naissance                    |
| `civil_status`       | Situation matrimoniale               |
| `children`           | Nombre d'enfants                     |
| `vehicle`            | Tableau des véhicules possédés       |
| `social_profiles`    | Objet des profils de réseaux sociaux |
| `year_income`        | Revenu annuel                        |
| `month_income`       | Revenu mensuel                       |
| `education`          | Niveau d'éducation                   |
| `work_experience`    | Années d'expérience professionnelle  |
| `health_status`      | État de santé                        |
| `emergency_contacts` | Tableau des contacts d'urgence       |
| `subscriptions`      | Tableau des abonnements              |
| `pets`               | Tableau des animaux de compagnie     |

## cURL

```bash
curl -X GET "https://api.moxon.dev/v3/personal"
```

::: warning Note
Toutes les données générées sont fictives et créées de manière aléatoire. Les numéros de carte de crédit ne sont pas valides pour les transactions.
:::
