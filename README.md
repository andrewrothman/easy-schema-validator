# easy-schema-validator

Easily validate JSON Schema.

## Features

* Supports JSON Schema 04/06/07 via `ajv` package.
* Allows for validation with minimal code.
* Optional collection of default values. (This option is enabled by default)

## Examples

### Validation

We can perform a simple validation like so:

```ts
import SchemaValidator from "easy-schema-validator";

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

const validator = new SchemaValidator(schema);
const { isValid } = await validator.validate(data);
```

### Validation and Defaults Collection

We can also collect schema-defined default values for unspecified properties.

```ts
import SchemaValidator from "easy-schema-validator";

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

const validator = new SchemaValidator(schema);
const { isValid, value } = await validator.validate(data);

console.log(value.name); // => "Sue"
console.log(value.pets); // => []
```
