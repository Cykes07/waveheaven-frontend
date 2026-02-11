import React, { useState } from 'react';
import "./style.css"

export default function SearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = () => {
        // Ejecutamos la búsqueda solo si la función onSearch existe
        if (onSearch) {
            onSearch(searchTerm);
        }
    };

    const handleKeyDown = (e) => {
        // Permitir buscar al presionar Enter
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return(
        <section className="search-contenedor">
            <h2 className="seccion-titulo">Busca ofertas en cabañas y casas playeras</h2>
            <div className="search-box">
                <input 
                    type="text" 
                    placeholder="¿A donde vamos?" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <input type="text" placeholder="Check in - Check out" disabled />
                <button className="search-btn" onClick={handleSearch}>Buscar</button>
            </div>
        </section>
    )
}