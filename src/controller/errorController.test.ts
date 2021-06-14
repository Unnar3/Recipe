import { ValidationError } from 'express-openapi-validate';
import { RecipeError } from '../error/error';
import ErrorController from './errorController';

const mockResponse = () => {
    const res = {} as any;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('error handler', () => {
    test('RecipeError', async () => {
        const res = mockResponse();
        const err = new RecipeError(404, 'recipe error', ['test']);
        ErrorController.errorHandler(err, {} as any, res, {} as any);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'recipe error', errors: ['test'] });
    });

    test('ValidationError', async () => {
        const res = mockResponse();
        const err = new ValidationError('invalid parameter test', {} as any);
        ErrorController.errorHandler(err, {} as any, res, {} as any);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'validation error',
            errors: ['invalid parameter test']
        });
    });

    test('Generic Error returns 500', async () => {
        const res = mockResponse();
        const err = new Error('generic error');
        ErrorController.errorHandler(err, {} as any, res, {} as any);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'internal error' });
    });
});
