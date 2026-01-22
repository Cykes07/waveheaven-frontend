import React from 'react';
import { Link } from 'react-router-dom'; // Importante para la navegación
import './style.css';
import defaultImage from '../../assets/react.svg'; // O tu imagen por defecto

const ProductCard = ({ id, name, title, image }) => {
  // Usamos title o name según venga del backend
  const displayName = title || name || "Producto sin nombre";
  
  // Si la imagen viene vacía, usamos una por defecto
  const displayImage = image || defaultImage;

  return (
    <Link to={`/hostaldetails/${id}`} className="product-card">
      <div className="product-image-container">
        <img 
          src={displayImage} 
          alt={displayName} 
          className="product-image" 
          onError={(e) => e.target.src = defaultImage} // Si falla la carga, pone la default
        />
      </div>
      <div className="product-info">
        <h3 className="product-title">{displayName}</h3>
      </div>
    </Link>
  );
};

export default ProductCard;