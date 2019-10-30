import Ajv from "ajv"
import fetch from "cross-fetch";

type Schema = any;

interface SchemaValidatorOptions {
	useDefaults?: boolean;
}

type ValidatorFunction<T> = (data: unknown) => Promise<ValidationResult<T>>;

interface ValidationResult<T> {
	/**
	 * Whether or not the data passed validation.
	 */
	isValid: boolean;
	
	/**
	 * An array of validation errors.
	 */
	errors: Ajv.ErrorObject[];
	
	/**
	 * The validated value is validation is passed, and undefined if failed.
	 */
	value: T | undefined;
}

async function defaultResolver(uri: string) {
	const res = await fetch(uri);
	const json = await res.json();
	return json;
}

class SchemaValidator<T> {
	private ajv: Ajv.Ajv;
	private schema: { [key: string]: any };
	private validateFunc: any;
	
	constructor(schema: any, private options: SchemaValidatorOptions = {}) {
		this.schema = schema;
		
		this.ajv = new Ajv({
			useDefaults: options.useDefaults !== false,
			loadSchema: defaultResolver,
		});
	}
	
	async validate(data: unknown): Promise<ValidationResult<T>> {
		if (this.validateFunc === undefined) {
			this.validateFunc = await this.ajv.compileAsync(this.schema);
		}
		
		const isValid = await this.validateFunc(data);
			
		return {
			isValid,
			errors: this.validateFunc.errors || [],
			value: isValid ? data as T : undefined,
		};
	}
}

export default SchemaValidator;