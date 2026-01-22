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
        if (!response.ok) throw new Error('Error al cargar producto');
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="loading-container">Cargando...</div>;
  if (error || !product) return <div className="error-container">Producto no encontrado</div>;

  // --- Datos ---
  const title = product.name || "Sin Nombre";
  const category = product.categoryTitle || "General";
  const description = product.description || "Sin descripción.";
  const price = product.price ? `$${product.price}` : "Consultar";
  
  // Listas de detalles (si vienen del backend)
  const characteristics = product.characteristics || [];
  const policies = product.policies || [];

  // --- Imágenes ---
  // Imagen principal (la primera)
  const mainImage = (product.images && product.images.length > 0) ? product.images[0].url : defaultImage;
  // Imágenes secundarias (máximo 4 para la cuadrícula lateral)
  const secondaryImages = (product.images && product.images.length > 1) ? product.images.slice(1, 5) : [];

  return (
    <div className="details-page">
      
      {/* HEADER */}
      <div className="details-header">
        <Link to="/" className="back-link">← Volver</Link>
        <h1 className="product-title">{title}</h1>
        <p className="product-location">Ubicación excelente • {category}</p>
      </div>

      {/* GALERÍA DE IMÁGENES (ARRIBA) */}
      <div className="gallery-container">
        <div className="main-image-box">
            <img src={mainImage} alt={title} className="img-cover" onError={(e)=>e.target.src=defaultImage}/>
        </div>
        {/* Grid de fotos secundarias (solo si existen) */}
        {secondaryImages.length > 0 && (
            <div className="side-images-box">
                {secondaryImages.map((img, index) => (
                    <div key={index} className="side-img-item">
                        <img src={img.url} alt={`Vista ${index}`} className="img-cover" />
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* CONTENIDO DIVIDIDO */}
      <div className="content-layout">
        
        {/* IZQUIERDA: DESCRIPCIÓN */}
        <div className="column-left">
            <div className="description-section">
                <h2>Descripción del alojamiento</h2>
                <p className="description-text">{description}</p>
            </div>
        </div>

        {/* DERECHA: TABLA DE INFORMACIÓN Y RESERVA */}
        <div className="column-right">
            <div className="info-card">
                <h3>Detalles y Reserva</h3>
                
                {/* TABLA DE INFORMACIÓN */}
                <table className="info-table">
                    <tbody>
                        <tr>
                            <th>Categoría</th>
                            <td>{category}</td>
                        </tr>
                        <tr>
                            <th>Precio</th>
                            <td className="price-cell">{price} <small>/ noche</small></td>
                        </tr>
                        
                        {/* Renderizar características si existen */}
                        {characteristics.length > 0 && (
                            <tr>
                                <th>Características</th>
                                <td>
                                    <ul className="table-list">
                                        {characteristics.map(c => <li key={c.id}>{c.name}</li>)}
                                    </ul>
                                </td>
                            </tr>
                        )}

                        {/* Renderizar políticas si existen */}
                        {policies.length > 0 && (
                            <tr>
                                <th>Políticas</th>
                                <td>
                                    <ul className="table-list">
                                        {policies.map(p => <li key={p.id}>{p.title}</li>)}
                                    </ul>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="action-area">
                    <button className="btn-reserve">Reservar Ahora</button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default HostalDetails;