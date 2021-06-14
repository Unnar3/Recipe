import { Schema, model, PopulatedDoc, Document } from 'mongoose';
import { User } from '../user/user';

// 1. Create an interface representing a document in MongoDB.
export interface Recipe {
    title: string;
    summary: string;
    authorsLifeStory: string;
    ingredients: string[];
    instructions: string[];
    user?: PopulatedDoc<User & Document>;
}

// 2. Create a Schema corresponding to the document interface.
export const recipeSchema = new Schema<Recipe>({
    title: { type: String, required: true },
    summary: { type: String, required: true },
    authorsLifeStory: { type: String, required: true },
    ingredients: { type: [String], required: true },
    instructions: { type: [String], required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

// 3. Create a Model.
export const RecipeModel = model<Recipe>('Recipe', recipeSchema);
