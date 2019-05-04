import Ajv from "ajv"
import fetch from "isomorphic-fetch";
import clone from "clone";

type Schema = any;

interface SchemaValidatorOptions {
	defaults?: boolean;
}

type ValidatorFunction<T> = (data: unknown) => Promise<ValidationResult<T>>;

interface ValidationResult<T> {
	valid: boolean;
	defaults: Partial<T>;
}

async function defaultResolver(uri: string) {
	const res = await fetch(uri);
	const json = await res.json();
	return json;
}

function schemaValidator<T = any>(schema: Schema, options: SchemaValidatorOptions = {}): ValidatorFunction<T> {
	const ajv = new Ajv({
		useDefaults: options.defaults !== false,
		loadSchema: defaultResolver,
	});
	
	let validate: Ajv.ValidateFunction;
	
	return async (data: unknown) => {
		if (validate === undefined) {
			validate = await ajv.compileAsync(schema);
		}
		
		let newData: any = data;
		
		// clone the data if we want to collect defaults, as otherwise the previous data would be modified
		if (options.defaults !== false) {
			newData = clone(data);
		}
		
		try {
			const valid = await validate(newData);
			
			return {
				valid,
				defaults: newData,
			};
		}
		catch (e) {
			// todo: needs to have reason that it failed... need to check if it was specifically a validation error or what... maybe it was a resolve error
			
			return {
				valid: false,
				defaults: newData,
			};
		}
	};
}

export default schemaValidator;