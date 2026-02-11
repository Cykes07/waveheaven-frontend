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
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1);

  // Estado para el buscador
  const [searchTerm, setSearchTerm] = useState("");

  // 2. ESTADO PARA RECOMENDACIONES (Separado)
  const [randomRecommendations, setRandomRecommendations] = useState([]);

  // URL del Backend
  const API_URL = import.meta.env.VITE_API_URL || 'https://waveheaven-backend.onrender.com';

  // --- CARGA DE DATOS ---

  // A. Cargar lista principal (Paginada y con Búsqueda)
  const fetchProducts = async (page, term = "") => {
    setLoading(true);
    try {
      const pageToSend = page - 1;
      let url = `${API_URL}/api/products?page=${pageToSend}&size=10`;
      
      // Si el usuario escribió algo, cambiamos al endpoint de búsqueda
      if (term.trim()) {
        url = `${API_URL}/api/products/search?name=${encodeURIComponent(term)}&page=${pageToSend}&size=10`;
      }

      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        const formattedProducts = (data.content || []).map(formatProductImage);
        setProducts(formattedProducts);
        setTotalPages(data.totalPages || 1);
      } else {
        setProducts([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error cargando productos:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // B. Cargar recomendaciones
  const fetchRecommendations = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products/random?count=4`);
      if (response.ok) {
        const data = await response.json();
        const formattedRecs = (Array.isArray(data) ? data : []).map(formatProductImage);
        setRandomRecommendations(formattedRecs);
      }
    } catch (error) {
      console.error("Error cargando recomendaciones:", error);
    }
  };

  const formatProductImage = (item) => ({
    ...item,
    image: (item.images && item.images.length > 0) 
           ? item.images[0].url 
           : "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1"
  });

  // --- EFECTOS ---
  useEffect(() => {
    fetchRecommendations();
  }, []);

  useEffect(() => {
    fetchProducts(currentPage, searchTerm);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, searchTerm]);

  // --- MANEJADORES ---
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Volver a la primera página al buscar
  };

  const handlePageChange = (page) => setCurrentPage(page);
  const goToFirstPage = () => setCurrentPage(1);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));

  return (
    <>
      <Header />
      {/* Pasamos la función handleSearch al componente */}
      <SearchBar onSearch={handleSearch} />
      <main className="home">
        
        {loading ? (
           <div style={{textAlign: 'center', padding: '50px', fontSize: '1.2rem'}}>
             🌊 Buscando las mejores estancias para ti...
           </div>
        ) : (
           <>
            <section className="accommodations-section">
              <h2>{searchTerm ? `Resultados para "${searchTerm}"` : "Buscar por tipo de alojamiento"}</h2>
              
              {products.length > 0 ? (
                <>
                  <div className="accommodations-grid">
                    {products.map((item) => (
                      <ProductCard key={item.id} {...item} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        onFirst={goToFirstPage}
                        onPrevious={goToPreviousPage}
                        onNext={goToNextPage}
                    />
                  )}
                </>
              ) : (
                <div style={{textAlign: 'center', padding: '40px'}}>
                    <h3>No encontramos alojamientos con ese nombre.</h3>
                    <p>Intenta con otra palabra clave.</p>
                </div>
              )}
            </section>

            {randomRecommendations.length > 0 && (
              <section className="recommendations-section">
                <h2>Recomendaciones para ti</h2>
                <div className="recommendations-grid">
                  {randomRecommendations.map((item) => (
                    <ProductCard key={`rec-${item.id}`} {...item} />
                  ))}
                </div>
              </section>
            )}
           </>
        )}
      </main>
      <Footer/>
    </>
  );
}   