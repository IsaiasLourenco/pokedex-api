// Importações
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import PokemonCard from "../../components/PokemonCard";
import styled from "styled-components";
import { ThemeContext } from "../context/ThemeContext";
import { useAppContext } from "../context/AppContext";
import ThemeToggler from "../ThemeToggler";
import Select from "react-select";

export const Rome = () => {
    const { theme } = useContext(ThemeContext); 
    const [pokemons, setPokemons] = useState([]);
    const [offset, setOffset] = useState(0);
    const [selectedType, setSelectedType] = useState("");
    const [pokemonTypes, setPokemonTypes] = useState([]);
    const [showBackToTen, setShowBackToTen] = useState(false);

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

    const fetchPokemons = async (newOffset = 0, isLoadMore = false) => {
        try {
            const response = await axios.get(
                `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${newOffset}`
            );

            const pokemonData = await Promise.all(
                response.data.results.map(async (pokemon) => {
                    const details = await axios.get(pokemon.url);
                    return {
                        name: details.data.name,
                        image: details.data.sprites.front_default,
                        id: details.data.id,
                    };
                })
            );

            if (isLoadMore) {
                setPokemons((prev) => [...prev, ...pokemonData]);
            } else {
                setPokemons(pokemonData);
            }
        } catch (error) {
            console.error("Erro ao buscar Pokémon", error);
        }
    };

    const fetchPokemonsByType = async (type, newOffset = 0, isLoadMore = false) => {
        try {
            const response = await axios.get(
                `https://pokeapi.co/api/v2/type/${type}`
            );
            const allPokemonOfType = response.data.pokemon.map((p) => p.pokemon);

            if (allPokemonOfType.length === 0) {
                setPokemons([]);
                return;
            }

            const selectedPokemons = allPokemonOfType.slice(
                newOffset,
                newOffset + 10
            );

            const pokemonData = await Promise.all(
                selectedPokemons.map(async (pokemon) => {
                    const details = await axios.get(pokemon.url);
                    return {
                        name: details.data.name,
                        image: details.data.sprites.front_default,
                        id: details.data.id,
                    };
                })
            );

            if (isLoadMore) {
                setPokemons((prev) => [...prev, ...pokemonData]);
            } else {
                setPokemons(pokemonData);
            }
        } catch (error) {
            console.error("Erro ao buscar Pokémon por tipo", error);
        }
    };

    useEffect(() => {
        fetchPokemonTypes();
    }, []);

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

    // useEffect(() => {
    //   fetchPokemons(0);
    // }, []);

    useEffect(() => {
        if (selectedType === "") {
            fetchPokemons(0);
        } else {
            fetchPokemonsByType(selectedType, 0);
        }
        setOffset(0);
    }, [selectedType]);

    const loadMorePokemons = () => {
        const newOffset = offset + 10;
        setOffset(newOffset);
        if (selectedType === "") {
            fetchPokemons(newOffset, true);
        } else {
            fetchPokemonsByType(selectedType, newOffset, true);
        }
    };


    return (
        <Container>
            <h1>List of Pokémons</h1>
            <Header>
                <ThemeToggler />
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Select
                    options={pokemonTypes}
                    onChange={(option) => setSelectedType(option?.value || "")}
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
            <button onClick={() => setOffset((prevOffset) => prevOffset + 10)}>Load More</button>
            {showBackToTen && (
                <button
                    onClick={() => {
                        setOffset(0);
                        setPokemons([]);
                    }}
                >
                    Back to Ten
                </button>
            )}
        </Container>
    );
};

// Components estilizados antes do export
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

// Exportação final
export default Rome;
