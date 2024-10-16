import React, { useState } from 'react';

export default function CreateRecipe() {
    const [isOpen, setIsOpen] = useState(false);
    const [recipe, setRecipe] = useState({
        name: '',
        mainImage: null,
        ingredients: '',
        preparationLevel: '',
        steps: [''],
        description: '',
        cuisine: '', // Added Cuisine state
    });
    const [imagePreview, setImagePreview] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // State for success message

    const toggleModal = () => {
        setIsOpen(!isOpen);
        resetForm();
    };

    const resetForm = () => {
        setRecipe({
            name: '',
            mainImage: null,
            ingredients: '',
            preparationLevel: '',
            steps: [''],
            description: '',
            cuisine: '', // Reset Cuisine
        });
        setImagePreview('');
        setSuccessMessage(''); // Reset success message
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRecipe((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleStepChange = (index, value) => {
        const newSteps = [...recipe.steps];
        newSteps[index] = value;
        setRecipe((prev) => ({
            ...prev,
            steps: newSteps,
        }));
    };

    const addStep = () => {
        setRecipe((prev) => ({
            ...prev,
            steps: [...prev.steps, ''],
        }));
    };

    const removeStep = (index) => {
        const newSteps = recipe.steps.filter((_, i) => i !== index);
        setRecipe((prev) => ({
            ...prev,
            steps: newSteps,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setRecipe((prev) => ({ ...prev, mainImage: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate description length
        if (recipe.description.length > 60) {
            alert("Description must be 60 characters or less.");
            return;
        }

        const formData = new FormData();
        formData.append('name', recipe.name);
        formData.append('mainImage', recipe.mainImage);
        formData.append('ingredients', recipe.ingredients);
        formData.append('preparationLevel', recipe.preparationLevel);
        formData.append('description', recipe.description);
        formData.append('cuisine', recipe.cuisine); // Include Cuisine in form data
        recipe.steps.forEach((step, index) => {
            formData.append(`steps[${index}]`, step);
        });

        try {
            const response = await fetch('http://localhost:3000/recipes', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                const newRecipe = await response.json();
                console.log('Recipe Created:', newRecipe);
                setSuccessMessage("You have successfully added a recipe!"); // Set success message
                resetForm(); // Clear the form
            } else {
                console.error('Failed to create recipe:', response.statusText);
            }
        } catch (error) {
            console.error('Error submitting recipe:', error);
        }
    };

    return (
        <div className="create-recipe">
            <button className="btn" onClick={toggleModal}>
                Create A Recipe
            </button>
            {isOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={toggleModal}>&times;</span>
                        <h2>Create New Recipe</h2>
                        <form onSubmit={handleSubmit}>
                            <input 
                                type="text" 
                                name="name" 
                                placeholder="Name of the Dish" 
                                value={recipe.name} 
                                onChange={handleInputChange} 
                                required 
                            />
                            <input 
                                type="file" 
                                name="mainImage" 
                                accept="image/*" 
                                onChange={handleImageChange} 
                                required 
                            />
                            {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px', marginBottom: '1em' }} />}
                            <textarea 
                                name="ingredients" 
                                placeholder="Ingredients Used" 
                                value={recipe.ingredients} 
                                onChange={handleInputChange} 
                                required 
                            />
                            <input 
                                type="text" 
                                name="description" 
                                placeholder="Description (max 60 characters)" 
                                value={recipe.description} 
                                onChange={handleInputChange} 
                                maxLength={60} 
                                required 
                            />
                            <input 
                                type="text" 
                                name="cuisine" 
                                placeholder="Cuisine" 
                                value={recipe.cuisine} 
                                onChange={handleInputChange} 
                                required 
                            />
                            <select 
                                name="preparationLevel" 
                                value={recipe.preparationLevel} 
                                onChange={handleInputChange} 
                                required 
                            >
                                <option value="" disabled>Select Level of Preparation</option>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                            <h3>Steps:</h3>
                            {recipe.steps.map((step, index) => (
                                <div key={index} className="step-input">
                                    <input 
                                        type="text" 
                                        placeholder={`Step ${index + 1}`} 
                                        value={step} 
                                        onChange={(e) => handleStepChange(index, e.target.value)} 
                                        required 
                                    />
                                    <button type="button" className="remove-step-btn" onClick={() => removeStep(index)}>Remove</button>
                                </div>
                            ))}
                            <button type="button" className="add-step-btn" onClick={addStep}>Add Step</button>
                            <button type="submit" className="btn add-recipe-btn">Add Recipe</button>
                        </form>
                        {successMessage && <p className="success-message">{successMessage}</p>} {/* Display success message */}
                    </div>
                </div>
            )}
        </div>
    );
}
