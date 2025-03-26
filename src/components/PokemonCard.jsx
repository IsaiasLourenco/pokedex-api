import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const PokemonCard = ({ name, url }) => {
  // Extrai o id da URL
  const id = url.split("/")[url.split("/").length - 2];
  // Formata o id para o padrão "#0000"
  const formattedId = "#" + id.toString().padStart(4, "0");
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;

  return (
    <Card>
      <Link to={`/pokemon/${id}`}>
        <IdDisplay>{formattedId}</IdDisplay>
        <img src={imageUrl} alt={name} />
        <h3>{name}</h3>
      </Link>
    </Card>
  );
};

export default PokemonCard;

const Card = styled.div`
  position: relative; /* Necessário para posicionar o IdDisplay com position absolute */
  border: 1px solid gray;
  padding: 10px;
  text-align: center;
  width: 120px;
  height: 120px;
  border-radius: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  /* Box-shadow condicional baseado no tema */
  box-shadow: ${({ theme }) =>
    theme.background === "#333"
      ? "4px 4px 10px rgba(255, 255, 255, 0.2)" // Sombra clara para tema escuro
      : "4px 4px 10px rgba(0, 0, 0, 0.6)"}; // Sombra padrão para tema claro

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) =>
      theme.background === "#333"
        ? "6px 6px 15px rgba(255, 255, 255, 0.4)"
        : "6px 6px 15px rgba(0, 0, 0, 0.3)"};
  }

  img {
    width: 50px;
    height: 50px;
    object-fit: contain;
    margin-top: 20px; /* Evita sobreposição com o ID */
  }

  h3 {
    color: ${({ theme }) => (theme.background === "#fff" ? "blue" : "lightblue")};
    margin: 5px 0 0;
  }
`;

const IdDisplay = styled.h6`
  position: absolute;
  top: 5px;
  left: 5px;
  font-style: italic;
  color: ${({ theme }) => (theme.background === "#fff" ? "blue" : "lightblue")};
  font-size: 15px;
  margin: 0;
`;