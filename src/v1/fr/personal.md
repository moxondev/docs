# Génération d'informations personnelles

L'endpoint `/personal` génère des informations aléatoires à propos d'une personne. Un nom, un email, une localisation, un numéro de téléphone, un métier, et bien d'autres informations sont générées. Cet endpoint ne nécessite aucune option.

<Endpoint method="get" path="/personal" />

## Exemple de requête

```
GET /v1/personal
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

## cURL

```bash
curl -X GET "https://api.moxon.dev/v1/personal"
```
