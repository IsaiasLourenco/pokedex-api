import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const ThemeToggler = () => {
    const { toggleTheme } = useContext(ThemeContext);

    return <button onClick={toggleTheme}>Alternar Tema</button>;
};

export default ThemeToggler;
