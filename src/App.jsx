import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeContextProvider } from "./components/context/ThemeContext";
import { AppProvider } from "./components/context/AppContext";
import Home from "./components/pages/Home";
import PokemonDetails from "./components/pages/PokemonDetails";

function App() {
    return (
        <AppProvider>
            <ThemeContextProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/pokemon/:id" element={<PokemonDetails />} />
                    </Routes>
                </BrowserRouter>
            </ThemeContextProvider>
        </AppProvider>
    );
}

export default App;
