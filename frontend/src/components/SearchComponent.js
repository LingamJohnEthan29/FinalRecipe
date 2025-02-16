import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchComponent = ({ onResults, onNewSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('name'); // 'name' or 'ingredient'
    const [difficulty, setDifficulty] = useState('');

    const handleInputChange = (e) => setSearchTerm(e.target.value);
    const handleDifficultyChange = (e) => setDifficulty(e.target.value);
    const handleTabChange = (tab) => setActiveTab(tab);

    const handleSearchSubmit = async () => {
        const queryType = activeTab === 'name' ? 'search' : 'ingredient';
        await searchRecipes(queryType, searchTerm, difficulty);

        if (searchTerm || difficulty) {
            const formattedSearch = `${activeTab}: ${searchTerm}`; // Format as "name: [search term]" or "ingredient: [search term]"
            onNewSearch(formattedSearch); // Update previous searches
        }
    };

    const searchRecipes = async (queryType, queryValue, difficulty) => {
        const query = new URLSearchParams();
        query.append(queryType, queryValue);
        if (difficulty) query.append('difficulty', difficulty);

        try {
            const response = await fetch(`http://localhost:3000/recipes?${query.toString()}`);
            if (response.ok) {
                const data = await response.json();
                onResults(data);
            } else {
                console.error('Failed to fetch recipes:', response.statusText);
                onResults([]);
            }
        } catch (error) {
            console.error('Error fetching recipes:', error);
            onResults([]);
        }
    };

    return (
        <div className="search-box">
            <div className="search-input">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    placeholder={`Search by ${activeTab}`}
                />
                <button className="btn" onClick={handleSearchSubmit}>
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            </div>

            <div className="tab-options">
                <button
                    className={`tab ${activeTab === 'name' ? 'active' : ''}`}
                    onClick={() => handleTabChange('name')}
                >
                    Search by Name
                </button>
                <button
                    className={`tab ${activeTab === 'ingredient' ? 'active' : ''}`}
                    onClick={() => handleTabChange('ingredient')}
                >
                    Search by Ingredient
                </button>
            </div>

            <div className="options">
                <select value={difficulty} onChange={handleDifficultyChange}>
                    <option value="">Sort by difficulty</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </div>
        </div>
    );
};

export default SearchComponent;
