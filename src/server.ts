require('./env').validate();

import express from 'express';
import { connectDatabase } from './database/database';
import { RecipeError } from './error/error';
import { OpenApiDocument, OpenApiValidator } from 'express-openapi-validate';
import morgan from 'morgan';
import fs from 'fs';
import jsYaml from 'js-yaml';
import AuthController from './controller/authController';
import UserController from './controller/userController';
import UnauthorizedController from './controller/unauthorizedController';
import AdminController from './controller/adminController';
import ErrorController from './controller/errorController';

// Load OpenApi spec from file and create endpoint validator
const openApiDocument = jsYaml.load(fs.readFileSync('recipe-oapi.yml', 'utf-8'));
if (!openApiDocument) {
    throw new RecipeError(500, 'error loading document');
}
const validator = new OpenApiValidator(openApiDocument as OpenApiDocument);

connectDatabase();

const app = express();
const port = 8080;

app.use(morgan('tiny'));

// Parse json body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup auth endpoints
app.post('/v1/register', validator.match(), AuthController.register);
app.post('/v1/login', validator.match(), AuthController.login);

// Setup user endpoints
// TODO: handle JWT token validation in a middleware
app.post('/v1/user/recipes/create', validator.match(), UserController.createRecipe);
app.get('/v1/user/recipes/list', validator.match(), UserController.listRecipes);

// Set up unauthorized endpoints
app.get('/v1/recipes', validator.match(), UnauthorizedController.listRecipes);
app.get('/v1/recipes/:recipeId', validator.match(), UnauthorizedController.getRecipe);
app.get('/v1/users', validator.match(), UnauthorizedController.listUsers);

// Set up admin endpoints
// TODO: Admin endpoints should be authenticated and ideally in a seperate API.
app.post('/v1/admin/clean', AdminController.cleanDatabase);

// Set up final error handler, should be last
// Uses asyncHandler to call next in an async function
app.use(ErrorController.errorHandler);

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
