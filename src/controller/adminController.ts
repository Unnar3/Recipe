import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { RecipeModel } from '../database/recipe/recipe';
import { UserModel } from '../database/user/user';

/**
 * Reset the database, for development purposes
 */
const cleanDatabase = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await RecipeModel.remove({}, function (_) {
        console.log('Recipe collection removed');
    });
    await UserModel.remove({}, function (_) {
        console.log('User collection removed');
    });
    res.status(200).json({ status: 'cleaned' });
});

const AdminController = { cleanDatabase };
export default AdminController;
