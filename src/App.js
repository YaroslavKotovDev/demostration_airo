import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RecipeList from './components/list';
import RecipeDetail from './components/details';

const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<RecipeList />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
        </Routes>
      </Router>
  );
};

export default App;
