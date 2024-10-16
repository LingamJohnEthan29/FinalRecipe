import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RecipeGenerator = () => {
    const [ingredients, setIngredients] = useState('');
    const [recipe, setRecipe] = useState(null);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => setIngredients(e.target.value);

    const handleSearch = async () => {
        const ingredientArray = ingredients.split(',').map(ingredient => ingredient.trim());
        try {
            // Fetch all recipes from the server
            const response = await fetch('http://localhost:3000/recipes');
            if (response.ok) {
                const data = await response.json();
                const matchedRecipe = findBestRecipe(data, ingredientArray);
                if (matchedRecipe) {
                    setRecipe(matchedRecipe);
                    setError(null); // Reset any previous error
                } else {
                    setError('No recipe found with the provided ingredients');
                    setRecipe(null); // Reset recipe if error occurs
                }
            } else {
                setError('Failed to fetch recipes');
            }
        } catch (error) {
            setError('An error occurred while fetching recipes');
        }
    };

    const findBestRecipe = (recipes, ingredientArray) => {
        let bestMatch = null;
        let maxMatchCount = 0;

        recipes.forEach(recipe => {
            const recipeIngredients = recipe.ingredients.split(',').map(ingredient => ingredient.trim());
            const matchCount = recipeIngredients.filter(ingredient => ingredientArray.includes(ingredient)).length;

            if (matchCount > maxMatchCount) {
                maxMatchCount = matchCount;
                bestMatch = recipe;
            }
        });

        return bestMatch;
    };

    return (
        <div className="recipe-generator">
            <h1>Recipe Generator</h1>
            <p>Tell us your ingredients and we shall give you the perfect recipe possible!</p>
            <input
                type="text"
                value={ingredients}
                onChange={handleInputChange}
                placeholder="Enter ingredients, separated by commas"
            />
            <button className="btn" onClick={handleSearch}>Generate Recipe</button>

            {error && <p>{error}</p>}

            {recipe && (
                <Link to={`/recipes/${recipe._id}`} className="recipe-card">
                    <h2>{recipe.name}</h2>
                    <img src={`http://localhost:3000/${recipe.mainImage}`} alt={recipe.name} />
                    <p>{recipe.description}</p>
                    <h3>Ingredients:</h3>
                    <ul>
                        {recipe.ingredients.split(',').map((ing, index) => (
                            <li key={index}>{ing.trim()}</li>
                        ))}
                    </ul>
                    <h3>Steps:</h3>
                    <ol>
                        {recipe.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </Link>
            )}
        </div>
    );
};

export default RecipeGenerator;
