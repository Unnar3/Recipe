import jwt from 'jsonwebtoken';
import { RecipeError } from '../error/error';

// TODO: shouold be moved to environment variable
const jwtSecret = 'secret';

export const signToken = (userId: string): string => {
    return jwt.sign(
        {
            userId: userId
        },
        jwtSecret,
        { expiresIn: '1h', issuer: 'recipe' }
    );
};

export const verifyToken = (token: string): string => {
    try {
        var decoded = jwt.verify(token, jwtSecret) as { userId: string };
        return decoded.userId;
    } catch (err) {
        throw new RecipeError(401, 'invalid access token', [], err);
    }
};
