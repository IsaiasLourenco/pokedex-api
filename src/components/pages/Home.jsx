import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import PokemonCard from "../../components/PokemonCard";
import styled from "styled-components";
import { ThemeContext } from "../context/ThemeContext";

const Home = () => {
  const [pokemons, setPokemons] = useState([]);
  const [offset, setOffset] = useState(0);
  const { toggleTheme, theme } = useContext(ThemeContext);

  // Carregar os 10 primeiros Pokémons ao iniciar
  useEffect(() => {
    fetchPokemons(0); // Passando 0 para trazer os 10 primeiros
  }, []);

  const fetchPokemons = async (newOffset) => {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${newOffset}`
      );
      const newPokemons = response.data.results;

      if (newOffset === 0) {
        setPokemons(newPokemons); // Inicializa com os 10 primeiros
      } else {
        setPokemons((prev) => [...prev, ...newPokemons]); // Adiciona mais 10
      }

      setOffset(newOffset + 10);
    } catch (error) {
      console.error("Erro ao carregar os Pokémons:", error);
    }
  };

  const resetToTen = () => {
    fetchPokemons(0); // Recarrega apenas os 10 primeiros
    setOffset(10); // Reseta o offset para 10
  };

  return (
    <Container>
      <h1>List of Pokémon</h1>
      <button onClick={toggleTheme}>
        {theme === "light" ? "Dark Mode" : "Light Mode"}
      </button>
      <PokemonGrid>
        {pokemons.length > 0 ? (
          pokemons.map((pokemon, index) => (
            <PokemonCard key={index} name={pokemon.name} url={pokemon.url} />
          ))
        ) : (
          <p>Loading Pokémon...</p> // Mensagem enquanto não carrega
        )}
      </PokemonGrid>
      <button onClick={() => fetchPokemons(offset)}>Load More</button>
      {pokemons.length > 10 && (
        <button onClick={resetToTen}>Back to ten</button>
      )}
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
`;

const PokemonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* Exibindo 5 colunas */
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 1200px; /* Limita a largura da grid */
  justify-items: center; /* Centraliza os cards na grid */
`;
