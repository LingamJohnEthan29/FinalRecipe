const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');

const app = express();
const port = 3000;
const uri = "mongodb+srv://medhanaidubonu:fxJZ3r4sFt5krCFY@recipes.9ye98.mongodb.net/?retryWrites=true&w=majority&appName=Recipes";

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('uploads'));

const upload = multer({ dest: 'uploads/' });

let db;

// Connect to MongoDB
MongoClient.connect(uri)
    .then(client => {
        db = client.db('recipeBook');
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch(error => {
        console.error('Database connection error:', error);
        process.exit(1); // Exit the process if database connection fails
    });

// Get all recipes or search by name, ingredient, or difficulty
app.get('/recipes', async (req, res) => {
    res.set('Cache-Control', 'no-store'); // Prevent caching
    const { search, ingredient, difficulty } = req.query;

    console.log("Received Query Params:", req.query); // Log query parameters for debugging

    try {
        let filter = {};

        // Search by name
        if (search) {
            filter.name = { $regex: new RegExp(search.trim(), 'i') }; // Case-insensitive
        }

        // Search by ingredient (handling hashtags)
        if (ingredient) {
            const cleanedIngredient = ingredient.startsWith('#') ? ingredient.slice(1) : ingredient; // Remove '#' if present
            filter.ingredients = { $regex: new RegExp(cleanedIngredient.trim(), 'i') }; // Case-insensitive
        }

        // Filter by difficulty
        if (difficulty) {
            filter.preparationLevel = difficulty; // Exact match
        }

        const recipes = await db.collection('recipes').find(filter).toArray();
        console.log("Found Recipes:", recipes); // Log the found recipes for debugging

        res.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).send('Failed to fetch recipes.');
    }
});

// Get a specific recipe by ID
app.get('/recipes/:id', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const recipe = await db.collection('recipes').findOne({ _id: new ObjectId(recipeId) });
        
        if (!recipe) {
            console.warn(`Recipe not found: ID ${recipeId}`);
            return res.status(404).send('Recipe not found');
        }
        
        res.json(recipe);
    } catch (error) {
        console.error('Error fetching recipe by ID:', error);
        res.status(500).send('Failed to fetch recipe.');
    }
});

// Create a new recipe
app.post('/recipes', upload.single('mainImage'), async (req, res) => {
    try {
        const newRecipe = {
            name: req.body.name,
            mainImage: req.file ? req.file.filename : null,
            ingredients: req.body.ingredients,
            preparationLevel: req.body.preparationLevel,
            steps: req.body.steps,
            description: req.body.description,
            cuisine: req.body.cuisine, // Include Cuisine
        };
        const result = await db.collection('recipes').insertOne(newRecipe);
        res.status(201).json({ id: result.insertedId, ...newRecipe });
    } catch (error) {
        console.error('Error creating new recipe:', error);
        res.status(500).send('Failed to create recipe.');
    }
});

// Update a recipe by ID
app.put('/recipes/:id', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const updatedRecipe = req.body;

        const result = await db.collection('recipes').updateOne(
            { _id: new ObjectId(recipeId) },
            { $set: updatedRecipe }
        );

        if (result.modifiedCount === 0) {
            console.warn(`No recipes updated for ID ${recipeId}`);
            return res.status(404).send('Recipe not found or no changes made');
        }

        res.send('Recipe updated successfully');
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).send('Failed to update recipe.');
    }
});

// Delete a recipe by ID
app.delete('/recipes/:id', async (req, res) => {
    try {
        const recipeId = req.params.id;

        const result = await db.collection('recipes').deleteOne({ _id: new ObjectId(recipeId) });

        if (result.deletedCount === 0) {
            console.warn(`No recipes found for deletion with ID ${recipeId}`);
            return res.status(404).send('Recipe not found');
        }

        res.send('Recipe deleted successfully');
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).send('Failed to delete recipe.');
    }
});
