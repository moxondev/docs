# Case

The `/case` endpoint converts text between 9 case formats using universal tokenization (camelCase splitting, `_`, `-`, `.`, spaces).

<Endpoint method="get" path="/case" baseUrl="https://api.sylvain.sh" />

## Parameters

| Parameter | Required | Default | Description        |
| --------- | -------- | ------- | ------------------ |
| `text`    | Yes      | —       | Text to convert    |
| `to`      | No       | `camel` | Target case format |

## Available Targets

| Target     | Description   | Example (`hello_world`) |
| ---------- | ------------- | ----------------------- |
| `camel`    | camelCase     | `helloWorld`            |
| `pascal`   | PascalCase    | `HelloWorld`            |
| `snake`    | snake_case    | `hello_world`           |
| `kebab`    | kebab-case    | `hello-world`           |
| `constant` | CONSTANT_CASE | `HELLO_WORLD`           |
| `title`    | Title Case    | `Hello World`           |
| `sentence` | Sentence case | `Hello world`           |
| `upper`    | UPPERCASE     | `HELLO_WORLD`           |
| `lower`    | lowercase     | `hello_world`           |

## Response Fields

| Field    | Type     | Description             |
| -------- | -------- | ----------------------- |
| `text`   | `string` | The original input text |
| `to`     | `string` | The target case format  |
| `result` | `string` | The converted text      |

## Code Examples

<Examples method="get" path="/case" :params="{ text: 'hello_world', to: 'pascal' }" />

## Try It

<Try name="Case" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                                                                             | Description                                                                              |
| --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `Please provide a text (?text={text})`                                                                    | The `text` parameter is missing                                                          |
| `Text cannot exceed 1000 characters`                                                                      | The `text` exceeds the maximum length                                                    |
| `Text must contain at least one alphanumeric character`                                                   | The `text` contains only separators/punctuation (e.g. `---`), leaving nothing to convert |
| `Invalid target case. Valid values: camel, pascal, snake, kebab, constant, title, sentence, upper, lower` | The `to` value is not valid                                                              |
