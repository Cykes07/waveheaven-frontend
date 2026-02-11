import React, { useState, useEffect } from 'react';
import './style.css';
import Sidebar from '../../components/SideBar';
import Header from '../../components/AdminHeader';
import CabinTable from '../../components/CabinTable';
import AdminFilters from '../../components/AdminFilters';
import AddHostal from '../../components/AddHostal';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
const accommodations = [
    {
        "id": 1,
        "title": "Cabaña Tradicional con Pórtico",
        "available": 5,
        "image": "image1.jpg"
    },
    {
        "id": 2,
        "title": "Cabaña sobre Pilotes Turquesa",
        "available": 3,
        "image": "image2.jpg"
    },
    {
        "id": 3,
        "title": "Casa de Playa con Porche Amplio",
        "available": 4,
        "image": "image3.jpg"
    },
    {
        "id": 4,
        "title": "Casa Modular de Playa",
        "available": 2,
        "image": "image4.jpg"
    },
    {
        "id": 5,
        "title": "Bungalow Rústico frente al Mar",
        "available": 6,
        "image": "image5.jpg" 
    },
    {
        "id": 6,
        "title": "Villa Moderna Minimalista",
        "available": 1,
        "image": "image6.jpg" 
    },
    {
        "id": 7,
        "title": "Chalet de Playa con Terraza",
        "available": 2,
        "image": "image7.jpg" 
    },
    {
        "id": 8,
        "title": "Beach Shack Bohemio",
        "available": 4,
        "image": "image8.jpeg" 
    },
    {
        "id": 9,
        "title": "Casa Estilo Mediterráneo",
        "available": 3,
        "image": "image9.jpg" 
    },
    {
        "id": 10,
        "title": "Villa Eco-sustentable sobre Agua",
        "available": 1,
        "image": "image10.jpg" 
    }
  ];
// 1. IMPORTAMOS EL COMPONENTE DE PAGINACIÓN
import Pagination from '../../components/Pagination';

const Admin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cabinToDelete, setCabinToDelete] = useState(null);
  const [editingCabin, setEditingCabin] = useState(null);
  const [cabins, setCabins] = useState([]);
  
  // 2. ESTADOS PARA LA PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1); // Empezamos en página 1 (visual)
  const [totalPages, setTotalPages] = useState(1);

  const API_URL = import.meta.env.VITE_API_URL || 'https://waveheaven-backend.onrender.com';
  const getToken = () => localStorage.getItem('jwt_token'); 

  const getRealUser = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        return {
          name: `${parsed.firstName} ${parsed.lastName}`,
          email: parsed.email
        };
      } catch (e) {
        return { name: 'Admin', email: 'admin@waveheaven.com' };
      }
    }
    return { name: 'Admin', email: 'admin@waveheaven.com' };
  };
  const currentUser = getRealUser();

  // Recargar cuando cambie la página actual
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchProducts = async (page = 1) => {
    try {
      // El backend usa base 0 (página 0 es la primera), pero el frontend usa base 1.
      // Restamos 1 para enviar al backend.
      const pageToSend = page - 1;
      
      const response = await fetch(`${API_URL}/api/products?page=${pageToSend}&size=10`);
      
      if (response.ok) {
        const data = await response.json();
        // data.content es la lista, data.totalPages es el total
        setCabins(data.content || []);
        setTotalPages(data.totalPages || 1);
      } else {
        console.error("Error al cargar productos");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  const openModal = () => {
    setEditingCabin(null);
    setIsModalOpen(true);
  };

  const handleEdit = (cabin) => {
    setEditingCabin(cabin);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (cabin) => {
    setCabinToDelete(cabin);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (cabinToDelete) {
      try {
        const response = await fetch(`${API_URL}/api/products/${cabinToDelete.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        });

        if (response.ok) {
          // Recargamos la página actual después de borrar
          fetchProducts(currentPage);
          console.log('Producto eliminado');
        } else {
          alert("Error al eliminar. Verifica que tengas rol ADMIN.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
      setIsDeleteModalOpen(false);
      setCabinToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setCabinToDelete(null);
  };

  const handleProductSubmit = async (productData) => {
    const token = getToken();
    const imageList = productData.images && productData.images.length > 0
        ? productData.images.map(img => ({ url: img.url })) 
        : []; 

    const productPayload = {
        name: productData.name,
        description: productData.description,
        categoryId: 1, 
        price: parseFloat(productData.price) || 100.0,
        images: imageList 
    };

    try {
        let response;
        if (editingCabin) {
            response = await fetch(`${API_URL}/api/products/${editingCabin.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productPayload)
            });
        } else {
            response = await fetch(`${API_URL}/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productPayload)
            });
        }

        if (response.ok) {
            console.log("¡GUARDADO CON ÉXITO!");
            fetchProducts(currentPage); 
            setIsModalOpen(false); 
            setEditingCabin(null);
        } else {
            const errorText = await response.text();
            alert(`Error: ${errorText}`);
        }
    } catch (error) {
        console.error("Error de red:", error);
    }
  };

  const migrarDatos = async () => {
    const token = getToken();
    let cont = 0;

    // Usamos la variable 'accommodations' que tienes declarada al principio
    if (!confirm(`¿Estás seguro de que quieres subir ${accommodations.length} productos a la Base de Datos?`)) return;

    console.log("Iniciando migración...");

    // Recorremos tu lista 'accommodations'
    for (const item of accommodations) {
      
      // Construimos el objeto como le gusta al Backend
      const payload = {
        name: item.title,               // Tu 'title' pasa a ser 'name'
        description: "Alojamiento exclusivo con vistas increíbles.", // Descripción por defecto
        categoryId: 1,                  // Asignamos a la categoría 1
        price: 120.0 + (item.id * 10),  // Precio inventado variable (porque tu array no tiene precio)
        images: [
           // Tu 'image' ("image1.jpg") pasa a ser un objeto con url
           // Usamos una imagen real de internet para que no salga rota
           { url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2" }
        ]
      };

      try {
        const response = await fetch(`${API_URL}/api/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log(`✅ Subido: ${payload.name}`);
            cont++;
        } else {
            console.error(`❌ Error subiendo ${payload.name}`);
        }
      } catch (e) {
        console.error("Error de red al subir producto");
      }
    }

    alert(`¡Proceso terminado! Se subieron ${cont} productos con éxito.`);
    fetchProducts(currentPage); // Recargar la tabla para verlos
  };

  return (
    <>
      <Header user={currentUser}/>
      <div className="app">
        <Sidebar />
        <main className="main-content">
          <div className="content">
            <div className="content-header">
              <AdminFilters/>
              <button className="add-button" onClick={openModal}>Agregar</button>
              
              <button 
                onClick={migrarDatos} 
                style={{
                    backgroundColor: '#ff9800',
                    color: 'white',
                    marginLeft: '10px',
                    padding: '10px 15px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}
              >
                ⚡ Migrar Datos
              </button>

              <AddHostal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingCabin(null); }}
                onSubmit={handleProductSubmit}
                editMode={!!editingCabin}
                initialData={editingCabin}
              />
            </div>

            <CabinTable
              cabins={cabins}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />

            {/* 3. AQUÍ PONEMOS EL COMPONENTE DE PAGINACIÓN */}
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                onFirst={() => setCurrentPage(1)}
                onPrevious={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                onNext={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            />

            <DeleteConfirmModal
              isOpen={isDeleteModalOpen}
              onConfirm={handleConfirmDelete}
              onCancel={handleCancelDelete}
              itemName={cabinToDelete?.name}
            />
          </div>
        </main> 
      </div>
    </>
  );
};

export default Admin;