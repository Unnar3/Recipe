import { Request, Response, NextFunction } from 'express';
import { RecipeModel } from '../database/recipe/recipe';
import { RecipeError } from '../error/error';
import { verifyToken } from '../jwt/jwt';
import { operations } from '../recipe';
import asyncHandler from 'express-async-handler';

/**
 * Create new recipe for a logged in user
 */
const createRecipe = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        throw new RecipeError(400, 'authorization missing or invalid');
    }
    const token = req.headers.authorization?.replace('Bearer ', '');
    const userId = verifyToken(token);

    const body =
        req.body as operations['createRecipe']['requestBody']['content']['application/json'];

    const recipe = new RecipeModel({
        title: body.title,
        summary: body.summary,
        authorsLifeStory: body.authorsLifeStory,
        ingredients: body.ingredients,
        instructions: body.instructions,
        user: userId
    });
    const createdRecipe = await recipe.save();

    const response: operations['createRecipe']['responses']['201']['content']['application/json'] =
        {
            id: createdRecipe._id!
        };
    res.status(200).json(response);
});

/**
 * List all recipes for a logged in user
 *
 * TODO: add pagination
 */
const listRecipes = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        throw new RecipeError(400, 'authorization missing or invalid');
    }
    const token = req.headers.authorization?.replace('Bearer ', '');
    const userId = verifyToken(token);

    const recipes = await RecipeModel.find({ user: userId });

    const result: operations['listUserRecipes']['responses']['200']['content']['application/json'][] =
        recipes.map((r) => {
            return {
                id: r._id,
                title: r.title,
                summary: r.summary
            };
        });

    res.status(200).json(result);
});

const UserController = {
    createRecipe,
    listRecipes
};
export default UserController;
