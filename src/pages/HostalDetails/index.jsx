import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import defaultImage from '../../assets/react.svg';
import './style.css';

const HostalDetails = () => {
  const { id } = useParams();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://waveheaven-backend.onrender.com/api/products/${id}`);
        if (!response.ok) throw new Error('No se pudo cargar el producto');
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="loading-container">Cargando...</div>;
  if (error || !product) return <div className="error-container">Producto no encontrado</div>;

  // Datos
  const title = product.name || "Alojamiento sin nombre";
  const category = product.categoryTitle || "General";
  const description = product.description || "Sin descripción disponible.";
  const price = product.price || 0;
  
  // Imágenes: La principal es la primera, las secundarias el resto
  const mainImage = (product.images && product.images.length > 0) ? product.images[0].url : defaultImage;
  const secondaryImages = (product.images && product.images.length > 1) ? product.images.slice(1, 5) : [];

  return (
    <div className="details-page">
      
      {/* 1. CABECERA: Título y Navegación */}
      <div className="details-header-section">
        <Link to="/" className="back-link">← Volver al inicio</Link>
        <h1 className="main-title">{title}</h1>
        <div className="main-subtitle">
            <span className="category-badge">{category}</span>
            <span className="location-text"> • Ubicación increíble</span>
        </div>
      </div>

      {/* 2. GALERÍA DE IMÁGENES (ARRIBA) */}
      <div className="gallery-section">
        <div className="main-image-container">
            <img src={mainImage} alt={title} className="gallery-img main" onError={(e) => e.target.src = defaultImage}/>
        </div>
        {/* Si hay más imágenes, se muestran en una columna lateral pequeña (grid estilo Airbnb) */}
        {secondaryImages.length > 0 && (
            <div className="secondary-images-container">
                {secondaryImages.map((img, index) => (
                    <img key={index} src={img.url} alt={`Vista ${index}`} className="gallery-img secondary" />
                ))}
            </div>
        )}
      </div>

      {/* 3. CONTENIDO DIVIDIDO (COLUMNAS ABAJO) */}
      <div className="content-grid">
        
        {/* COLUMNA IZQUIERDA: Descripción e Info */}
        <div className="content-left">
            <div className="host-info">
                <h3>Alojamiento entero: {category}</h3>
                <p>2 huéspedes • 1 habitación • 1 cama • 1 baño</p>
            </div>
            
            <div className="divider"></div>

            <div className="description-section">
                <h3>Acerca de este lugar</h3>
                <p>{description}</p>
            </div>

            <div className="divider"></div>

            <div className="amenities-section">
                <h3>Lo que ofrece este lugar</h3>
                <ul className="amenities-list">
                    <li>Wifi</li>
                    <li>Cocina</li>
                    <li>Vista al mar</li>
                    <li>Estacionamiento gratuito</li>
                </ul>
            </div>
        </div>

        {/* COLUMNA DERECHA: Tarjeta de Reserva Flotante */}
        <div className="content-right">
            <div className="booking-card">
                <div className="card-header">
                    <span className="card-price">${price}</span>
                    <span className="card-period"> noche</span>
                </div>
                
                <div className="card-body">
                    <div className="date-picker-mock">
                        <div className="date-box">Llegada</div>
                        <div className="date-box">Salida</div>
                    </div>
                    <button className="btn-reserve-primary">Reservar</button>
                </div>
                
                <div className="card-footer">
                    <p>No se te cobrará todavía</p>
                    <div className="total-row">
                        <span>Total</span>
                        <span>${price}</span>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default HostalDetails;