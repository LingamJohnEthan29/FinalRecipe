import React from 'react';

const PreviousSearches = ({ searches, onSearchClick }) => {
    return (
        <div className="previous-searches section">
            <div className="previous-searches-container">
                {searches.map((search, index) => (
                    <div
                        key={index}
                        style={{ animationDelay: index * 0.1 + "s" }}
                        className="search-item"
                        onClick={() => onSearchClick(search)}
                    >
                        {search}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PreviousSearches;
