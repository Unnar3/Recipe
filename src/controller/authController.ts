import auth from 'basic-auth';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { UserModel } from '../database/user/user';
import { RecipeError } from '../error/error';
import { signToken } from '../jwt/jwt';
import { operations } from '../recipe';

/**
 * Handler function to register new user
 */
const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body as operations['register']['requestBody']['content']['application/json'];
    const user = new UserModel({
        name: body.name,
        email: body.email,
        about: body.about,
        password: body.password
    });
    await user.save();

    const response: operations['register']['responses']['201']['content']['application/json'] = {
        name: body.name,
        email: body.email
    };
    res.status(201).json(response);
});

/**
 * Handler function too login existing users
 */
const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const login = auth(req);
    if (!login) {
        throw new RecipeError(401, 'invalid username or password', undefined);
    }

    const user = await UserModel.findOne({ email: login.name });
    if (!user) {
        throw new RecipeError(401, 'invalid username or password', undefined);
    }
    if (user.password !== login.pass) {
        throw new RecipeError(401, 'invalid username or password');
    }

    const token = signToken(user._id);

    const response: operations['login']['responses']['200']['content']['application/json'] = {
        token
    };
    res.status(200).json(response);
});

const AuthController = {
    register,
    login
};
export default AuthController;
