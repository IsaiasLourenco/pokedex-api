import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import PokemonCard from "../../components/PokemonCard";
import styled from "styled-components";
import { ThemeContext } from "../context/ThemeContext";
import ThemeToggler from "../ThemeToggler";
import { useLocation } from "react-router-dom";
import Select from "react-select"; // IMPORTAÇÃO DO REACT-SELECT

const Home = () => {
  const [pokemons, setPokemons] = useState([]);
  const [offset, setOffset] = useState(0);
  const [pokemonTypes, setPokemonTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [showBackToTen, setShowBackToTen] = useState(false);
  const { theme } = useContext(ThemeContext);
  const location = useLocation();

  useEffect(() => {
    fetchPokemonTypes();
  }, []);

  useEffect(() => {
    const savedType = location.state?.selectedType || localStorage.getItem("selectedType") || "";
    const savedOffset = (location.state?.offset ?? parseInt(localStorage.getItem("offset"), 10)) || 0;


    localStorage.removeItem("selectedType");
    localStorage.removeItem("offset");

    setSelectedType(savedType);
    setOffset(savedOffset);

    if (savedType) {
      fetchPokemonsByType(savedType, savedOffset);
    } else {
      fetchPokemons(savedOffset);
    }
  }, []);

  const fetchPokemonTypes = async () => {
    try {
      const response = await axios.get("https://pokeapi.co/api/v2/type");
      const types = response.data.results.map((type) => ({
        value: type.name,
        label: (
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={`/${type.name.charAt(0).toUpperCase() + type.name.slice(1)}_Type.png`}
              alt={type.name}
              style={{ width: "20px", marginRight: "8px" }}
            />
            {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
          </div>
        ),
      }));
      setPokemonTypes(types);
    } catch (error) {
      console.error("Erro ao carregar os tipos de Pokémon:", error);
    }
  };

  const fetchPokemons = async (newOffset) => {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${newOffset}`
      );
      setPokemons((prev) => (newOffset === 0 ? response.data.results : [...prev, ...response.data.results]));
      setOffset(newOffset + 10);
      if (newOffset > 0) setShowBackToTen(true);
    } catch (error) {
      console.error("Erro ao carregar os Pokémons:", error);
    }
  };

  const fetchPokemonsByType = async (type, newOffset = 0) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
      const pokemonsOfType = response.data.pokemon
        .slice(newOffset, newOffset + 10)
        .map((p) => p.pokemon);
      setPokemons((prev) => (newOffset === 0 ? pokemonsOfType : [...prev, ...pokemonsOfType]));
      setOffset(newOffset + 10);
      if (newOffset > 0) setShowBackToTen(true);
    } catch (error) {
      console.error("Erro ao carregar Pokémons por tipo:", error);
    }
  };

  const handleTypeChange = (selectedOption) => {
    const type = selectedOption ? selectedOption.value : "";
    setSelectedType(type);
    setOffset(0);
    setShowBackToTen(false);
    if (type) {
      fetchPokemonsByType(type, 0);
    } else {
      fetchPokemons(0);
    }
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: theme === "dark" ? "#333" : "#fff",
      color: theme === "dark" ? "#fff" : "#333",
      borderColor: theme === "dark" ? "#555" : "#ccc",
      boxShadow: "none",
      "&:hover": {
        borderColor: theme === "dark" ? "#777" : "#888",
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: theme === "dark" ? "#fff" : "#333",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: theme === "dark" ? "#444" : "#fff",
    }),
    option: (base, { isFocused }) => ({
      ...base,
      backgroundColor: isFocused ? (theme === "dark" ? "#555" : "#eee") : "transparent",
      color: theme === "dark" ? "#fff" : "#333",
    }),
  };

  return (
    <Container>
      <h1>List of Pokémons</h1>
      <Header>
        <ThemeToggler />
        <Select
          options={pokemonTypes}
          onChange={handleTypeChange}
          value={pokemonTypes.find((option) => option.value === selectedType) || null}
          placeholder="Select a type"
          isClearable
          styles={customStyles}
        />
      </Header>
      <PokemonGrid>
        {pokemons.length > 0 ? (
          pokemons.map((pokemon, index) => (
            <PokemonCard key={index} name={pokemon.name} url={pokemon.url} />
          ))
        ) : (
          <p>Loading Pokémon...</p>
        )}
      </PokemonGrid>
      <button onClick={() => fetchPokemons(offset)}>Load More</button>
      {showBackToTen && <button onClick={() => fetchPokemons(0)}>Back to Ten</button>}
    </Container>
  );
};

export default Home;

const Container = styled.div`
  text-align: center;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  h1{
    @media (max-width: 480px){
    font-size: 28px;
  }
  }
`;

const PokemonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 1200px;
  justify-items: center;

  @media (max-width: 480px) {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 20px;
`;
