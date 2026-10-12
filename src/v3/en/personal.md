# Personal Information Generation

The `/personal` endpoint generates random information about a person. Name, email, location, phone number, profession and much more are generated. This endpoint does not require any options.

<Endpoint method="get" path="/personal" />

## Parameters

This endpoint does not require any parameters.

## Request Example

```
GET /v3/personal
```

## Response

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
    "address": "4 rue des pres, Paris",
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

## Response Fields

| Field                | Description                  |
| -------------------- | ---------------------------- |
| `name`               | Full name                    |
| `email`              | Email address                |
| `localisation`       | Country code                 |
| `phone`              | Phone number                 |
| `job`                | Profession                   |
| `hobbies`            | Hobbies/interests            |
| `language`           | Spoken language              |
| `card`               | Credit card number           |
| `cvc`                | Card security code           |
| `expiration`         | Card expiration date         |
| `address`            | Street address               |
| `birthday`           | Date of birth                |
| `civil_status`       | Marital status               |
| `children`           | Number of children           |
| `vehicle`            | Array of vehicles owned      |
| `social_profiles`    | Social media profiles object |
| `year_income`        | Annual income                |
| `month_income`       | Monthly income               |
| `education`          | Education level              |
| `work_experience`    | Years of work experience     |
| `health_status`      | Health status                |
| `emergency_contacts` | Array of emergency contacts  |
| `subscriptions`      | Array of subscriptions       |
| `pets`               | Array of pets                |

## cURL

```bash
curl -X GET "https://api.moxon.dev/v3/personal"
```

::: warning Note
All generated data is fictional and randomly created. Credit card numbers are not valid for transactions.
:::
