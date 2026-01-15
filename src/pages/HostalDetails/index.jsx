import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './style.css'; // Asegúrate de que tienes estilos aquí

const HostalDetails = () => {
  const { id } = useParams(); // 1. Capturamos el ID de la URL (ej: 52)
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // URL del Backend
  const API_URL = import.meta.env.VITE_API_URL || 'https://waveheaven-backend.onrender.com';

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        // 2. Pedimos los detalles específicos de este ID
        const response = await fetch(`${API_URL}/api/products/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          console.error("Producto no encontrado");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>Cargando detalles...</div>;
  if (!product) return <div style={{textAlign:'center', marginTop:'50px'}}>Producto no encontrado :(</div>;

  // 3. Preparamos la imagen (Backend envía lista de objetos)
  const imageUrl = product.images && product.images.length > 0 
      ? product.images[0].url 
      : "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1"; // Imagen por defecto

  return (
    <>
      <Header />
      
      <div className="details-container" style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
        
        <Link to="/" style={{ textDecoration: 'none', color: '#666', marginBottom: '20px', display: 'inline-block' }}>
          ← Volver al inicio
        </Link>

        <div className="details-content" style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          
          {/* Columna Izquierda: Imagen */}
          <div className="details-image" style={{ flex: '1 1 400px' }}>
            <img 
              src={imageUrl} 
              alt={product.name} 
              style={{ width: '100%', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} 
            />
          </div>

          {/* Columna Derecha: Información */}
          <div className="details-info" style={{ flex: '1 1 400px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{product.name}</h1>
            <p className="category" style={{ color: '#888', marginBottom: '20px' }}>
                Categoría: {product.categoryName || "Estancia Exclusiva"}
            </p>
            
            <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>${product.price} <span style={{fontSize:'1rem', fontWeight:'normal'}}>/ noche</span></h2>
            
            <div className="description" style={{ lineHeight: '1.6', color: '#555', marginBottom: '30px' }}>
              <h3>Descripción</h3>
              <p>{product.description}</p>
            </div>

            <button 
                style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '15px 30px',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    width: '100%'
                }}
                onClick={() => alert("¡Función de Reserva próximamente!")}
            >
                Reservar Ahora
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default HostalDetails;