import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function RecipeDetail() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRecipe = async () => {
        try {
            const response = await fetch(`http://localhost:3000/recipes/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setRecipe(data);
        } catch (error) {
            console.error('Error fetching recipe:', error);
            setError('Failed to load recipe. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipe();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!recipe) return <p>No recipe found.</p>;

    return (
        <div className="recipe-detail">
            <div className="image-container">
                <h1>{recipe.name}</h1>
                <p>{recipe.description || 'No description available.'}</p>
                <div className="cuisine">
                    <span style={{ fontWeight: 'bold' }}>Cuisine:</span>
                    <span style={{ marginLeft: '10px' }}>{recipe.cuisine || 'Not specified'}</span>
                </div>
                <div className="preparation-level">
                    <span style={{ fontWeight: 'bold' }}>Preparation Level:</span>
                    <span style={{ marginLeft: '10px' }}>{recipe.preparationLevel || 'Not specified'}</span>
                </div>
                <img src={`http://localhost:3000/${recipe.mainImage}`} alt={recipe.name} />
            </div>
            <div className="details">
                <h2>Ingredients:</h2>
                <ul>
                    {recipe.ingredients.split(',').map((ingredient, index) => (
                        <li key={index}>{ingredient.trim()}</li>
                    ))}
                </ul>
                <h2>Steps:</h2>
                <ol>
                    {recipe.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                    ))}
                </ol>
            </div>
        </div>
    );
}
