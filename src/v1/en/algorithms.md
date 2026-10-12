# Algorithms

The `/algorithms` endpoint provides several algorithms to use as parameters. You can input one or two values depending on the algorithm.

<Endpoint method="get" path="/algorithms" />

## Parameters

| Parameter | Required | Description                                                               |
| --------- | -------- | ------------------------------------------------------------------------- |
| `method`  | Yes      | The algorithm to use (see available methods below)                        |
| `value`   | Yes      | The value to use in the algorithm. Must contain at least one character    |
| `value2`  | No       | The second value to use if necessary. Must contain at least one character |

## Available Methods

| Method         | Description                                            | Requires `value2` |
| -------------- | ------------------------------------------------------ | ----------------- |
| `anagram`      | Checks if two strings are anagrams                     | Yes               |
| `bubblesort`   | Sorts an array of numbers, separated by commas         | No                |
| `factorial`    | Calculates the factorial of a number between 0 and 170 | No                |
| `gcd`          | Computes the greatest common divisor of two numbers    | Yes               |
| `isprime`      | Checks if a number is prime                            | No                |
| `fibonacci`    | Calculates a Fibonacci sequence up to a given number   | No                |
| `palindrome`   | Checks if a string is a palindrome                     | No                |
| `primelist`    | Returns a list of prime numbers up to a given number   | No                |
| `primefactors` | Returns the list of prime factors of a number          | No                |
| `reverse`      | Reverses a string                                      | No                |

## Request Example

```
GET /v1/algorithms?method=gcd&value=17&value2=493
```

## Response

```json
{
    "answer": 17
}
```

## cURL

```bash
curl -X GET "https://api.moxon.dev/v1/algorithms?method=gcd&value=17&value2=493"
```

## Error Handling

If the value of `method` or `value` is empty or invalid, or if `value2` is required but empty, an error will be returned.
