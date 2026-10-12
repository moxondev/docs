# Username Generation

The `/username` endpoint returns a list of adjectives, another with animal names, and the last with professions. A number and a random username are generated from all the information. This endpoint does not require any options.

<Endpoint method="get" path="/username" />

The username can consist of one or more elements chosen from the lists or the generated number.

## Request Example

```
GET /v2/username
```

## Response

```json
{
    "adjective": ["Happy", "Silly", "Clever", "Creative", "Brave", "..."],
    "animal": ["Cat", "Dog", "Tiger", "Elephant", "Monkey", "..."],
    "job": ["Writer", "Artist", "Musician", "Explorer", "Scientist", "..."],
    "number": "99",
    "username": "HappyCat99"
}
```

## cURL

```bash
curl -X GET "https://api.moxon.dev/v2/username"
```
