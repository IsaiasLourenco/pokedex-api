import React, { useState, useEffect } from "react";
import axios from "axios";

const Description = ({ abilityUrl }) => {
    const [description, setDescription] = useState("");

    useEffect(() => {
        const fetchAbilityDescription = async () => {
            const response = await axios.get(abilityUrl);
            const descriptionText =
                response.data.effect_entries.find(
                    (entry) => entry.language.name === "en"
                )?.short_effect || "Descrição não disponível";
            setDescription(descriptionText);
        };

        fetchAbilityDescription();
    }, [abilityUrl]);

    return <span>{description}</span>;
};

export default Description;
