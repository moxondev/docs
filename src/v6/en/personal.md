# Personal Information Generation

The `/personal` endpoint generates random information about a person. Name, email, location, phone number, profession and much more are generated. This endpoint does not require any options.

<Endpoint method="get" path="/personal" baseUrl="https://api.moxon.dev" />

## Parameters

This endpoint does not require any parameters. It returns a randomly generated identity with name, email, address, phone number, profession and more.

## Response Fields

| Field                | Type       | Description                                                            |
| -------------------- | ---------- | ---------------------------------------------------------------------- |
| `name`               | `string`   | Full name                                                              |
| `email`              | `string`   | Email address                                                          |
| `localisation`       | `string`   | Country code                                                           |
| `phone`              | `string`   | Phone number                                                           |
| `job`                | `string`   | Profession                                                             |
| `hobbies`            | `string`   | Hobbies/interests                                                      |
| `language`           | `string`   | Spoken language                                                        |
| `card`               | `string`   | Luhn-valid credit card number (see [Credit](/v6/en/credit))            |
| `cvc`                | `string`   | Card security code                                                     |
| `expiration`         | `string`   | Card expiration date                                                   |
| `address`            | `object`   | Full address object (see [Address](/v6/en/address#response-fields))    |
| `birthday`           | `string`   | Date of birth                                                          |
| `civil_status`       | `string`   | Marital status                                                         |
| `children`           | `number`   | Number of children                                                     |
| `vehicle`            | `string[]` | Array of vehicles owned                                                |
| `social_profiles`    | `object`   | Social media profiles (`twitter`, `facebook`, `linkedin`, `instagram`) |
| `year_income`        | `string`   | Annual income                                                          |
| `month_income`       | `string`   | Monthly income                                                         |
| `education`          | `string`   | Education level                                                        |
| `work_experience`    | `string`   | Years of work experience                                               |
| `health_status`      | `string`   | Health status                                                          |
| `emergency_contacts` | `object[]` | Array of emergency contacts (`name`, `relationship`, `phone`)          |
| `subscriptions`      | `string[]` | Array of subscriptions                                                 |
| `pets`               | `string[]` | Array of pets                                                          |

## Code Examples

<Examples method="get" path="/personal" />

## Try It

<Try name="Personal" />

::: warning Note
All generated data is fictional and randomly created. Credit card numbers are Luhn-valid but do not correspond to any real account.
:::
