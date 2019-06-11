import SchemaValidator from "./index";

it("validates empty schema and data", async () => {
	const schema: any = {};
	const data: any = {};
	
	const validator = new SchemaValidator(schema);
	const { isValid, errors, value } = await validator.validate(data);
	expect(isValid).toBe(true);
	expect(errors).toHaveLength(0);
	expect(value).toEqual({});
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
	const { isValid, errors, value } = await validator.validate(data);
	expect(isValid).toBe(false);
	expect(errors).toHaveLength(1);
	expect(value).toEqual(undefined);
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
	const { isValid, errors, value } = await validator.validate(data);
	expect(isValid).toBe(true);
	expect(errors).toHaveLength(0);
	expect(value).toEqual({
		name: "Sue",
		age: 32,
		pets: [],
	});
});
