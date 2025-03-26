import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const PokemonCard = ({ name, url }) => {
  // Extrai o id da URL
  const id = url.split("/")[url.split("/").length - 2];
  // Formata o id para o padrão "#0000"
  const formattedId = "#" + id.toString().padStart(4, "0");
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;

  const missingSprites = []; // Lista para monitorar sprites ausentes

  const handleError = (e) => {
    const id = e.target.src.split("/")[e.target.src.split("/").length - 1].split(".")[0];
    if (e.target.src.endsWith(".gif")) {
      // Se o GIF falhar, tenta carregar o PNG
      e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    } else {
      // Se o PNG também falhar, mostra o placeholder
      e.target.src = "https://via.placeholder.com/100?text=No+Image";
    }
  };


  return (
    <Card>
      <Link to={`/pokemon/${id}`}>
        <IdDisplay>{formattedId}</IdDisplay>
        <img src={imageUrl} alt={name} onError={handleError} />
        <h3>{name}</h3>
      </Link>
    </Card>
  );
};

export default PokemonCard;

const Card = styled.div`
  position: relative;
  border: 1px solid gray;
  padding: 10px;
  text-align: center;
  width: 140px; /* Aumentado de 120px para 140px */
  height: 140px; /* Aumentado de 120px para 140px */
  border-radius: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  box-shadow: ${({ theme }) =>
    theme.background === "#333"
      ? "4px 4px 10px rgba(255, 255, 255, 0.2)"
      : "4px 4px 10px rgba(0, 0, 0, 0.6)"};

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) =>
    theme.background === "#333"
      ? "6px 6px 15px rgba(255, 255, 255, 0.4)"
      : "6px 6px 15px rgba(0, 0, 0, 0.3)"};
  }

  img {
    width: 60px; /* Ajustado de 50px para 60px */
    height: 60px; /* Ajustado de 50px para 60px */
    object-fit: contain;
    margin-top: 20px; /* Mantido para evitar sobreposição com o ID */
  }

  h3 {
    color: ${({ theme }) => (theme.background === "#fff" ? "blue" : "lightblue")};
    margin: 5px 0 0;
    font-size: 14px; /* Reduzido um pouco para ajudar com nomes longos */
    white-space: nowrap; /* Garante que o texto não quebre em várias linhas */
    overflow: hidden; /* Esconde o texto que ultrapassa o limite */
    text-overflow: ellipsis; /* Adiciona "..." ao final de nomes muito longos */
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