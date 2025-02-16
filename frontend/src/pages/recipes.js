import React, { useEffect, useState } from 'react';
import PreviousSearches from "../components/PreviousSearches";
import RecipeCard from "../components/RecipeCard";
import CreateRecipe from '../components/CreateRecipe'; 
import SearchComponent from '../components/SearchComponent'; 

export default function Recipes() {
    const [recipes, setRecipes] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const [searchResults, setSearchResults] = useState([]); 
    const [previousSearches, setPreviousSearches] = useState([]); 
    const [hasSearched, setHasSearched] = useState(false); 

    const fetchRecipes = async () => {
        setLoading(true); 
        try {
            const response = await fetch('http://localhost:3000/recipes'); 
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setRecipes(data); 
            setError(null); 
        } catch (error) {
            console.error('Error fetching recipes:', error);
            setError('Failed to load recipes.'); 
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        fetchRecipes(); 
    }, []);

    const handleSearchResults = (results) => {
        setSearchResults(results); 
        setHasSearched(true); 
    };

    const updatePreviousSearches = (newSearch) => {
        setPreviousSearches((prev) => {
            if (!prev.includes(newSearch)) {
                return [newSearch, ...prev]; 
            }
            return prev; 
        });
    };

    return (
        <div>
            <div className="recipes-tab">
                <h2 className="section-title">Create Your Own Recipe</h2>
                <p className="section-description">Share your culinary creations with the world!</p>
                <CreateRecipe />
                <hr /> {/* Horizontal line after the Create Recipe section */}
            </div>
            <div className="search-section">
                <PreviousSearches 
                    searches={previousSearches} 
                    onSearchClick={handleSearchResults} 
                />
                <h2 className="section-title-prev">Previous Searches</h2>
                <p className="section-description-prev">Quickly revisit your past searches.</p>
                
                <h2 className="section-title-search">Search for Recipes</h2>
                <p className="section-description-search">Find recipes that inspire your next meal!</p>
                <SearchComponent 
                    onResults={handleSearchResults} 
                    onNewSearch={updatePreviousSearches} 
                />
                <hr /> {/* Horizontal line after Search for Recipes section */}
            </div>
            <div className="recipes-container">
                {loading ? (
                    <p>Loading recipes...</p> 
                ) : error ? (
                    <p>{error}</p> 
                ) : (
                    <>
                        <h2 className="section-title-list">Recipe List</h2>
                        <p></p>
                        <p></p>
                        <p></p>
                        {searchResults.length > 0 ? (
                            searchResults.map(recipe => (
                                <RecipeCard key={recipe._id} recipe={recipe} />
                            ))
                        ) : (
                            recipes.map(recipe => (
                                <RecipeCard key={recipe._id} recipe={recipe} />
                            ))
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
