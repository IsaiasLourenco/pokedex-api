console.log("Jest está rodando com:", typeof document !== "undefined" ? "jsdom" : "node");
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PokemonDetails from "./PokemonDetails";
import axios from "axios";

jest.mock("axios");

test("exibe detalhes do Pokémon", async () => {
  const mockPokemon = {
    sprites: { front_default: "pokemon-image-url" },
    name: "pikachu",
    moves: [{ move: { name: "thunderbolt" } }],
    abilities: [{ ability: { name: "static", url: "ability-url" } }],
    types: [{ type: { name: "electric" } }]
  };
  
  axios.get.mockResolvedValueOnce({ data: mockPokemon });
  
  render(
    <MemoryRouter initialEntries={["/pokemon/1"]}>
      <Routes>
        <Route path="/pokemon/:id" element={<PokemonDetails />} />
      </Routes>
    </MemoryRouter>
  );
  
  expect(await screen.findByText(/pikachu/i)).toBeInTheDocument();
  expect(screen.getByText(/thunderbolt/i)).toBeInTheDocument();
  expect(screen.getByText(/static/i)).toBeInTheDocument();
  expect(screen.getByText(/electric/i)).toBeInTheDocument();
});
