# Algorithms

The `/algorithms` endpoint provides several algorithms to use as parameters. You can input one or two values depending on the algorithm.

<Endpoint method="get" path="/algorithms" baseUrl="https://api.sylvain.sh" />

## Parameters

| Parameter | Required | Description                                                               |
| --------- | -------- | ------------------------------------------------------------------------- |
| `method`  | Yes      | The algorithm to use (see available methods below)                        |
| `value`   | Yes      | The value to use in the algorithm. Must contain at least one character    |
| `value2`  | No       | The second value to use if necessary. Must contain at least one character |

## Available Methods

| Method         | Description                                            | Requires `value2` | Limits            |
| -------------- | ------------------------------------------------------ | ----------------- | ----------------- |
| `anagram`      | Checks if two strings are anagrams                     | Yes               | Max 1000 chars    |
| `bubblesort`   | Sorts an array of numbers, separated by commas         | No                | Max 1000 elements |
| `factorial`    | Calculates the factorial of a number between 0 and 170 | No                | 0–170             |
| `gcd`          | Computes the greatest common divisor of two numbers    | Yes               | 1–100,000         |
| `isprime`      | Checks if a number is prime                            | No                | 1–100,000         |
| `fibonacci`    | Calculates a Fibonacci sequence up to a given number   | No                | 0–1000            |
| `palindrome`   | Checks if a string is a palindrome                     | No                | Max 1000 chars    |
| `primelist`    | Returns a list of prime numbers up to a given number   | No                | 2–10,000          |
| `primefactors` | Returns the list of prime factors of a number          | No                | 1–100,000         |
| `reverse`      | Reverses a string                                      | No                | Max 1000 chars    |
| `roman`        | Converts between Roman numerals and numbers (1–3999)   | No                | 1–3999            |

## Response Fields

| Field    | Type                                | Description          |
| -------- | ----------------------------------- | -------------------- |
| `answer` | `number\|string\|boolean\|number[]` | The algorithm result |

## Code Examples

<Examples method="get" path="/algorithms" :params="{ method: 'gcd', value: '17', value2: '493' }" />

## Try It

<Try name="Algorithms" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                            | Description                                                        |
| -------------------------------------------------------- | ------------------------------------------------------------------ |
| `Please provide a valid algorithm (?method={algorithm})` | The `method` parameter is missing or invalid                       |
| `Invalid input`                                          | The value exceeds the method's constraints or limits               |
| `Value must be a number`                                 | `factorial`/`isprime`: `value` is not numeric                      |
| `Value must be an integer`                               | `factorial`/`isprime`: `value` is not a whole number               |
| `Number must be positive`                                | `factorial`/`isprime`: `value` is negative (or zero for `isprime`) |
| `Number must be between 0 and 170`                       | `factorial`: `value` is out of range                               |
| `Number must be between 1 and 100000`                    | `isprime`: `value` is out of range                                 |
