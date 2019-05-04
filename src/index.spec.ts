import schemaValidator from "./index";

it("validates empty schema and data", async () => {
	const schema: any = {};
	const data: any = {};
	
	const validate = schemaValidator(schema);
	const { defaults, valid } = await validate(data);
	expect(defaults).toEqual({});
	expect(valid).toBe(true);
});

it.todo("throws with invalid schema");

it("errors with invalid data", async () => {
	const schema = {
		type: "object",
		additionalProperties: false,
		properties: {},
	};
	
	const data = {
		additional: "property",
	};
	
	const validate = schemaValidator(schema);
	const { defaults, valid } = await validate(data);
	expect(defaults).toEqual(data);
	expect(valid).toBe(false);
});

it("collects defaults", async () => {
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
	
	expect(defaults).toEqual({
		name: "Sue",
		age: 32,
		pets: [],
	});
	expect(valid).toBe(true);
});
