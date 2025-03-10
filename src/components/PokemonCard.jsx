import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const PokemonCard = ({ name, url }) => {
    const id = url.split("/")[url.split("/").length - 2];
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

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

  img {
    width: 100px;
  }
`;
