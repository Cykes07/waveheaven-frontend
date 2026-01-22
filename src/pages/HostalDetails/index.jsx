import React from 'react';
import { useParams, Link } from 'react-router-dom';
import accommodations from '../../data/mockdata'; // Asegúrate de importar tus datos
import defaultImage from '../../assets/react.svg';
import './style.css';

const HostalDetails = () => {
  const { id } = useParams();
  
  // Buscar el producto por ID (asegurando que ambos sean del mismo tipo)
  const product = accommodations.find(item => item.id == id);

  if (!product) {
    return <div className="details-error">Producto no encontrado</div>;
  }

  // Si no hay imagen, usar default
  const displayImage = product.image || defaultImage;

  return (
    <div className="details-container">
      {/* Botón para volver flotante o en la esquina */}
      <Link to="/" className="back-button">← Volver</Link>

      <div className="details-content">
        {/* Sección de Imagen Principal (Hero) */}
        <div className="details-image-wrapper">
            <img 
              src={displayImage} 
              alt={product.title} 
              className="details-hero-image"
              onError={(e) => e.target.src = defaultImage}
            />
        </div>

        {/* Sección de Información Minimalista */}
        <div className="details-info">
          <div className="details-header">
            <h1 className="details-title">{product.title}</h1>
            <span className="details-category">{product.category}</span>
          </div>

          <p className="details-description">
            {product.description || "Sin descripción disponible para este alojamiento."}
          </p>

          <div className="details-footer">
            <div className="details-price">
              ${product.price} <span className="price-period">/ noche</span>
            </div>
            
            <button className="reserve-button">
              Reservar Ahora
            </button>
          </div>
          
          {/* Si tienes características extra, se pueden listar simple aquí */}
          {product.available && (
             <p className="details-availability">Disponibles: {product.available}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostalDetails;