import { ValidationError } from 'express-openapi-validate';

export class RecipeError extends Error {
    readonly errorType = 'RECIPE';

    constructor(
        public status: number,
        public message: string,
        public errors: string[] | undefined = undefined,
        public error: Error | undefined = undefined
    ) {
        super(message);
    }

    getBody() {
        return {
            message: this.message
        };
    }
}

export const isRecipeError = (error: Error | RecipeError): error is RecipeError => {
    return (error as RecipeError).errorType === 'RECIPE';
};

export const isValidationError = (error: Error | ValidationError): error is ValidationError => {
    return (error as ValidationError).statusCode === 400;
};
