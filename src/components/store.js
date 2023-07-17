import create from 'zustand';
import axios from "axios";

const useStore = create((set) => ({
    recipes: [],
    selectedRecipes: [],
    visibleRecipes: [],
    fetchRecipes: async (page = 1) => {
        try {
            const response = await axios.get(`https://api.punkapi.com/v2/beers?page=${page}`);
            const data = response.data;
            set((state) => {
                return {
                    recipes: [...data],
                    currentPage: page,
                }
            });
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    },
    toggleRecipeSelection: (recipe) => {
        set((state) => {
            const selectedRecipes = state.selectedRecipes.slice();
            const index = selectedRecipes.findIndex((selectedRecipe) => selectedRecipe.id === recipe.id);

            if (index !== -1) {
                // Recipe already selected, remove it
                selectedRecipes.splice(index, 1);
            } else {
                // Recipe not selected, add it
                selectedRecipes.push(recipe);
            }

            return { selectedRecipes };
        });
    },
    removeSelectedRecipes: (recipeIds, visibleRecipes) => {
        set((state) => {
            const updatedRecipes = state.recipes.filter((recipe) => !recipeIds.includes(recipe.id));
            const updatedSelectedRecipes = state.selectedRecipes.filter((recipe) => !recipeIds.includes(recipe.id));
            const updatedVisibleRecipes = visibleRecipes.filter((recipe) => !recipeIds.includes(recipe.id));

            return {
                ...state,
                recipes: updatedRecipes,
                selectedRecipes: updatedSelectedRecipes,
                visibleRecipes: updatedVisibleRecipes,
            };
        });
    },

}));

export { useStore };
