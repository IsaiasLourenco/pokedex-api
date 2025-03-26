import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import PokemonCard from "../../components/PokemonCard";
import styled from "styled-components";
import { ThemeContext } from "../context/ThemeContext";
import { useAppContext } from "../context/AppContext";
import ThemeToggler from "../ThemeToggler";
import Select from "react-select";

const Home = () => {
  const { theme } = useContext(ThemeContext);
  const [pokemons, setPokemons] = useState([]);          // Lista que será renderizada
  const [offset, setOffset] = useState(0);
  const [pokemonTypes, setPokemonTypes] = useState([]);    // Lista de tipos
  const [selectedType, setSelectedType] = useState("");    // Tipo selecionado
  const [showBackToTen, setShowBackToTen] = useState(false); // Controle do botão "Back to Ten"
  const { isFirstLoad, setIsFirstLoad } = useAppContext();  // Flag global para primeiro carregamento
  const [Qtde, setQtde] = useState(10);
  const [savedPokemons, setSavedPokemons] = useState([]);   // Lista completa armazenada
  const [hasMore, setHasMore] = useState(true); // Começa com "true"


  // Atualiza o objeto de estado no localStorage usando a chave "appState"
  const updateAppState = (type, pokemonsList, currentOffset) => {
    const appState = {
      selectedType: type,
      pokemons: pokemonsList,
      offset: currentOffset,
    };
    localStorage.setItem("appState", JSON.stringify(appState));
  };

  // Recupera o appState do localStorage, se existente
  const restoreAppState = () => {
    const storedState = localStorage.getItem("appState");
    if (storedState) {
      const { selectedType, pokemons, offset } = JSON.parse(storedState);
      setSelectedType(selectedType || "");
      setSavedPokemons(pokemons || []);
      setPokemons(pokemons || []);
      setOffset(offset || 0);
      if (pokemons && pokemons.length > 10) {
        setShowBackToTen(true);
      }
    }
  };

  useEffect(() => {
    console.log("Iniciando o carregamento...");
    fetchPokemonTypes();

    const storedState = localStorage.getItem("appState");
    if (isFirstLoad || !storedState) {
      console.log("Executando o primeiro carregamento...");
      // Limpa dados antigos (opcional: se quiser zerar todos os dados relacionados)
      localStorage.removeItem("appState");
      setSelectedType("");
      setOffset(0);
      fetchPokemons(0).then((initialPokemons) => {
        setSavedPokemons(initialPokemons);
        setPokemons(initialPokemons);
        updateAppState("", initialPokemons, 0);
        console.log("Pokémons carregados no primeiro carregamento:", initialPokemons);
        setIsFirstLoad(false);
      });
    } else {
      console.log("Voltando de detalhes...");
      restoreAppState();
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

  const fetchPokemons = async (currentLength) => {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${currentLength}`
      );
      const newPokemons = response.data.results || [];
      console.log(currentLength === 0 ? "Primeiro carregamento json:" : "Novos Pokémons carregados:", newPokemons);
      return newPokemons;
    } catch (error) {
      console.error("Erro ao carregar os Pokémons:", error);
      return [];
    }
  };

  const fetchPokemonsByType = async (type, newOffset = 0) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
      const pokemonsOfType = response.data.pokemon
        .slice(newOffset, newOffset + 10)
        .map((p) => p.pokemon);
      console.log(newOffset === 0 ? "Primeiro carregamento por tipo:" : "Novos Pokémons por tipo carregados:", pokemonsOfType);
      return pokemonsOfType;
    } catch (error) {
      console.error("Erro ao carregar Pokémons por tipo:", error);
      return [];
    }
  };

  const handleTypeChange = (selectedOption) => {
    const type = selectedOption ? selectedOption.value : "";
    setSelectedType(type);
    setOffset(0);
    setShowBackToTen(false);
    setPokemons([]);

    if (type) {
      fetchPokemonsByType(type, 0).then((newPokemons) => {
        setPokemons(newPokemons);
        setSavedPokemons(newPokemons);
        updateAppState(type, newPokemons, 0);
      });
    } else {
      fetchPokemons(0).then((initialPokemons) => {
        setPokemons(initialPokemons);
        setSavedPokemons(initialPokemons);
        updateAppState("", initialPokemons, 0);
      });
    }
  };

  const loadMorePokemons = () => {
    if (selectedType === "") {
      const currentLength = savedPokemons.length;
      fetchPokemons(currentLength).then((newPokemons) => {
        const updatedPokemons = [...savedPokemons, ...newPokemons];
        setSavedPokemons(updatedPokemons);
        setPokemons(updatedPokemons);
        setOffset(updatedPokemons.length);
        updateAppState("", updatedPokemons, updatedPokemons.length);
        console.log("Pokémons carregados após Load More:", updatedPokemons);
        setShowBackToTen(true);
        // Verifica se chegamos ao fim da lista de Pokémon
        if (newPokemons.length === 0) {
          setHasMore(false); // Não há mais Pokémon disponíveis
        }
      });
    } else {
      const currentLength = savedPokemons.length;
      fetchPokemonsByType(selectedType, currentLength).then((newPokemons) => {
        const updatedPokemons = [...savedPokemons, ...newPokemons];
        setSavedPokemons(updatedPokemons);
        setPokemons(updatedPokemons);
        setOffset(updatedPokemons.length);
        updateAppState(selectedType, updatedPokemons, updatedPokemons.length);
        console.log("Pokémons carregados após Load More (tipo selecionado):", updatedPokemons);
        setShowBackToTen(true);
        // Verifica se chegamos ao fim da lista de Pokémon
        if (newPokemons.length === 0) {
          setHasMore(false); // Não há mais Pokémon para o tipo selecionado
        }
      });
    }
  };

  const backToTen = () => {
    if (selectedType === "") {
      fetchPokemons(0).then((initialPokemons) => {
        setSavedPokemons(initialPokemons);
        setPokemons(initialPokemons);
        setOffset(initialPokemons.length);
        updateAppState("", initialPokemons, initialPokemons.length);
        console.log("Back to Ten (sem tipo):", initialPokemons);
      });
    } else {
      fetchPokemonsByType(selectedType, 0).then((newPokemons) => {
        setSavedPokemons(newPokemons);
        setPokemons(newPokemons);
        setOffset(newPokemons.length);
        updateAppState(selectedType, newPokemons, newPokemons.length);
        console.log("Back to Ten (com tipo):", newPokemons);
      });
    }
    setShowBackToTen(false);
    setHasMore(true);
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
      {hasMore ? (
        <button onClick={loadMorePokemons}>Load More</button>
      ) : (
        <button disabled style={{ opacity: 0.5 }}>There is no more Pokémons</button>
      )}
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

  h1 {
    @media (max-width: 480px) {
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