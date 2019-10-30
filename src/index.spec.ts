import SchemaValidator from "./index";

it("validates empty schema and data", async () => {
	const schema: any = {};
	const data: any = {};
	
	const validator = new SchemaValidator(schema);
	const errors = await validator.validate(data);
	expect(errors).toHaveLength(0);
});

it("errors with invalid data", async () => {
	const schema = {
		type: "object",
		additionalProperties: false,
		properties: {},
	};
	
	const data = {
		additional: "property",
	};
	
	const validator = new SchemaValidator(schema);
	const errors = await validator.validate(data);
	expect(errors).toHaveLength(1);
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
	
	const validator = new SchemaValidator(schema);
	const errors = await validator.validate(data);
	expect(errors).toHaveLength(0);
	expect(data).toEqual({
		name: "Sue",
		age: 32,
		pets: [],
	});
});
