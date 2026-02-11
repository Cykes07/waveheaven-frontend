import React, { useState, useEffect } from 'react';
import "./style.css";
import ProductCard from "../../components/ProductCard";
import Header from "../../components/Header";
import SearchBar from '../../components/SearchBar';
import Footer from '../../components/Footer';
import Pagination from '../../components/Pagination';

export default function Home() {
  // 1. ESTADO PARA LOS PRODUCTOS (Grid Principal)
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // Estados para paginación del Backend
  const [currentPage, setCurrentPage] = useState(1); // Empezamos en 1
  const [totalPages, setTotalPages] = useState(1);

  // 2. ESTADO PARA RECOMENDACIONES (Separado)
  const [randomRecommendations, setRandomRecommendations] = useState([]);

  // URL del Backend
  const API_URL = import.meta.env.VITE_API_URL || 'https://waveheaven-backend.onrender.com';

  // --- CARGA DE DATOS ---

  // A. Cargar lista principal (Paginada)
  const fetchProducts = async (page) => {
    setLoading(true);
    try {
      // Convertimos página 1 (frontend) a 0 (backend)
      const pageToSend = page - 1;
      const response = await fetch(`${API_URL}/api/products?page=${pageToSend}&size=10`); // Pedimos 10 por página
      
      if (response.ok) {
        const data = await response.json();
        
        // Adaptamos las imágenes
        const formattedProducts = (data.content || []).map(formatProductImage);
        
        setProducts(formattedProducts);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoading(false);
    }
  };

  // B. Cargar recomendaciones (Aleatorias desde el endpoint especial)
  const fetchRecommendations = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products/random?count=4`); // Pedimos 4 recomendaciones
      if (response.ok) {
        const data = await response.json();
        // El endpoint random devuelve una lista directa, no un objeto Page
        const formattedRecs = (Array.isArray(data) ? data : []).map(formatProductImage);
        setRandomRecommendations(formattedRecs);
      }
    } catch (error) {
      console.error("Error cargando recomendaciones:", error);
    }
  };

  // Helper para arreglar imágenes
  const formatProductImage = (item) => ({
    ...item,
    image: (item.images && item.images.length > 0) 
           ? item.images[0].url 
           : "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1"
  });

  // --- EFECTOS ---

  // 1. Cargar recomendaciones solo al inicio
  useEffect(() => {
    fetchRecommendations();
  }, []);

  // 2. Cargar productos cada vez que cambie la página
  useEffect(() => {
    fetchProducts(currentPage);
    
    // Scroll suave hacia arriba al cambiar de página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);


  // --- MANEJADORES DE PAGINACIÓN ---
  const handlePageChange = (page) => setCurrentPage(page);
  const goToFirstPage = () => setCurrentPage(1);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));

  return (
    <>
      <Header />
      <SearchBar/>
      <main className="home">
        
        {loading && products.length === 0 ? (
           <div style={{textAlign: 'center', padding: '50px', fontSize: '1.2rem'}}>
             🌊 Cargando las mejores estancias para ti...
           </div>
        ) : (
           <>
            {/* SECCIÓN DE ALOJAMIENTOS (Grid Principal) */}
            <section className="accommodations-section">
              <h2>Buscar por tipo de alojamiento</h2>
              
              {products.length > 0 ? (
                <>
                  <div className="accommodations-grid">
                    {/* Ya no usamos slice() porque 'products' trae solo los 10 de esta página */}
                    {products.map((item) => (
                      <ProductCard key={item.id} {...item} />
                    ))}
                  </div>

                  {/* Paginación Conectada al Backend */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    onFirst={goToFirstPage}
                    onPrevious={goToPreviousPage}
                    onNext={goToNextPage}
                  />
                </>
              ) : (
                <p style={{textAlign: 'center'}}>No se encontraron alojamientos.</p>
              )}
            </section>

            {/* SECCIÓN DE RECOMENDACIONES */}
            {randomRecommendations.length > 0 && (
              <section className="recommendations-section">
                <h2>Recomendaciones para ti</h2>
                <div className="recommendations-grid">
                  {randomRecommendations.map((item) => (
                    <ProductCard key={`rec-${item.id}`} {...item} />
                  ))}
                </div>
                {/* Las recomendaciones suelen ser fijas, no necesitan paginación */}
              </section>
            )}
           </>
        )}
      </main>
      <Footer/>
    </>
  );
}