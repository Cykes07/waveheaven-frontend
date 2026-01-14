import React, { useState, useEffect } from 'react';
import "./style.css";
import ProductCard from "../../components/ProductCard";
// BORRAMOS: import accommodations from "../../data/mockdata"; <--- Ya no usamos esto
import Header from "../../components/Header";
import SearchBar from '../../components/SearchBar';
import Footer from '../../components/Footer';
import Pagination from '../../components/Pagination';

// Función para obtener productos aleatorios (Se mantiene igual)
const getRandomProducts = (products, count = 20) => {
  // Verificación de seguridad por si products está vacío
  if (!products || products.length === 0) return [];

  const shuffled = [...products];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, products.length));
};

export default function Home() {
  // 1. ESTADO PARA LOS PRODUCTOS REALES (Sustituye a 'accommodations')
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);

  const [randomRecommendations, setRandomRecommendations] = useState([]);
  
  // Estados para paginación de alojamientos
  const [currentPageAccommodations, setCurrentPageAccommodations] = useState(1);
  const itemsPerPage = 10;

  // Estados para paginación de recomendaciones
  const [currentPageRecommendations, setCurrentPageRecommendations] = useState(1);

  // URL del Backend
  const API_URL = import.meta.env.VITE_API_URL || 'https://waveheaven-backend.onrender.com';

  // 2. FETCH DE DATOS REALES
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`);
        if (response.ok) {
          const data = await response.json();
          const realData = data.content || data || [];

          // 3. ADAPTADOR DE DATOS (Backend -> Frontend)
          // Transformamos los datos para que tu ProductCard no se rompa.
          // Convertimos la lista de imágenes del backend a una propiedad 'image' simple.
          const formattedProducts = realData.map(item => ({
            ...item,
            // Si el backend trae images, usamos la primera. Si no, una por defecto.
            image: (item.images && item.images.length > 0) 
                   ? item.images[0].url 
                   : "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1"
          }));

          setProducts(formattedProducts);
          
          // Generamos las recomendaciones una vez que tenemos los datos reales
          setRandomRecommendations(getRandomProducts(formattedProducts, 10));
        }
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Calcular productos a mostrar en la página actual - ALOJAMIENTOS
  // NOTA: Cambiamos 'accommodations' por 'products'
  const indexOfLastItemAccommodations = currentPageAccommodations * itemsPerPage;
  const indexOfFirstItemAccommodations = indexOfLastItemAccommodations - itemsPerPage;
  const currentAccommodations = products.slice(
    indexOfFirstItemAccommodations,
    indexOfLastItemAccommodations
  );
  const totalPagesAccommodations = Math.ceil(products.length / itemsPerPage);

  // Calcular productos a mostrar en la página actual - RECOMENDACIONES
  const indexOfLastItemRecommendations = currentPageRecommendations * itemsPerPage;
  const indexOfFirstItemRecommendations = indexOfLastItemRecommendations - itemsPerPage;
  const currentRecommendations = randomRecommendations.slice(
    indexOfFirstItemRecommendations,
    indexOfLastItemRecommendations
  );
  const totalPagesRecommendations = Math.ceil(randomRecommendations.length / itemsPerPage);

  // Funciones de navegación - ALOJAMIENTOS
  const handlePageChangeAccommodations = (pageNumber) => {
    setCurrentPageAccommodations(pageNumber);
    document.querySelector('.accommodations-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const goToFirstPageAccommodations = () => {
    handlePageChangeAccommodations(1);
  };

  const goToPreviousPageAccommodations = () => {
    if (currentPageAccommodations > 1) {
      handlePageChangeAccommodations(currentPageAccommodations - 1);
    }
  };

  const goToNextPageAccommodations = () => {
    if (currentPageAccommodations < totalPagesAccommodations) {
      handlePageChangeAccommodations(currentPageAccommodations + 1);
    }
  };

  // Funciones de navegación - RECOMENDACIONES
  const handlePageChangeRecommendations = (pageNumber) => {
    setCurrentPageRecommendations(pageNumber);
    document.querySelector('.recommendations-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const goToFirstPageRecommendations = () => {
    handlePageChangeRecommendations(1);
  };

  const goToPreviousPageRecommendations = () => {
    if (currentPageRecommendations > 1) {
      handlePageChangeRecommendations(currentPageRecommendations - 1);
    }
  };

  const goToNextPageRecommendations = () => {
    if (currentPageRecommendations < totalPagesRecommendations) {
      handlePageChangeRecommendations(currentPageRecommendations + 1);
    }
  };

  return (
    <>
      <Header />
      <SearchBar/>
      <main className="home">
        
        {/* Mostramos "Cargando..." si aún no llegan los datos */}
        {loading ? (
           <div style={{textAlign: 'center', padding: '50px', fontSize: '1.2rem'}}>
             🌊 Cargando las mejores estancias para ti...
           </div>
        ) : (
           <>
            {/* SECCIÓN DE ALOJAMIENTOS */}
            <section className="accommodations-section">
              <h2>Buscar por tipo de alojamiento</h2>
              
              {products.length > 0 ? (
                <>
                  <div className="accommodations-grid">
                    {currentAccommodations.map((item) => (
                      <ProductCard key={item.id} {...item} />
                    ))}
                  </div>

                  {/* Paginación para alojamientos */}
                  {totalPagesAccommodations > 1 && (
                    <Pagination
                      currentPage={currentPageAccommodations}
                      totalPages={totalPagesAccommodations}
                      onPageChange={handlePageChangeAccommodations}
                      onFirst={goToFirstPageAccommodations}
                      onPrevious={goToPreviousPageAccommodations}
                      onNext={goToNextPageAccommodations}
                    />
                  )}
                </>
              ) : (
                <p style={{textAlign: 'center'}}>No hay alojamientos disponibles.</p>
              )}
            </section>

            {/* SECCIÓN DE RECOMENDACIONES */}
            {randomRecommendations.length > 0 && (
              <section className="recommendations-section">
                <h2>Recomendaciones</h2>
                
                <div className="recommendations-grid">
                  {currentRecommendations.map((item) => (
                    <ProductCard key={`rec-${item.id}`} {...item} />
                  ))}
                </div>

                {/* Paginación para recomendaciones */}
                {totalPagesRecommendations > 1 && (
                  <Pagination
                    currentPage={currentPageRecommendations}
                    totalPages={totalPagesRecommendations}
                    onPageChange={handlePageChangeRecommendations}
                    onFirst={goToFirstPageRecommendations}
                    onPrevious={goToPreviousPageRecommendations}
                    onNext={goToNextPageRecommendations}
                  />
                )}
              </section>
            )}
           </>
        )}
      </main>
      <Footer/>
    </>
  );
}