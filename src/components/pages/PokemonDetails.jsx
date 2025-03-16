import { useParams, useNavigate } from "react-router-dom"; 
import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { AbilityItem } from "../styles/GlobalStyles"; 
import GlobalStyles from "../styles/GlobalStyles";
import Description from "../Description";

const PokemonDetails = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    // Fetch detalhes do Pokémon pelo ID
    axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => {
      setPokemon(res.data);
    });
  }, [id]);

  if (!pokemon) return <h2>Carregando...</h2>;

  // Função para voltar à página inicial
  const handleBackClick = () => {
    const selectedType = localStorage.getItem("selectedType");
    const offset = localStorage.getItem("offset") || 0;

    // Passa o estado atual para a página inicial ao navegar de volta
    navigate("/", {
      state: {
        selectedType,
        offset: parseInt(offset, 10),
      },
    });
  };

  return (
    <>
      <GlobalStyles /> 
      <Container>
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${pokemon.id}.gif`}
          alt={pokemon.name}
        />
        <h1>{pokemon.name}</h1>

        <DetailsContainer>
          {/* Movimentos do Pokémon */}
          <div>
            <h2>Movements</h2>
            <ul className="centered-list">
              {pokemon.moves.slice(0, 5).map((move, index) => (
                <li key={index}>{move.move.name}</li>
              ))}
            </ul>
          </div>

          {/* Habilidades do Pokémon */}
          <div>
            <h2>Skills</h2>
            <ul>
              {pokemon.abilities.map((ability, index) => (
                <AbilityItem key={index}>
                  <strong>{ability.ability.name}</strong>{" "}
                  {ability.ability.url && <Description abilityUrl={ability.ability.url} />}
                </AbilityItem>
              ))}
            </ul>
          </div>

          {/* Tipos do Pokémon */}
          <div>
            <h2>Type</h2>
            <ul className="centered-list">
              {pokemon.types.map((type, index) => (
                <li key={index}>{type.type.name}</li>
              ))}
            </ul>
          </div>
        </DetailsContainer>

        {/* Botão de voltar */}
        <button className="back-button" onClick={handleBackClick}>← Back</button>
      </Container>
    </>
  );
};

export default PokemonDetails;

// Estilos
const Container = styled.div`
  text-align: center;
  padding: 20px;

  h1 {
    font-size: 30px;
  }

  h2 {
    font-size: 20px;
  }

  li {
    font-size: 12px;
  }

  img {
    cursor: default; 
    outline: none; 
  }
`;

const DetailsContainer = styled.div`
  display: flex;
  justify-content: space-around; 
  gap: 20px; 
  margin-top: 20px;

  div {
    width: 30%; 
    text-align: left;
  }

  h2 {
    margin-bottom: 10px;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  .centered-list {
    text-align: center;
  }
`;
