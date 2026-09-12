# Evaluate

The `/evaluate` endpoint safely evaluates a mathematical expression and returns its result. It uses a Pratt parser — no `eval()` is ever called.

<Endpoint method="get" path="/evaluate" baseUrl="https://api.sylvain.sh" />

::: info How it works?
Expressions are tokenized then parsed recursively using binding powers (Pratt parsing). The result is computed directly from the AST — no `eval()`, no `Function()`. Two constants are available: `pi` (≈ 3.14159…) and `e` (≈ 2.71828…). Recursion depth is capped at 100 and expression length at 500 characters.
:::

## Parameters

| Parameter   | Required | Description                                                  |
| ----------- | -------- | ------------------------------------------------------------ |
| `expr`      | Yes      | The mathematical expression to evaluate (max 500 characters) |
| `precision` | No       | Number of decimal places in the result (0–15)                |

## Supported Operators

| Operator | Description                  |
| -------- | ---------------------------- |
| `+`      | Addition                     |
| `-`      | Subtraction / unary negation |
| `*`      | Multiplication               |
| `/`      | Division                     |
| `%`      | Modulo                       |
| `^`      | Exponentiation               |

Unary `-` binds looser than `^`, matching standard math convention: `-2^2` evaluates to `-4` (i.e. `-(2^2)`), not `4`.

## Available Functions

`sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `sqrt`, `abs`, `floor`, `ceil`, `round`, `log`, `log2`, `log10`

## Response Fields

| Field    | Type     | Description             |
| -------- | -------- | ----------------------- |
| `expr`   | `string` | The original expression |
| `result` | `number` | The evaluated result    |

## Code Examples

<Examples method="get" path="/evaluate" :params="{ expr: '2*(3+4)^2', precision: '2' }" />

## Try It

<Try name="Evaluate" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                           | Description                                                     |
| ------------------------------------------------------- | --------------------------------------------------------------- |
| `Please provide a math expression (?expr={expression})` | The `expr` parameter is missing                                 |
| `Expression is too long (max 500 characters)`           | The expression exceeds 500 characters                           |
| `Maximum expression depth exceeded`                     | Nesting depth exceeds 100 levels                                |
| `Division by zero`                                      | The expression attempts to divide by zero                       |
| `Unknown identifier: {name}`                            | An unknown constant or function name was used                   |
| `Invalid number: {num}`                                 | A number literal has more than one decimal point (e.g. `1.2.3`) |
| `precision must be between 0 and 15`                    | The `precision` value is out of range                           |
