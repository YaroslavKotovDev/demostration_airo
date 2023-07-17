import React from 'react';
import { useParams } from 'react-router-dom';

const RecipeDetail = () => {
    const { id } = useParams();

    return (
        <div>
            <h2>Recipe Details</h2>
            <p>Recipe ID: {id}</p>
            {/* Display the recipe details */}
        </div>
    );
};

export default RecipeDetail;
