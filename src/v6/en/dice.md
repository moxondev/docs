# Dice

The `/dice` endpoint rolls dice using RPG notation (NdX or NdX+M).

<Endpoint method="get" path="/dice" baseUrl="https://api.sylvain.sh" />

## Parameters

| Parameter | Required | Description                                                                                               |
| --------- | -------- | --------------------------------------------------------------------------------------------------------- |
| `roll`    | Yes      | Dice notation (e.g. `2d6+3`, `1d20`, `4d8`). 1–100 dice, 2–1000 sides. The `+` can be encoded as a space. |

## Response Fields

| Field      | Type       | Description                        |
| ---------- | ---------- | ---------------------------------- |
| `roll`     | `string`   | The parsed dice notation           |
| `count`    | `number`   | Number of dice rolled              |
| `sides`    | `number`   | Number of sides per die            |
| `modifier` | `number`   | Added modifier (0 if none)         |
| `results`  | `number[]` | Individual die results             |
| `total`    | `number`   | Sum of all dice results + modifier |

## Code Examples

<Examples method="get" path="/dice" :params="{ roll: '2d6+3' }" />

## Try It

<Try name="Dice" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                           | Description                                |
| ------------------------------------------------------- | ------------------------------------------ |
| `Please provide a valid dice roll (?roll={NdX\|NdX+M})` | The `roll` parameter is missing or invalid |
