import React, { useContext } from "react";
import styled from "styled-components";
import { ThemeContext } from "./context/ThemeContext";

const ThemeToggler = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <Switch theme={theme} onClick={toggleTheme}>
            <Icon>{theme === "dark" ? "🌙" : "🌞"}</Icon>
            <Slider theme={theme} />
        </Switch>
    );
};

export default ThemeToggler;

const Switch = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 70px;
  height: 30px;
  background: ${({ theme }) => (theme === "dark" ? "#222" : "#ddd")};
  border-radius: 34px;
  padding: 5px;
  cursor: pointer;
  position: relative;
  transition: background 0.4s;
  outline: none;
  user-select: none;
`;

const Icon = styled.span`
  font-size: 18px;
  z-index: 2;
`;

const Slider = styled.div`
  position: absolute;
  top: 3px;
  left: ${({ theme }) => (theme === "dark" ? "40px" : "3px")};
  width: 24px;
  height: 24px;
  background-color: white;
  border-radius: 50%;
  transition: 0.4s ease;
  pointer-events: none;
`;
