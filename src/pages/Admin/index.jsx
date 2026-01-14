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
  const [cabins, setCabins] = useState([]); 
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      if (response.ok) {
        const data = await response.json();
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
    
    // --- CORRECCIÓN FINAL ---
    // Si la URL es gigante (Base64 de tu PC), usamos una foto de internet para que no falle.
    // Si ya es un link corto, lo dejamos igual.
    const imageList = productData.images && productData.images.length > 0
        ? productData.images.map(img => ({ 
            url: img.url.length > 400 
                 ? "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1" // Foto genérica de cabaña
                 : img.url 
          })) 
        : [{ url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1" }];

    const productPayload = {
        name: productData.name,
        description: productData.description,
        categoryId: 1, 
        price: parseFloat(productData.price) || 100.0,
        images: imageList // Enviamos la lista corregida
    };

    console.log("Enviando payload seguro:", JSON.stringify(productPayload)); 

    try {
        let response;
        if (editingCabin) {
            // EDITAR
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
            console.log("¡GUARDADO CON ÉXITO!");
            fetchProducts(); 
            setIsModalOpen(false); 
            setEditingCabin(null);
        } else {
            const errorText = await response.text();
            console.error("Error Servidor:", errorText);
            alert(`Error: ${errorText}`);
        }
    } catch (error) {
        console.error("Error de red:", error);
        alert("Error de conexión.");
    }
  };
  const DATOS_VIEJOS = [
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
  const migrarDatos = async () => {
    const token = getToken();
    let cont = 0;

    if (!confirm("¿Estás seguro de que quieres subir todas estas cabañas a la Base de Datos?")) return;

    for (const item of DATOS_VIEJOS) {
      // 2. ADAPTAMOS LOS DATOS (El Backend es exigente)
      const payload = {
        // Mapeamos: nombre_viejo -> nombre_nuevo_backend
        name: item.title || item.name || "Cabaña sin nombre", 
        description: item.description || "Sin descripción",
        categoryId: 1, // Usamos la categoría 1 que ya creamos
        price: parseFloat(item.price) || 100.0,
        
        // Truco de la imagen segura que hicimos antes
        images: [{
           url: (item.image && item.image.startsWith('http')) 
                ? item.image 
                : "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1"
        }]
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
            console.log(`Cabaña "${payload.name}" subida con éxito.`);
            cont++;
        } else {
            console.error(`Error subiendo ${payload.name}`);
        }
      } catch (e) {
        console.error("Error de red");
      }
    }

    alert(`¡Proceso terminado! Se subieron ${cont} cabañas.`);
    fetchProducts(); // Recargar la tabla para verlas
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
              
              {/* Botón Normal que ya tenías */}
              <button className="add-button" onClick={openModal}>Agregar</button>
              
              {/* --- AQUÍ COMIENZA EL BOTÓN NUEVO --- */}
              <button 
                onClick={migrarDatos} 
                style={{
                    backgroundColor: '#ff9800', /* Naranja */
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
              {/* --- AQUÍ TERMINA EL BOTÓN NUEVO --- */}

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
}; // Fin del componente Admin

export default Admin;