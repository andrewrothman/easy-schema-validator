# easy-schema-validator

Easily validate JSON Schema.

## Features

* Supports JSON Schema 04/06/07 via `ajv` package.
* Allows for validation with minimal code.
* Optional collection of default values. (This is enabled by default)

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

const errors = await SchemaValidator.validate(schema, data);

if (errors.length === 0) {
    console.log("data matches schema");
}
else {
    console.log("data does not match schema");
}
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

await SchemaValidator.validate(data, schema);

console.log(data.name); // => "Sue"
console.log(data.pets); // => []
```

### As An Instance

You can also construct instances of `SchemaValidator` if you'd prefer. This may increase performance when validating a large amount of data items using the same schema.

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
const errors = await validator.validate(data);

if (errors.length === 0) {
    console.log("data matches schema");
}
else {
    console.log("data does not match schema");
}
```
