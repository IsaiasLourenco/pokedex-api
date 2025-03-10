console.log("Jest está rodando com:", typeof document !== "undefined" ? "jsdom" : "node");
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ThemeContextProvider from "./context/ThemeContext";
import ThemeContext from "./context/ThemeContext.jsx";
import ThemeToggler from "./ThemeToggler";

test("alterna entre Dark Mode e Light Mode", () => {
  render(
    <ThemeContextProvider>
      <ThemeToggler />
    </ThemeContextProvider>
  );
  
  const button = screen.getByText(/Alternar Tema/i);
  expect(button).toBeInTheDocument();
  
  // Verifique o tema inicial (supondo que o tema inicial seja "light")
  const initialTheme = screen.container.firstChild; // Aqui você pode pegar um elemento da página para verificar a classe ou outro atributo
  expect(initialTheme).toHaveClass("light"); // Supondo que o tema seja representado por uma classe no corpo da página
  
  // Simula o clique no botão para alternar o tema
  fireEvent.click(button);
  
  // Verifique se o tema foi alterado para "dark"
  expect(initialTheme).toHaveClass("dark"); // Verifique se a classe foi alterada
  
  // Simula outro clique para voltar ao tema "light"
  fireEvent.click(button);
  
  // Verifique se o tema voltou para "light"
  expect(initialTheme).toHaveClass("light"); // Verifique se a classe voltou para "light"
});
