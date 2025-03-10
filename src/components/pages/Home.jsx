import { useState, useEffect, useContext } from "react";
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
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${newOffset}`
    );
    const newPokemons = response.data.results;

    // Se for a primeira busca (offset 0), configura a lista inicial
    if (newOffset === 0) {
      setPokemons(newPokemons); // Inicializa com os 10 primeiros Pokémons
    } else {
      // Se não for a primeira busca, apenas adiciona os novos Pokémons
      setPokemons((prev) => [...prev, ...newPokemons]);
    }

    // Atualiza o offset para os próximos 10
    setOffset(newOffset + 10);
  };

  return (
    <Container>
      <h1>List of Pokémon</h1>
      <button onClick={toggleTheme}>
        {theme === "light" ? "Dark Mode" : "Light Mode"}
      </button>
      <PokemonGrid>
        {pokemons.map((pokemon, index) => (
          <PokemonCard key={index} name={pokemon.name} url={pokemon.url} />
        ))}
      </PokemonGrid>
      <button onClick={() => fetchPokemons(offset)}>Load More</button>
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
