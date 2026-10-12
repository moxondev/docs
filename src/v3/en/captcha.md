# Captcha Generation

The `/captcha` endpoint generates an image from a text provided as a parameter. This endpoint can be useful for testing a user with the generated captcha by storing the text in memory.

<Endpoint method="get" path="/captcha" />

## Parameters

| Parameter | Required | Description                                                       |
| --------- | -------- | ----------------------------------------------------------------- |
| `text`    | Yes      | The captcha text to generate. Must contain at least one character |

## Request Example

```
GET /v3/captcha?text=test1234?ABCD
```

## Response

The endpoint returns a PNG image of the generated captcha.

## cURL

```bash
curl -X GET "https://api.moxon.dev/v3/captcha?text=test1234?ABCD" --output captcha.png
```

::: tip Example
[See an example of the generated captcha](https://api.moxon.dev/v3/captcha?text=test1234?ABCD)
:::

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                    | Description                                |
| ------------------------------------------------ | ------------------------------------------ |
| `Please provide a valid argument (?text={text})` | The `text` parameter is missing or invalid |
