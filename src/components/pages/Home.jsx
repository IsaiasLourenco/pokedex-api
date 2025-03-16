import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import PokemonCard from "../../components/PokemonCard";
import styled from "styled-components";
import { ThemeContext } from "../context/ThemeContext";
import ThemeToggler from "../ThemeToggler";
import { useLocation } from "react-router-dom";

const Home = () => {
  const [pokemons, setPokemons] = useState([]); // Estado inicial vazio
  const [offset, setOffset] = useState(0); // Offset inicial definido como 0
  const [pokemonTypes, setPokemonTypes] = useState([]); // Tipos de Pokémon
  const [typeIcons, setTypeIcons] = useState({}); // Ícones dos tipos
  const [selectedType, setSelectedType] = useState(""); // Tipo padrão = "All Types"
  const [showBackToTen, setShowBackToTen] = useState(false); // Controle para "Back to Ten"
  const { theme } = useContext(ThemeContext);
  const location = useLocation();

  // Fetch tipos de Pokémon ao montar o componente
  useEffect(() => {
    fetchPokemonTypes();
  }, []);

  useEffect(() => {
    // Sempre reseta o localStorage ao recarregar a página ou no primeiro carregamento
    localStorage.removeItem("selectedType");
    localStorage.removeItem("offset");
  
    // Estado inicial padrão para "All Types"
    setSelectedType(""); // Garante o estado inicial como "All Types"
    setOffset(0); // Reseta o offset inicial
    fetchPokemons(0); // Carrega os primeiros 10 Pokémon
  }, []);

  // Salva o estado no localStorage ao navegar
  useEffect(() => {
    console.log(localStorage)
    localStorage.setItem("selectedType", selectedType);
    localStorage.setItem("offset", offset.toString());
  }, [selectedType, offset]);

  // Função para buscar tipos de Pokémon e seus ícones
  const fetchPokemonTypes = async () => {
    try {
      const response = await axios.get("https://pokeapi.co/api/v2/type");
      const types = response.data.results;
      const icons = {};

      // Adicionando URLs de ícones para cada tipo manualmente ou dinamicamente
      types.forEach((type) => {
        icons[type.name] = `/icons/${type.name}.svg`; // Ajuste o caminho para seus ícones
      });

      setPokemonTypes(types);
      setTypeIcons(icons); // Salva os ícones no estado
    } catch (error) {
      console.error("Erro ao carregar os tipos de Pokémon:", error);
    }
  };

  // Função para buscar Pokémon sem filtro de tipo
  const fetchPokemons = async (newOffset) => {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${newOffset}`
      );
      setPokemons((prev) => (newOffset === 0 ? response.data.results : [...prev, ...response.data.results]));
      setOffset(newOffset + 10);

      // Exibe o botão "Back to Ten" se não estiver no início
      if (newOffset > 0) setShowBackToTen(true);
    } catch (error) {
      console.error("Erro ao carregar os Pokémons:", error);
    }
  };

  // Função para buscar Pokémon por tipo
  const fetchPokemonsByType = async (type, newOffset = 0) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
      const pokemonsOfType = response.data.pokemon
        .slice(newOffset, newOffset + 10)
        .map((p) => p.pokemon);
      setPokemons((prev) => (newOffset === 0 ? pokemonsOfType : [...prev, ...pokemonsOfType]));
      setOffset(newOffset + 10);

      // Exibe o botão "Back to Ten" se não estiver no início
      if (newOffset > 0) setShowBackToTen(true);
    } catch (error) {
      console.error("Erro ao carregar Pokémons por tipo:", error);
    }
  };

  // Alterar o tipo selecionado
  const handleTypeChange = (event) => {
    const type = event.target.value;
    setSelectedType(type);
    setOffset(0);
    setShowBackToTen(false); // Oculta o botão ao trocar o tipo

    if (type) {
      fetchPokemonsByType(type, 0);
    } else {
      fetchPokemons(0);
    }
  };

  // Carregar mais Pokémon
  const loadMorePokemons = () => {
    if (selectedType) {
      fetchPokemonsByType(selectedType, offset);
    } else {
      fetchPokemons(offset);
    }
  };

  // Voltar para os primeiros 10 Pokémon
  const backToTen = () => {
    if (selectedType) {
      fetchPokemonsByType(selectedType, 0);
    } else {
      fetchPokemons(0);
    }
    setShowBackToTen(false); // Oculta o botão após voltar para os 10 primeiros
  };

  return (
    <Container>
      <h1>List of Pokémons</h1>
      <Header>
        <ThemeToggler />
        <Select theme={theme} onChange={handleTypeChange} value={selectedType}>
          <option value="">All Types</option>
          {pokemonTypes.map((type) => (
            <option key={type.name} value={type.name}>
              {typeIcons[type.name] && (
                <>
                  <img src={typeIcons[type.name]} alt={type.name} style={{ width: "20px", marginRight: "8px" }} />
                  {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                </>
              )}
            </option>
          ))}
        </Select>
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
      <button onClick={loadMorePokemons}>Load More</button>
      {showBackToTen && (
        <button onClick={backToTen}>Back to Ten</button>
      )}
    </Container>
  );
};

export default Home;

// Estilos
const Container = styled.div`
  text-align: center;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PokemonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 1200px;
  justify-items: center;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 20px;
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-left: 20px;
  background-color: ${({ theme }) => (theme === "dark" ? "#333" : "#fff")};
  color: ${({ theme }) => (theme === "dark" ? "#fff" : "#000")};
  border: ${({ theme }) =>
    theme === "dark" ? "1px solid #fff" : "1px solid #ccc"};
  outline: none;
  transition: background-color 0.3s, color 0.3s, border 0.3s;
`;
