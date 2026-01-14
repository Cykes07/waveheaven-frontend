import React from 'react';
import { Link } from 'react-router-dom';
import './style.css'; // Asegúrate de que este archivo exista

const ProductCard = ({ id, name, title, description, price, image, category }) => {
  
  // 1. Resolvemos el nombre (puede venir como 'name' o 'title')
  const displayName = name || title || "Alojamiento sin nombre";
  
  // 2. Recortamos la descripción si es muy larga
  const shortDescription = description 
    ? description.substring(0, 100) + (description.length > 100 ? "..." : "")
    : "Disfruta de una estancia inolvidable.";

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={image || "https://via.placeholder.com/300"} 
          alt={displayName} 
          className="product-image" 
        />
        <span className="product-category">{category || "Estancia"}</span>
      </div>

      <div className="product-info">
        <h3 className="product-title">{displayName}</h3>
        <p className="product-description">{shortDescription}</p>
        <div className="product-footer">
          <span className="product-price">${price} / noche</span>
          
          {/* 3. ENLACE CORRECTO: Cambia '/detail/' por la ruta que uses en App.jsx */}
          <Link to={`/detail/${id}`} className="product-button">
            Ver Detalles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;