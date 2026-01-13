import React, { useState, useEffect } from 'react'; // <--- Importamos useEffect
import './style.css';
import Sidebar from '../../components/SideBar';
import Header from '../../components/AdminHeader';
import CabinTable from '../../components/CabinTable';
import AdminFilters from '../../components/AdminFilters';
import AddHostal from '../../components/AddHostal';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';

const Admin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cabinToDelete, setCabinToDelete] = useState(null);
  const [editingCabin, setEditingCabin] = useState(null);
  
  // Estado inicial vacío (se llenará desde el Backend)
  const [cabins, setCabins] = useState([]); 

  // URL de tu API (Asegúrate de tener VITE_API_URL en tu .env)
  const API_URL = import.meta.env.VITE_API_URL || 'https://waveheaven-backend.onrender.com';
  
  // Función para obtener el token (si usas login)
  const getToken = () => localStorage.getItem('token'); 

  // 1. CARGAR DATOS REALES AL INICIAR
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      if (response.ok) {
        const data = await response.json();
        setCabins(data.content || []); 
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

  // 2. BORRAR DATOS EN EL BACKEND
  const handleConfirmDelete = async () => {
    if (cabinToDelete) {
      try {
        const response = await fetch(`${API_URL}/api/products/${cabinToDelete.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${getToken()}` // Importante para permisos de Admin
          }
        });

        if (response.ok) {
          // Si se borró bien en BD, actualizamos la lista visual
          setCabins(prevCabins => prevCabins.filter(c => c.id !== cabinToDelete.id));
          console.log('Producto eliminado de la BD');
        } else {
          alert("Error al eliminar (¿Tienes permisos de Admin?)");
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
      
      setIsDeleteModalOpen(false);
      setCabinToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setCabinToDelete(null);
  };

  // 3. GUARDAR (CREAR O EDITAR) EN EL BACKEND
  const handleProductSubmit = async (productData) => {
    const token = getToken();
    
    // Preparar el cuerpo de la petición (Ajusta según lo que pide tu Backend Java)
    const productPayload = {
        name: productData.name,
        description: productData.description,
        // Tu backend espera un Category ID o nombre, ajusta esto:
        categoryId: 1, // <--- OJO: Necesitas enviar el ID real de la categoría, no el nombre 'montana'
        price: 100.00, // <--- Tu backend seguro pide precio, agrégalo si falta
        // images: productData.images (El manejo de imágenes suele requerir MultipartFile o URLs)
    };

    try {
        let response;
        if (editingCabin) {
            // EDITAR (PUT)
            response = await fetch(`${API_URL}/api/products/${editingCabin.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productPayload)
            });
        } else {
            // CREAR (POST)
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
            fetchProducts(); // Recargar la lista desde el servidor
            console.log('Guardado exitoso');
        } else {
            const errorText = await response.text();
            alert(`Error al guardar: ${errorText}`);
        }
    } catch (error) {
        console.error("Error de conexión al guardar:", error);
    }
  };

  const user = { name: 'Admin', email: 'admin@waveheaven.com' };

  return (
    <>
      <Header user={user}/>  
      <div className="app">
        <Sidebar />
        <main className="main-content">
          <div className="content">
            <div className="content-header">
              <AdminFilters/>
              <button className="add-button" onClick={openModal}>Agregar</button>
              
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