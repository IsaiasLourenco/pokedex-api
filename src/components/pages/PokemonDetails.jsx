import { useParams, useNavigate } from "react-router-dom"; // Importando useNavigate para navegação
import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { AbilityItem } from "../styles/GlobalStyles"; // Importando estilos globais
import GlobalStyles from "../styles/GlobalStyles";
import Description from "../Description";

const PokemonDetails = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const navigate = useNavigate(); // Hook de navegação

  useEffect(() => {
    axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => {
      setPokemon(res.data);
    });
  }, [id]);

  if (!pokemon) return <h2>Carregando...</h2>;

  // Função para voltar à página inicial
  const handleBackClick = () => {
    navigate("/"); // Roteamento para a página inicial
  };

  return (
    <>
      <GlobalStyles /> {/* Aplica os estilos globais */}
      <Container>
        <img src={pokemon.sprites.front_default} alt={pokemon.name} />
        <h1>{pokemon.name}</h1>
        <h2>Movements</h2>
        <ul>
          {pokemon.moves.slice(0, 5).map((move, index) => (
            <li key={index}>{move.move.name}</li>
          ))}
        </ul>
        <h2>Skills</h2>
        <ul>
          {pokemon.abilities.map((ability, index) => (
            <AbilityItem key={index}>
              <strong>{ability.ability.name}</strong>{" "}
              {ability.ability.url && (
                <Description abilityUrl={ability.ability.url} />
              )}
            </AbilityItem>
          ))}
        </ul>
        <h2>Type</h2>
        <ul>
          {pokemon.types.map((type, index) => (
            <li key={index}>{type.type.name}</li>
          ))}
        </ul>
        <button className="back-button" onClick={handleBackClick}>← Back</button>
      </Container>
    </>
  );
};

export default PokemonDetails;

const Container = styled.div`
  text-align: center;
  padding: 20px;
`;
