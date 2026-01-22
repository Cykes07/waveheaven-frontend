import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import defaultImage from '../../assets/react.svg';
import './style.css';

const HostalDetails = () => {
  const { id } = useParams();
  
  // Estado para guardar el producto que viene del backend
  const [product, setProduct] = useState(null);
  // Estados para manejar la carga y errores
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función para pedir los datos al Backend
    const fetchProduct = async () => {
      try {
        // Asegúrate de que esta URL coincida con tu backend (puerto 8080 normalmente)
        const response = await fetch(`http://localhost:8080/api/products/${id}`);
        
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

  // Mostrar mensaje de carga mientras espera al backend
  if (loading) return <div className="details-container"><p>Cargando detalles...</p></div>;
  
  // Mostrar error si falla
  if (error || !product) return <div className="details-container"><p>Error: {error || "Producto no encontrado"}</p></div>;

  // --- ADAPTACIÓN DE DATOS (Backend -> Frontend) ---
  // El backend devuelve 'name', el diseño usa 'title'
  // El backend devuelve lista 'images', el diseño usa una sola imagen principal
  
  const displayTitle = product.name || "Sin Nombre";
  const displayCategory = product.categoryTitle || "General"; // Asumiendo que tu DTO devuelve categoryTitle
  const displayPrice = product.price || 0;
  const displayDescription = product.description || "Sin descripción.";
  
  // Obtener la primera imagen si existe, si no usar default
  const displayImage = (product.images && product.images.length > 0) 
    ? product.images[0].url 
    : defaultImage;

  return (
    <div className="details-container">
      <Link to="/" className="back-button">← Volver</Link>

      <div className="details-content">
        {/* Imagen Principal */}
        <div className="details-image-wrapper">
            <img 
              src={displayImage} 
              alt={displayTitle} 
              className="details-hero-image"
              onError={(e) => e.target.src = defaultImage}
            />
        </div>

        {/* Información */}
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
          
          {/* Si quieres mostrar más imágenes pequeñas abajo (Opcional) */}
          {product.images && product.images.length > 1 && (
             <div className="details-gallery-preview">
                {product.images.slice(1, 4).map((img, index) => (
                    <img key={index} src={img.url} alt="Vista adicional" className="gallery-thumb" />
                ))}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostalDetails;