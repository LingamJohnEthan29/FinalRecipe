import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import CustomImage from './CustomImage'; // Import your CustomImage component

const RecipeCard = ({ recipe }) => {
    return (
        <div className="recipe-card">
            <CustomImage 
                imgSrc={recipe.mainImage ? `http://localhost:3000/${recipe.mainImage}` : 'default-image-url.jpg'} 
                pt="65%" 
            />
            <div className="recipe-card-info">
                <p className="recipe-title">{recipe.name}</p>
                <p className="recipe-cuisine">Cuisine: {recipe.cuisine || 'Unknown'}</p> {/* Display Cuisine */}
                <p className="recipe-desc">{recipe.description || 'No description available.'}</p>
                <Link to={`/recipes/${recipe._id}`} className="view-btn">VIEW RECIPE</Link>
            </div>
        </div>
    );
};

RecipeCard.propTypes = {
    recipe: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        mainImage: PropTypes.string,
        description: PropTypes.string,
        cuisine: PropTypes.string, // Add cuisine prop type
    }).isRequired,
};

export default RecipeCard;
