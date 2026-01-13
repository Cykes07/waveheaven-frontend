import React, { useState, useEffect } from 'react';
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
  
  // 1. Estado para las cabañas (VACÍO al inicio, se llena con la API)
  const [cabins, setCabins] = useState([]); 

  // Configuración de API y Token
  const API_URL = import.meta.env.VITE_API_URL || 'https://waveheaven-backend.onrender.com';
  const getToken = () => localStorage.getItem('jwt_token'); 

  // 2. Obtener Usuario Real (Esto arregla el problema de "John Doue")
  const getRealUser = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      return {
        name: `${parsed.firstName} ${parsed.lastName}`,
        email: parsed.email
      };
    }
    return { name: 'Admin', email: 'admin@waveheaven.com' };
  };
  const currentUser = getRealUser();

  // 3. Cargar datos al iniciar
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      if (response.ok) {
        const data = await response.json();
        // IMPORTANTE: Si es paginado, tomamos .content. Si es lista, data.
        setCabins(data.content || data || []); 
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

  // 4. Borrar Producto Real
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
          setCabins(prev => prev.filter(c => c.id !== cabinToDelete.id));
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
    
    const productPayload = {
        name: productData.name,
        description: productData.description,
        categoryId: 1, 
        price: parseFloat(productData.price) || 100.0,
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
            // CREAR
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
            fetchProducts(); 
            setIsModalOpen(false);
            setEditingCabin(null);
        } else {
            const errorText = await response.text();
            alert(`Error al guardar: ${errorText}`);
        }
    } catch (error) {
        console.error("Error:", error);
    }
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