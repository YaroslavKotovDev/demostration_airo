import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from './store';
import '../styles/style.css';

const RecipeList = () => {
    const navigate = useNavigate();
    const { recipes, selectedRecipes, fetchRecipes, removeSelectedRecipes } = useStore();
    const listRef = useRef(null);
    const [visibleRecipes, setVisibleRecipes] = useState([]);
    const visibleRecipesCount = 15;
    const loadMoreCount = 5;
    const isLoading = useRef(false);
    const uniqueRecipeIds = useRef(new Set());

    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);

    useEffect(() => {
        const uniqueRecipes = recipes.filter((recipe) => !uniqueRecipeIds.current.has(recipe.id));
        setVisibleRecipes((prevVisibleRecipes) => [...prevVisibleRecipes, ...uniqueRecipes]);
        uniqueRecipes.forEach((recipe) => uniqueRecipeIds.current.add(recipe.id));
    }, [recipes]);

    const handleRecipeClick = (recipe, event) => {
        event.preventDefault();

        if (event.button === 2) {
            // Right click: toggle recipe selection for deletion
            const isSelected = selectedRecipes.some((selectedRecipe) => selectedRecipe.id === recipe.id);

            if (isSelected) {
                // Recipe already selected, remove it
                useStore.setState((state) => ({
                    selectedRecipes: state.selectedRecipes.filter((selectedRecipe) => selectedRecipe.id !== recipe.id),
                }));
            } else {
                // Recipe not selected, add it
                useStore.setState((state) => ({
                    selectedRecipes: [...state.selectedRecipes, recipe],
                }));
            }
        } else {
            // Left click: navigate to recipe detail page
            navigate(`/recipes/${recipe.id}`);
        }
    };

    const handleDeleteSelected = () => {
        const recipeIds = selectedRecipes.map((recipe) => recipe.id);
        removeSelectedRecipes(recipeIds, visibleRecipes);
        setVisibleRecipes((prevVisibleRecipes) =>
            prevVisibleRecipes.filter((recipe) => !recipeIds.includes(recipe.id))
        );
    };

    const handleScroll = () => {
        if (isLoading.current) return;

        const { scrollTop, scrollHeight, clientHeight } = listRef.current;

        if (scrollTop + clientHeight >= scrollHeight) {
            // User has scrolled to the bottom
            loadMoreRecipes();
        }
    };

    const loadMoreRecipes = async () => {
        if (isLoading.current) return;

        isLoading.current = true;

        try {
            const nextPage = Math.ceil(visibleRecipes.length / visibleRecipesCount) + 1;
            await fetchRecipes(nextPage);
        } catch (error) {
            console.error('Error loading more recipes:', error);
        } finally {
            isLoading.current = false;
        }
    };

    useEffect(() => {
        if (isLoading.current) {
            const uniqueRecipes = recipes.filter((recipe) => !uniqueRecipeIds.current.has(recipe.id));
            uniqueRecipes.forEach((recipe) => uniqueRecipeIds.current.add(recipe.id));

            setVisibleRecipes((prevVisibleRecipes) => {
                const newVisibleRecipes = [...prevVisibleRecipes];
                uniqueRecipes.forEach((recipe) => {
                    if (!newVisibleRecipes.some((r) => r.id === recipe.id)) {
                        newVisibleRecipes.push(recipe);
                    }
                });

                if (newVisibleRecipes.length > visibleRecipesCount) {
                    newVisibleRecipes.splice(0, loadMoreCount);
                }
                return newVisibleRecipes;
            });
        }
    }, [recipes]);

    return (
        <>
            <div className="recipe-list-container" onScroll={handleScroll} ref={listRef}>
                <div className="recipe-grid">
                    {visibleRecipes.slice(0, visibleRecipesCount).map((recipe) => (
                        <Link to={`/recipes/${recipe.id}`} key={recipe.id} className="recipe-item-link">
                            <div
                                className={`recipe-item ${selectedRecipes.some((r) => r.id === recipe.id) ? 'selected' : ''}`}
                                onMouseDown={(event) => handleRecipeClick(recipe, event)}
                            >
                                <div className="recipe-item-content">
                                    <h3>{recipe.name}</h3>
                                    <p>{recipe.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            {selectedRecipes.length > 0 && (
                <div className="delete-selected-container">
                    <button className="delete-selected-button" onClick={handleDeleteSelected}>
                        Delete
                    </button>
                    <p className="deleting-message"></p>
                </div>
            )}
        </>
    );
};

export default RecipeList;
