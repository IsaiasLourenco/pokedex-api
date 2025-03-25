import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const PokemonCard = ({ name, url }) => {
    const id = url.split("/")[url.split("/").length - 2];
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;

    return (
        <Card>
            <Link to={`/pokemon/${id}`}>
                <img src={imageUrl} alt={name} />
                <h3>{name}</h3>
            </Link>
        </Card>
    );
};

export default PokemonCard;

const Card = styled.div`
  border: 1px solid gray;
  padding: 10px;
  text-align: center;
  width: 120px;
  height: 120px;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.6);
  border-radius: 20px; 
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 6px 6px 15px rgba(0, 0, 0, 0.3);
  }

  img {
    width: 50px;
    height: 50px;
    object-fit: contain;
  }
`;


