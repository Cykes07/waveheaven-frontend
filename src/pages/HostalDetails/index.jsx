import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker'; // Importamos el calendario
import "react-datepicker/dist/react-datepicker.css"; // Estilos del calendario
import defaultImage from '../../assets/react.svg';
import './style.css';

const HostalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Para redirigir al login
  
  // Estados de datos
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para la Reserva
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reservationStatus, setReservationStatus] = useState(null); // 'loading', 'success', 'error'

  // Recuperar usuario del localStorage para saber si puede reservar
  const getLoggedUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  };
  const user = getLoggedUser();
  const token = localStorage.getItem('jwt_token');

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

  // --- LÓGICA DE RESERVA ---
  const handleReservation = async () => {
    // 1. Validar Login
    if (!user || !token) {
        alert("Debes iniciar sesión para realizar una reserva.");
        navigate('/login');
        return;
    }

    // 2. Validar Fechas
    if (!startDate || !endDate) {
        alert("Por favor selecciona una fecha de llegada y salida.");
        return;
    }

    setReservationStatus('loading');

    // 3. Preparar datos para el Backend (Formato YYYY-MM-DD)
    const payload = {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        productId: parseInt(id),
        userId: user.id // Asumiendo que el objeto user tiene id
    };

    try {
        const response = await fetch('https://waveheaven-backend.onrender.com/api/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            setReservationStatus('success');
            alert("¡Reserva realizada con éxito! Revisa tu correo.");
            // Opcional: Limpiar fechas
            setStartDate(null);
            setEndDate(null);
        } else {
            const errText = await response.text();
            throw new Error(errText || "No se pudo completar la reserva");
        }
    } catch (e) {
        console.error(e);
        setReservationStatus('error');
        alert("Error al reservar: " + e.message);
    } finally {
        if(reservationStatus !== 'success') setReservationStatus(null);
    }
  };

  // --- Manejo del cambio de fechas en el calendario ---
  const onChangeDates = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  // --- Función imágenes ---
  const getCorrectImageUrl = (imageObj) => {
    if (!imageObj || !imageObj.url) return defaultImage;
    if (imageObj.url.startsWith('http')) return imageObj.url;
    return imageObj.url.startsWith('/') ? imageObj.url : `/${imageObj.url}`;
  };

  if (loading) return <div className="loading-container">Cargando...</div>;
  if (error || !product) return <div className="error-container">Producto no encontrado</div>;

  // Datos visuales
  const title = product.name || "Sin Nombre";
  const category = product.categoryTitle || "General";
  const description = product.description || "Sin descripción.";
  const price = product.price ? `$${product.price}` : "Consultar";
  const characteristics = product.characteristics || [];
  const policies = product.policies || [];
  
  const mainImage = (product.images && product.images.length > 0) ? getCorrectImageUrl(product.images[0]) : defaultImage;
  const secondaryImages = (product.images && product.images.length > 1) 
    ? product.images.slice(1, 5).map(img => ({ ...img, url: getCorrectImageUrl(img) })) 
    : [];

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
        <div className="main-image-box">
            <img src={mainImage} alt={title} className="img-cover" onError={(e)=>e.target.src=defaultImage}/>
        </div>
        {secondaryImages.length > 0 && (
            <div className="side-images-box">
                {secondaryImages.map((img, index) => (
                    <div key={index} className="side-img-item">
                        <img src={img.url} alt={`Vista ${index}`} className="img-cover" onError={(e)=>e.target.src=defaultImage}/>
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
            
            {/* Características */}
            {characteristics.length > 0 && (
                <div className="features-section">
                    <h3>¿Qué ofrece este lugar?</h3>
                    <ul className="features-grid">
                        {characteristics.map(c => <li key={c.id}>✓ {c.name}</li>)}
                    </ul>
                </div>
            )}
        </div>

        <div className="column-right">
            <div className="info-card">
                <h3>Reserva tu estadía</h3>
                
                <div className="price-tag-large">
                    {price} <span className="night-label">/ noche</span>
                </div>

                <div className="reservation-form">
                    <label className="date-label">Selecciona tus fechas:</label>
                    <div className="datepicker-wrapper">
                        <DatePicker
                            selected={startDate}
                            onChange={onChangeDates}
                            startDate={startDate}
                            endDate={endDate}
                            selectsRange
                            minDate={new Date()} // No permitir fechas pasadas
                            placeholderText="Llegada → Salida"
                            className="custom-datepicker"
                            dateFormat="dd/MM/yyyy"
                        />
                    </div>
                </div>

                <div className="action-area">
                    <button 
                        className="btn-reserve" 
                        onClick={handleReservation}
                        disabled={reservationStatus === 'loading'}
                    >
                        {reservationStatus === 'loading' ? 'Procesando...' : 'Iniciar Reserva'}
                    </button>
                    {!user && <small className="auth-warning">* Debes iniciar sesión para reservar</small>}
                </div>

                {/* TABLA DE POLÍTICAS (Compacta) */}
                {policies.length > 0 && (
                     <div className="policies-mini">
                        <strong>Políticas:</strong>
                        <ul>{policies.map(p => <li key={p.id}>{p.title}</li>)}</ul>
                     </div>
                )}

                {/* REDES SOCIALES (Actualizado con Instagram) */}
                <div className="social-share-section">
                    <h4>Compartir alojamiento</h4>
                    <div className="social-icons">
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" className="social-icon fb">FB</a>
                        
                        {/* INSTAGRAM (IG no tiene API directa de compartir URL, redirigimos al perfil o home) */}
                        <a href="https://www.instagram.com/" target="_blank" className="social-icon ig">IG</a>
                        
                        <a href={`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`} target="_blank" className="social-icon wa">WA</a>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default HostalDetails;