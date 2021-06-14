import { Request, Response, NextFunction } from 'express';
import { isRecipeError, isValidationError } from '../error/error';
import { components } from '../recipe';

/**
 * Handle all errors thrown in the endpoints. In case of a unknown error return 500 - Internal Error
 */
const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    // TODO: properly log and handle errors
    if (isRecipeError(err)) {
        const data: components['schemas']['GenericError'] = {
            message: err.message,
            errors: err.errors ?? []
        };
        res.status(err.status).json(data);
    } else if (isValidationError(err)) {
        const data: components['schemas']['ValidationError'] = {
            message: 'validation error',
            errors: [err.message]
        };
        res.status(400).json(data);
    } else {
        const data: components['schemas']['InternalError'] = {
            message: 'internal error'
        };
        res.status(500).json(data);
    }
};

const ErrorController = {
    errorHandler
};
export default ErrorController;
