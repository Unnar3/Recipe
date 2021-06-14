import { operations } from '../recipe';
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import { RecipeModel } from '../database/recipe/recipe';
import { User, UserModel } from '../database/user/user';
import { Document } from 'mongoose';
import { RecipeError } from '../error/error';

const escapeRegex = (str: string): string => {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

/**
 * List all recipes
 * Recipes can be filtered by userId or title
 *
 * TODO: pagination
 */
const listRecipes = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const queries = req.query as operations['listRecipes']['parameters']['query'];

    const recipes = await RecipeModel.find({
        ...(queries.title && {
            title: { $regex: escapeRegex(queries.title), $options: 'i' }
        }),
        ...(queries.userId && {
            user: queries.userId
        })
    }).populate('user');

    const result: operations['listRecipes']['responses']['200']['content']['application/json'][] =
        recipes.map((r) => {
            return {
                id: r._id,
                title: r.title,
                summary: r.summary,
                userId: (r.user as User & Document)._id,
                userName: (r.user as User).name,
                userAbout: (r.user as User).about
            };
        });
    res.status(200).json(result);
});

/**
 * Fetch a single recipe by id
 */
const getRecipe = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const params = req.params as operations['getRecipe']['parameters']['path'];

    const recipe = await RecipeModel.findById(params.recipeId).populate('user');
    if (!recipe) {
        throw new RecipeError(400, 'recipe not found');
    }

    const result: operations['getRecipe']['responses']['200']['content']['application/json'] = {
        id: recipe._id,
        title: recipe.title,
        summary: recipe.summary,
        authorsLifeStory: recipe.authorsLifeStory,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        userId: (recipe.user as User & Document)._id,
        userName: (recipe.user as User).name,
        userAbout: (recipe.user as User).about
    };

    res.status(200).json(result);
});

/**
 * List all users
 * Users can be filtered by name
 *
 * TODO: pagination
 */
const listUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const queries = req.query as operations['listUsers']['parameters']['query'];

    const users = await UserModel.find({
        ...(queries.name && {
            name: { $regex: escapeRegex(queries.name), $options: 'i' }
        })
    }).populate('user');

    const result: operations['listUsers']['responses']['200']['content']['application/json'] =
        users.map((u) => {
            return {
                id: u._id,
                name: u.name,
                about: u.about
            };
        });
    res.status(200).json(result);
});

const UnauthorizedController = {
    listRecipes,
    getRecipe,
    listUsers
};
export default UnauthorizedController;
