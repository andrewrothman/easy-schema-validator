# easy-validator

Easily validate JSON Schema.

## Features

* Supports JSON Schema 04/06/07 via `ajv` package.
* Allows for validation with minimal code and without dealing with thrown exceptions.
* Optional collection of default values. (This option is `enabled` by default)

## Examples

### Validation

We can perform a simple validation like so:

```ts
const schema = {
    type: "object",
    additionalProperties: false,
    required: ["name", "age"],
    properties: {
        name: {
            type: "string"
        },
        age: {
            type: "number",
        },
    },
};

const data = {
    name: "Sue",
    age: 32,
};

const validate = schemaValidator(schema);
const { valid } = await validate(data);
```

### Validation and Defaults Collection

We can also collect schema-defined default values for unspecified properties.

```ts
const schema = {
    type: "object",
    additionalProperties: false,
    required: ["name", "age", "pets"],
    properties: {
        name: {
            type: "string"
        },
        age: {
            type: "number",
        },
        pets: {
           type: "array",
           items: { type: "string" },
           default: [],
        },
    },
};

const data = {
    name: "Sue",
    age: 32,
};

const validate = schemaValidator(schema);
const { valid, defaults } = await validate(data);

console.log(defaults.name); // => "Sue"
console.log(defaults.pets); // => []
```