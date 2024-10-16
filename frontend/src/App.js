import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Navbar from "./components/Navbar";
import FooterSection from "./components/Footer";

import Home from "./pages/home";
import Cuisines from "./pages/cuisines";
import Recipes from "./pages/recipes";
import RecipeDetail from "./pages/RecipeDetail";
import RecipeGenerator from "./pages/recipegenerator"; // Import the new RecipeGenerator component

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cuisines" element={<Cuisines />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipe-generator" element={<RecipeGenerator />} /> {/* New route */}
          <Route path="/recipes/:id" element={<RecipeDetail />} />
        </Routes>
      </div>
      <FooterSection />
    </Router>
  );
}

export default App;
