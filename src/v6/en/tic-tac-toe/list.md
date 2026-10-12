# Tic-Tac-Toe List

The `/tic-tac-toe/list` endpoint lists all public games currently in progress. This endpoint does not return private or finished games.

<Endpoint method="post" path="/tic-tac-toe/list" baseUrl="https://api.moxon.dev" />

::: info Good to know
The list only includes public games currently in progress (not finished). Games are sorted by creation time with the most recent first. Private games are never included in this list for privacy reasons. You can join any listed game using its ID with the [/tic-tac-toe](../tic-tac-toe) endpoint.
:::

## Parameters

This endpoint does not require any parameters. It returns all currently active public games.

## Code Examples

<Examples method="post" path="/tic-tac-toe/list" />

## Response Fields

| Field                  | Type       | Description                             |
| ---------------------- | ---------- | --------------------------------------- |
| `message`              | `string`   | Status message                          |
| `count`                | `number`   | Total number of public games            |
| `games`                | `object[]` | Array of public game objects            |
| `games[].id`           | `string`   | Game identifier                         |
| `games[].players`      | `string[]` | Array of player usernames               |
| `games[].playersCount` | `number`   | Number of players in the game           |
| `games[].moves`        | `array`    | Array of moves made in the game         |
| `games[].turn`         | `string`   | Username of the player whose turn it is |
| `games[].status`       | `string`   | Game status (`waiting`, `ready`)        |
| `games[].creation`     | `string`   | Game creation timestamp                 |

## Game Statuses

| Status    | Description                               |
| --------- | ----------------------------------------- |
| `waiting` | Game has one player, waiting for opponent |
| `ready`   | Game has two players and is active        |

## Try It

<Try name="Tic-Tac-Toe List" />

## Error Handling

This endpoint does not require parameters and will not return parameter-related errors.

## Related Endpoints

- <Method type="post" sm /> [/v6/tic-tac-toe](../tic-tac-toe) - Main game endpoint for making moves
- <Method type="post" sm /> [/v6/tic-tac-toe/fetch](./fetch) - Fetch specific game details
