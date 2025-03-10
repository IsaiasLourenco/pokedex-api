console.log("Jest está rodando com:", typeof document !== "undefined" ? "jsdom" : "node");
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Home from "./Home";
import ThemeContextProvider from "../context/ThemeContext";

jest.mock("axios");

test("carrega mais 10 Pokémons ao clicar em Load More", async () => {
  const mockData = {
    data: {
      results: Array.from({ length: 10 }, (_, i) => ({
        name: `pokemon-${i + 1}`,
        url: `https://pokeapi.co/api/v2/pokemon/${i + 1}`
      }))
    }
  };
  
  axios.get.mockResolvedValueOnce(mockData);
  
  render(
    <ThemeContextProvider>
      <Home />
    </ThemeContextProvider>
  );
  
  const loadMoreButton = screen.getByText(/Load More/i);
  fireEvent.click(loadMoreButton);
  
  const pokemonCards = await screen.findAllByRole("heading");
  expect(pokemonCards).toHaveLength(20); // 10 iniciais + 10 novos
});

test("carrega mais 10 Pokémons ao clicar em Load More e reseta para 10 ao clicar em Back to ten", async () => {
  const mockData = {
    data: {
      results: Array.from({ length: 10 }, (_, i) => ({
        name: `pokemon-${i + 1}`,
        url: `https://pokeapi.co/api/v2/pokemon/${i + 1}`
      }))
    }
  };

  // Mock da resposta da API
  axios.get.mockResolvedValueOnce(mockData);
  
  render(
    <ThemeContextProvider>
      <Home />
    </ThemeContextProvider>
  );
  
  // Verifica se os 10 Pokémons iniciais são renderizados
  const pokemonCards = await screen.findAllByRole("heading");
  expect(pokemonCards).toHaveLength(10); // Espera 10 Pokémons iniciais

  // Clica no botão "Load More"
  const loadMoreButton = screen.getByText(/Load More/i);
  fireEvent.click(loadMoreButton);

  // Mock para o próximo conjunto de Pokémons
  const mockDataMore = {
    data: {
      results: Array.from({ length: 10 }, (_, i) => ({
        name: `pokemon-${i + 11}`,
        url: `https://pokeapi.co/api/v2/pokemon/${i + 11}`
      }))
    }
  };
  axios.get.mockResolvedValueOnce(mockDataMore);

  // Espera o carregamento dos próximos 10 Pokémons
  await waitFor(() => screen.findAllByRole("heading"));
  
  // Verifica se agora temos 20 Pokémons
  const allPokemonCards = screen.getAllByRole("heading");
  expect(allPokemonCards).toHaveLength(20); // Espera 20 Pokémons após o Load More

  // Verifica se o botão "Back to ten" está visível
  const backToTenButton = screen.getByText(/Back to ten/i);
  expect(backToTenButton).toBeInTheDocument();

  // Clica no botão "Back to ten"
  fireEvent.click(backToTenButton);

  // Espera que a lista de Pokémons seja resetada para 10
  await waitFor(() => screen.findAllByRole("heading"));
  const resetPokemonCards = screen.getAllByRole("heading");
  expect(resetPokemonCards).toHaveLength(10); // Espera 10 Pokémons após clicar no Back to ten
});
