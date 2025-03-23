import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import PokemonCard from "../../components/PokemonCard";
import styled from "styled-components";
import { ThemeContext } from "../context/ThemeContext";
import ThemeToggler from "../ThemeToggler";
import { useLocation } from "react-router-dom";
import Select from "react-select";

const Home = () => {
  const { theme } = useContext(ThemeContext); // para controlar o tem
  const [pokemons, setPokemons] = useState([]); //armazana a lista de pokemons
  const [offset, setOffset] = useState(0); //posição de onde os Pokémons serão carregados na API
  const [pokemonTypes, setPokemonTypes] = useState([]); //armazenará a lista de pokemons por tipo
  const [selectedType, setSelectedType] = useState(""); // armazena o tipo de pokemon escolhido
  const [showBackToTen, setShowBackToTen] = useState(false); //Botão volta para 10 - inicia invisível
  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    fetchPokemonTypes();
  }, []);

  useEffect(() => {

    const savedType = localStorage.getItem("selectedType");
    const savedOffset = localStorage.getItem("offset");

    if (isFirstLoadRef.current) {
      console.log("Primeiro carregamento", isFirstLoadRef);
      // Resetar o localStorage e o offset
      localStorage.removeItem("selectedType");
      localStorage.removeItem("offset");
      setSelectedType(""); // "All Types"
      setOffset(0);
      fetchPokemons(0); // Carregar os primeiros 10 Pokémon
      
    } else {
      console.log("Não é o primeiro carregamento", isFirstLoadRef);
      // Caso contrário, use os valores salvos no localStorage
      setSelectedType(savedType || "");
      setOffset(parseInt(savedOffset, 10) || 0);

      if (savedType) {
        fetchPokemonsByType(savedType, parseInt(savedOffset, 10) || 0);
      } else {
        fetchPokemons(parseInt(savedOffset, 10) || 0);
      }
    }
  }, []); // Aqui o efeito só vai rodar uma vez, no primeiro carregamento do componente

  // Função para buscar Pokémon sem filtro de tipo
  const fetchPokemons = async (newOffset) => {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${newOffset}`
      );
      const newPokemons = response.data.results;
      setPokemons((prev) => (newOffset === 0 ? newPokemons : [...prev, ...newPokemons]));
      setOffset(newOffset + 10);
      setShowBackToTen(newOffset > 0); // Atualiza corretamente
    } catch (error) {
      console.error("Erro ao carregar os Pokémons:", error);
    }
  };

  // Função para buscar tipos de Pokémon e seus ícones  
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
      setShowBackToTen(newOffset > 0);
    } catch (error) {
      console.error("Erro ao carregar Pokémons por tipo:", error);
    }
  };

  const handleTypeChange = (selectedOption) => {
    console.log("Selected type: ", selectedType);
    console.log("Selected options: ", selectedOption);

    const type = selectedOption ? selectedOption.value : "";
    setSelectedType(type);
    setOffset(0);
    setShowBackToTen(false);
    setPokemons([]);

    if (type) {
      fetchPokemonsByType(type, 0);
    } else {
      fetchPokemons(0);
    }

    localStorage.setItem("selectedType", type); // Salvar o tipo selecionado
    localStorage.setItem("offset", 0); // Resetar offset ao trocar de tipo
  };

  useEffect(() => {
    if (selectedType === "") {
      fetchPokemons(0);
    } else {
      fetchPokemonsByType(selectedType, 0);
    }
    setOffset(0);
  }, [selectedType]);

  const loadMorePokemons = () => {
    const newOffset = offset + 10;
    setOffset(newOffset);
    if (selectedType === "") {
      fetchPokemons(newOffset, true);
    } else {
      fetchPokemonsByType(selectedType, newOffset, true);
    }
  };

  useEffect(() => {
    // Log da alteração de selectedType
    if (selectedType) {
      console.log("Selected type changed: ", selectedType);
    }
  }, [selectedType]); // Executa quando selectedType mudar

  // Voltar para os primeiros 10 Pokémon
  const backToTen = () => {
    if (selectedType) {
      fetchPokemonsByType(selectedType, 0);
    } else {
      fetchPokemons(0);
    }
    setShowBackToTen(false); // Oculta o botão após voltar para os 10 primeiros
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
        <ThemeToggler />&nbsp;&nbsp;&nbsp;&nbsp;
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
      {/* <button onClick={() => fetchPokemons(offset)}>Load More</button> */}
      <button onClick={() => {
        console.log("Botão Load More clicado!");
        loadMorePokemons();
      }}>
        Load More
      </button>

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
