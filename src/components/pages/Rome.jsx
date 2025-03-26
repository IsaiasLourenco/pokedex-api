import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import PokemonCard from "../../components/PokemonCard";
import styled from "styled-components";
import { ThemeContext } from "../context/ThemeContext";
import { useAppContext } from "../context/AppContext";
import ThemeToggler from "../ThemeToggler";
import { useLocation } from "react-router-dom";
import Select from "react-select";

const Home = () => {
  const { theme } = useContext(ThemeContext); // para controlar o tema
  const [pokemons, setPokemons] = useState([]); //armazana a lista de pokemons
  const [offset, setOffset] = useState(0);
  const [pokemonTypes, setPokemonTypes] = useState([]); //armazenará a lista de pokemons por tipo
  const [selectedType, setSelectedType] = useState(""); // armazena o tipo de pokemon escolhido
  const [showBackToTen, setShowBackToTen] = useState(false); //Botão volta para 10 - inicia invisível
  const [showLoadMore, setShowLoadMore] = useState(true); //Botão volta para 10 - inicia invisível
  const { isFirstLoad, setIsFirstLoad } = useAppContext(); // Usando o contexto global
  const [Qtde, setQtde] = useState(10);
  const [savedPokemons, setSavedPokemons] = useState([]);

  useEffect(() => {
    console.log("Iniciando o carregamento...");
    fetchPokemonTypes();
  
    if (isFirstLoad) {
      console.log("Executando o primeiro carregamento...");
      localStorage.removeItem("selectedType");
      localStorage.removeItem("offset");
      localStorage.removeItem("returningFromDetails");
      console.log("Primeiro carregamento", pokemons)
      setSelectedType(""); // "All Types"
      setOffset(0);
      fetchPokemons(0).then((initialPokemons) => {
        setSavedPokemons(initialPokemons);
        setPokemons(initialPokemons);
        localStorage.setItem("pokemons", JSON.stringify(initialPokemons));
        console.log("Pokémons carregados no primeiro carregamento:", initialPokemons);
        setIsFirstLoad(false);
      });
    } else {
      console.log("Voltando de detalhes...");
      const savedType = localStorage.getItem("selectedType");
      const savedPokemons = JSON.parse(localStorage.getItem("pokemons")) || [];
  
      if (savedPokemons.length > 0) {
        console.log("Pokémons recuperados do localStorage:", savedPokemons);
        setSavedPokemons(savedPokemons);
        setPokemons(savedPokemons);
        setShowBackToTen(true); 
      } else {
        console.warn("Erro ao recuperar Pokémons. LocalStorage vazio ou inconsistente.");
      }
      setSelectedType(savedType || "");
    }
  }, []); 

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

  const fetchPokemons = async (currentLength) => {
    try {
      // Verifica se é o primeiro carregamento
      if (isFirstLoad) {

        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon?limit=10&offset=0` // Primeiro carregamento usa offset 0
        );
        const newPokemons = response.data.results || []; // Garante que nunca será vazio

        setPokemons(newPokemons);
        setSavedPokemons(newPokemons);
        localStorage.setItem("pokemons", JSON.stringify(newPokemons));
        console.log("Primeiro carregamento json:", newPokemons);
        return newPokemons; // Retorna os Pokémons carregados
      } else {
        console.log("Carregando mais Pokémons...");

        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${currentLength}`
        );
        const newPokemons = response.data.results || []; // Garante que nunca será vazio

        console.log("Novos Pokémons carregados:", newPokemons);
        return newPokemons; // Retorna os Pokémons carregados
      }
    } catch (error) {
      console.error("Erro ao carregar os Pokémons:", error);
      return []; // Retorna um array vazio em caso de erro
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

  const handleTypeChange = (selectedOption) => {
    const type = selectedOption ? selectedOption.value : "";
    setSelectedType(type);
    setOffset(0);
    setShowBackToTen(false);
    setPokemons([]);
    
    if (type) {
      // Se houver tipo selecionado, chamamos o fetch por tipo
      fetchPokemonsByType(type, 0).then((newPokemons) => {
        setPokemons(newPokemons);
        // Atualize também o savedPokemons, se for necessário para outras funções
        setSavedPokemons(newPokemons);
        
        // Cria um objeto com todas as informações a serem salvas
        const appState = { selectedType: type, pokemons: newPokemons, offset: 0 };
        localStorage.setItem("appState", JSON.stringify(appState));
      });
    } else {
      // Se não houver tipo, chamamos o fetch normal
      fetchPokemons(0).then((newPokemons) => {
        setPokemons(newPokemons);
        setSavedPokemons(newPokemons);
        
        const appState = { selectedType: "", pokemons: newPokemons, offset: 0 };
        localStorage.setItem("appState", JSON.stringify(appState));
      });
    }
  };

  const loadMorePokemons = () => {
    if (selectedType === "") {
      // Tamanho atual dos Pokémons carregados
      let currentLength = savedPokemons.length;
      // Busca mais 10 Pokémons do JSON e atualiza
      fetchPokemons(currentLength).then((newPokemons) => {
        const updatedPokemons = [...savedPokemons, ...newPokemons]; // Adiciona os novos
        setSavedPokemons(updatedPokemons); // Atualiza o estado global (JSON completo)
        localStorage.setItem("pokemons", JSON.stringify(updatedPokemons)); // Salva no localStorage
        setPokemons(updatedPokemons); // Atualiza os renderizados
        console.log("Pokémons carregados após Load More:", updatedPokemons); // Debug
        setShowBackToTen(true); 
      });
    } else {
      console.log("Em construção hehe")
    }

  };

  const backToTen = () => {
    if (selectedType === "") {
      // Sem filtro: busca os primeiros 10
      fetchPokemons(0).then((initialPokemons) => {
        setSavedPokemons(initialPokemons);
        setPokemons(initialPokemons);
        localStorage.setItem("pokemons", JSON.stringify(initialPokemons));
        console.log("Back to Ten (sem tipo):", initialPokemons);
      });
    } else {
      // Com filtro: busca os primeiros 10 para o tipo selecionado
      fetchPokemonsByType(selectedType, 0);
    }
    setShowBackToTen(false);
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
      <button onClick={() => { loadMorePokemons(); }}>Load More</button>
      {showBackToTen && <button onClick={backToTen}>Back to Ten</button>}

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