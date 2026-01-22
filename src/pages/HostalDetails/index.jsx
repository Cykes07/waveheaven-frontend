import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import defaultImage from '../../assets/react.svg';
import './style.css';

const HostalDetails = () => {
  const { id } = useParams();
  
  // Estado para guardar el producto que viene del backend
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Petición al Backend en la nube
        const response = await fetch(`https://waveheaven-backend.onrender.com/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error('No se pudo cargar el producto');
        }

        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="details-container"><p>Cargando detalles...</p></div>;
  if (error || !product) return <div className="details-container"><p>Error: {error || "Producto no encontrado"}</p></div>;

  // --- ADAPTACIÓN DE DATOS ---
  const displayTitle = product.name || "Sin Nombre";
  const displayCategory = product.categoryTitle || "General";
  const displayPrice = product.price || 0;
  const displayDescription = product.description || "Sin descripción disponible para este alojamiento.";
  
  // Obtener la primera imagen si existe, si no usar default
  const displayImage = (product.images && product.images.length > 0) 
    ? product.images[0].url 
    : defaultImage;

  return (
    <div className="details-container">
      <Link to="/" className="back-button">← Volver</Link>

      <div className="details-content">
        {/* Imagen Hero Gigante */}
        <div className="details-image-wrapper">
            <img 
              src={displayImage} 
              alt={displayTitle} 
              className="details-hero-image"
              onError={(e) => e.target.src = defaultImage}
            />
        </div>

        {/* Información Centrada y Elegante */}
        <div className="details-info">
          <div className="details-header">
            <h1 className="details-title">{displayTitle}</h1>
            <span className="details-category">{displayCategory}</span>
          </div>

          <p className="details-description">
            {displayDescription}
          </p>

          <div className="details-footer">
            <div className="details-price">
              ${displayPrice} <span className="price-period">/ noche</span>
            </div>
            
            <button className="reserve-button">
              Reservar Ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostalDetails;