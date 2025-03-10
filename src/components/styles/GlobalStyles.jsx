import { createGlobalStyle } from "styled-components";
import styled from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: Arial, sans-serif;
    background-color: ${({ theme }) => theme.background}; /* Usando o tema */
    color: ${({ theme }) => theme.text}; /* Usando o tema */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }

  h1 {
    text-align: center;
    margin-bottom: 20px;
  }

  h2 {
    color: ${({ theme }) => theme.text}; /* Usando o tema */
    text-align: center;
    margin-bottom: 10px;
  }

  button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    background-color: ${({ theme }) => theme.buttonBackground};
    color: ${({ theme }) => theme.buttonText};
    border: none;
    border-radius: 5px;
    margin-top: 20px;
    margin-bottom: 20px; /* Margem para o botão de alternar tema */
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: ${({ theme }) => theme.buttonHover};
  }

  /* Grid de Pokémons */
  .pokemon-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr); /* Exibindo 5 colunas */
    gap: 10px;
    width: 100%;
    max-width: 1200px;
    justify-items: center;
    margin-bottom: 20px;
  }

  /* Estilo do botão de Voltar */
  .back-button {
    padding: 10px 20px;
    font-size: 18px;
    background-color: #ffcc00;
    color: #333;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-bottom: 20px;
  }

  .back-button:hover {
    background-color: rgb(131, 106, 9);
  }

  /* Remover os pontos das listas */
  ul {
    list-style-type: none;
    padding-left: 0;
  }
`;

export const Container = styled.div`
  text-align: center;
  padding: 20px;
`;

export const AbilityItem = styled.li`
  margin-bottom: 10px;
  text-align: center; /* Texto centralizado */
  padding: 8px;
  background-color: ${({ theme }) => theme.abilityBackground}; /* Mudando o fundo conforme o tema */
  color: ${({ theme }) => theme.abilityText}; /* Texto das habilidades depende do tema */
  border-radius: 8px; /* Remover borda */
  
  strong {
    color: ${({ theme }) => theme.abilityText}; /* Cor do nome da habilidade */
    font-size: 1.1rem;
    display: block;
  }
  
  span {
    display: block;
    margin-top: 5px;
    color: ${({ theme }) => theme.abilityDescriptionText}; /* Texto da descrição */
    font-size: 0.9rem;
    background-color: ${({ theme }) => theme.abilityDescriptionBackground}; /* Fundo da descrição */
    padding: 5px;
    border-radius: 5px;
    text-align: center; /* Texto da descrição centralizado */
  }
`;

export default GlobalStyles;
