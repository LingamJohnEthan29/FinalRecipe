import React, { useEffect, useState } from 'react';
import RecipeCard from '../components/RecipeCard';

export default function Cuisines() {
    const [cuisines, setCuisines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCuisines = async () => {
        try {
            const response = await fetch('http://localhost:3000/recipes');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const categorized = data.reduce((acc, recipe) => {
                const cuisine = recipe.cuisine || 'Unknown';
                if (!acc[cuisine]) acc[cuisine] = [];
                acc[cuisine].push(recipe);
                return acc;
            }, {});
            const sortedCuisines = Object.entries(categorized).sort(([a], [b]) => a.localeCompare(b));
            setCuisines(sortedCuisines);
        } catch (error) {
            console.error('Error fetching cuisines:', error);
            setError('Failed to load cuisines. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCuisines();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="cuisines">
            <h1>Explore Cuisines</h1>
            <p>
                Discover a variety of cuisines and recipes that you can try at home. Each cuisine is unique, 
                offering a rich tapestry of flavors and traditions. Click on the cuisine names below to explore 
                delicious recipes!
            </p>
            <hr></hr>
            {cuisines.map(([cuisine, recipes], index) => (
                <div key={cuisine} className="cuisine-category">
                    <h2>{cuisine}</h2>
                    <p className="cuisine-description">
                        {/* Add a description for each cuisine. You might want to customize this further */}
                        Discover the wonderful dishes and ingredients that define {cuisine} cuisine.
                    </p>
                    <div className="recipe-cards">
                        {recipes.map(recipe => (
                            <RecipeCard key={recipe._id} recipe={recipe} />
                        ))}
                    </div>
                    {/* Add a horizontal line after each cuisine category, except the last one */}
                    {index < cuisines.length - 1 && <hr />}
                </div>
            ))}
        </div>
    );
}
