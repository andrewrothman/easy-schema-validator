import Ajv from "ajv"
import fetch from "cross-fetch";

export type Schema = object;
export type SchemaValidationError = Ajv.ErrorObject;

interface SchemaValidatorOptions {
	useDefaults?: boolean;
}

async function defaultResolver(uri: string) {
	const res = await fetch(uri);
	const json = await res.json();
	return json;
}

class SchemaValidator {
	private ajv: Ajv.Ajv;
	private schema: Schema;
	private validateFunc: any;
	
	constructor(schema: Schema, options: SchemaValidatorOptions = {}) {
		this.schema = schema;
		
		this.ajv = new Ajv({
			useDefaults: options.useDefaults !== false,
			loadSchema: defaultResolver,
		});
	}
	
	async validate(data: unknown): Promise<SchemaValidationError[]> {
		if (this.validateFunc === undefined) {
			this.validateFunc = await this.ajv.compileAsync(this.schema);
		}
		
		await this.validateFunc(data);
		return this.validateFunc.errors || [];
	}
	
	static async validate(data: unknown, schema: Schema, options: SchemaValidatorOptions = {}): Promise<SchemaValidationError[]> {
		const validator = new SchemaValidator(schema, options);
		return validator.validate(data);
	}
}

export default SchemaValidator;