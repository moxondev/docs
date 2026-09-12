# Matrix

The `/matrix` endpoint performs mathematical operations on matrices. It supports arithmetic, scalar multiplication, transposition, and linear algebra operations on up to 20×20 matrices.

<Endpoint method="post" path="/matrix" baseUrl="https://api.sylvain.sh" />

::: info How it works?
Determinant is computed via Gaussian elimination with partial pivoting. Matrix inverse uses Gauss-Jordan elimination on an augmented matrix. All inputs are validated: values must be finite numbers, rows must have uniform length, and the matrix must not exceed 20×20.
:::

## Parameters

The request body must be JSON:

| Parameter   | Required | Description                                                |
| ----------- | -------- | ---------------------------------------------------------- |
| `operation` | Yes      | The operation to perform (see available operations)        |
| `matrix`    | Yes      | The input matrix (2D array of numbers)                     |
| `matrix2`   | Depends  | Second matrix — required for `add`, `subtract`, `multiply` |
| `scalar`    | Depends  | Scalar value — required for `scalar`, used by `identity`   |

## Available Operations

| Operation     | Description                                           | Requires  |
| ------------- | ----------------------------------------------------- | --------- |
| `add`         | Element-wise addition                                 | `matrix2` |
| `subtract`    | Element-wise subtraction                              | `matrix2` |
| `multiply`    | Matrix multiplication                                 | `matrix2` |
| `scalar`      | Multiply all elements by a scalar                     | `scalar`  |
| `transpose`   | Transpose rows and columns                            | —         |
| `determinant` | Compute the determinant (square matrices only)        | —         |
| `inverse`     | Compute the inverse (square, non-singular matrices)   | —         |
| `identity`    | Generate an identity matrix of size `scalar`×`scalar` | `scalar`  |

## Response Fields

The response format depends on the operation:

| Operation                                                                   | `result` type |
| --------------------------------------------------------------------------- | ------------- |
| `add`, `subtract`, `multiply`, `scalar`, `transpose`, `inverse`, `identity` | `number[][]`  |
| `determinant`                                                               | `number`      |

## Code Examples

<Examples method="post" path="/matrix" :body="{ operation: 'determinant', matrix: [[1,2],[3,4]] }" />

## Try It

<Try name="Matrix" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                       | Description                                                                                                                                               |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Please provide a valid operation`                  | The `operation` parameter is missing or invalid. Valid values: `add`, `subtract`, `multiply`, `scalar`, `transpose`, `determinant`, `inverse`, `identity` |
| `Matrix must be a non-empty 2D array`               | The matrix is missing or malformed                                                                                                                        |
| `All rows must have the same length`                | The matrix rows are not uniform                                                                                                                           |
| `Matrix values must be finite numbers`              | The matrix contains non-numeric values                                                                                                                    |
| `Matrix exceeds maximum size of 20×20`              | The matrix is larger than 20×20                                                                                                                           |
| `Both matrices must have the same dimensions`       | Dimension mismatch for add/subtract                                                                                                                       |
| `Matrix dimensions incompatible for multiplication` | Column count of A ≠ row count of B                                                                                                                        |
| `Matrix must be square`                             | Operation requires a square matrix                                                                                                                        |
| `Matrix is singular and cannot be inverted`         | The matrix has no inverse                                                                                                                                 |
