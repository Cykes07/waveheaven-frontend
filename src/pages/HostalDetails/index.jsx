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

  // --- 1. FUNCIÓN PARA ARREGLAR LAS IMÁGENES ---
  // Esta función decide si la imagen necesita una "/" al principio o no.
  const getCorrectImageUrl = (imageObj) => {
    if (!imageObj || !imageObj.url) return defaultImage;
    
    // Si es una URL de internet (https://...), la dejamos tal cual
    if (imageObj.url.startsWith('http')) {
        return imageObj.url;
    }
    
    // Si es local (ej: "image1.jpg"), le agregamos "/" para que la busque en la raíz
    // Esto evita el error de buscar en /detail/1/image1.jpg
    return imageObj.url.startsWith('/') ? imageObj.url : `/${imageObj.url}`;
  };

  // --- Datos del Producto ---
  const title = product.name || "Sin Nombre";
  const category = product.categoryTitle || "General";
  const description = product.description || "Sin descripción.";
  const price = product.price ? `$${product.price}` : "Consultar";
  
  const characteristics = product.characteristics || [];
  const policies = product.policies || [];

  // --- 2. USAMOS LA FUNCIÓN DE IMÁGENES ---
  const mainImage = (product.images && product.images.length > 0) 
    ? getCorrectImageUrl(product.images[0]) 
    : defaultImage;

  const secondaryImages = (product.images && product.images.length > 1) 
    ? product.images.slice(1, 5).map(img => ({ ...img, url: getCorrectImageUrl(img) })) 
    : [];

  // --- URL para compartir ---
  const shareUrl = window.location.href;
  const shareText = `¡Mira este increíble alojamiento en WaveHeaven! ${title}`;

  return (
    <div className="details-page">
      <div className="details-header">
        <Link to="/" className="back-link">← Volver</Link>
        <h1 className="product-title">{title}</h1>
        <p className="product-location">Ubicación excelente • {category}</p>
      </div>

      <div className="gallery-container">
        {/* Imagen Principal */}
        <div className="main-image-box">
            <img 
                src={mainImage} 
                alt={title} 
                className="img-cover" 
                onError={(e)=>e.target.src=defaultImage}
            />
        </div>
        
        {/* Imágenes Secundarias */}
        {secondaryImages.length > 0 && (
            <div className="side-images-box">
                {secondaryImages.map((img, index) => (
                    <div key={index} className="side-img-item">
                        <img 
                            src={img.url} 
                            alt={`Vista ${index}`} 
                            className="img-cover" 
                            onError={(e)=>e.target.src=defaultImage}
                        />
                    </div>
                ))}
            </div>
        )}
      </div>

      <div className="content-layout">
        <div className="column-left">
            <div className="description-section">
                <h2>Descripción del alojamiento</h2>
                <p className="description-text">{description}</p>
            </div>
        </div>

        <div className="column-right">
            <div className="info-card">
                <h3>Detalles y Reserva</h3>
                <table className="info-table">
                    <tbody>
                        <tr><th>Categoría</th><td>{category}</td></tr>
                        <tr><th>Precio</th><td className="price-cell">{price} <small>/ noche</small></td></tr>
                        {characteristics.length > 0 && (
                            <tr><th>Características</th><td>
                                <ul className="table-list">
                                    {characteristics.map(c => <li key={c.id}>{c.name}</li>)}
                                </ul>
                            </td></tr>
                        )}
                        {policies.length > 0 && (
                            <tr><th>Políticas</th><td>
                                <ul className="table-list">
                                    {policies.map(p => <li key={p.id}>{p.title}</li>)}
                                </ul>
                            </td></tr>
                        )}
                    </tbody>
                </table>

                <div className="action-area">
                    <button className="btn-reserve">Reservar Ahora</button>
                </div>

                {/* --- SECCIÓN DE COMPARTIR --- */}
                <div className="social-share-section">
                    <h4>Compartir en redes</h4>
                    <div className="social-icons">
                        <a 
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} 
                            target="_blank" rel="noopener noreferrer"
                            className="social-icon fb" title="Facebook"
                        >
                           FB
                        </a>
                        <a 
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} 
                            target="_blank" rel="noopener noreferrer"
                            className="social-icon tw" title="Twitter"
                        >
                           TW
                        </a>
                        <a 
                            href={`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`} 
                            target="_blank" rel="noopener noreferrer"
                            className="social-icon wa" title="WhatsApp"
                        >
                           WA
                        </a>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default HostalDetails;