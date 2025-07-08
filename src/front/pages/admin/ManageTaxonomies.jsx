import React, { useState, useEffect } from 'react';
import useGlobalReducer from '../../hooks/useGlobalReducer';

export const ManageTaxonomies = () => {
    const { store } = useGlobalReducer();
    const { token } = store;
    const url = import.meta.env.VITE_BACKEND_URL;

    const [activeTab, setActiveTab] = useState('categories'); // 'categories' o 'tags'
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newItemName, setNewItemName] = useState('');
    const [editingItem, setEditingItem] = useState(null); // Guarda el item que se está editando

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            const endpoint = activeTab === 'categories' ? '/api/categories' : '/api/tags';
            try {
                const response = await fetch(`${url}${endpoint}`);
                const data = await response.json();
                setItems(response.ok ? data : []);
            } catch (error) {
                console.error(`Error fetching ${activeTab}:`, error);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, [activeTab, token, url]);

    const handleCreate = async (e) => {
        e.preventDefault();
        const endpoint = activeTab === 'categories' ? '/api/categories' : '/api/tags';
        try {
            const response = await fetch(`${url}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token.token}` },
                body: JSON.stringify({ name: newItemName })
            });
            const newItem = await response.json();
            if (!response.ok) throw new Error(newItem.msg || "Error al crear.");
            setItems([...items, newItem]);
            setNewItemName('');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = async (itemId) => {
        if (!window.confirm("¿Estás seguro?")) return;
        const endpoint = activeTab === 'categories' ? `/api/categories/${itemId}` : `/api/tags/${itemId}`;
        try {
            const response = await fetch(`${url}${endpoint}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token.token}` }
            });
            if (!response.ok) throw new Error("Error al eliminar.");
            setItems(items.filter(item => item.id !== itemId));
        } catch (error) {
            alert(error.message);
        }
    };
    
    const handleUpdate = async () => {
        const endpoint = activeTab === 'categories' ? `/api/categories/${editingItem.id}` : `/api/tags/${editingItem.id}`;
        try {
            const response = await fetch(`${url}${endpoint}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token.token}` },
                body: JSON.stringify({ name: editingItem.name })
            });
            const updatedItem = await response.json();
            if (!response.ok) throw new Error(updatedItem.msg || "Error al actualizar.");
            setItems(items.map(item => item.id === editingItem.id ? updatedItem : item));
            setEditingItem(null); // Termina el modo de edición
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div>
            <h1 className="font-title mb-4">Gestionar Categorías y Etiquetas</h1>

            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>Categorías</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'tags' ? 'active' : ''}`} onClick={() => setActiveTab('tags')}>Etiquetas</button>
                </li>
            </ul>

            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                    <h5 className="card-title">Añadir Nueva {activeTab === 'categories' ? 'Categoría' : 'Etiqueta'}</h5>
                    <form onSubmit={handleCreate} className="d-flex gap-2">
                        <input type="text" className="form-control" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="Nombre..." required />
                        <button type="submit" className="btn btn-custom-submit">Añadir</button>
                    </form>
                </div>
            </div>

            {loading ? <p>Cargando...</p> : (
                <ul className="list-group">
                    {items.map(item => (
                        <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                            {editingItem?.id === item.id ? (
                                <>
                                    <input type="text" className="form-control me-2" value={editingItem.name} onChange={(e) => setEditingItem({...editingItem, name: e.target.value})} />
                                    <div>
                                        <button className="btn btn-success btn-sm me-2" onClick={handleUpdate}>Guardar</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => setEditingItem(null)}>Cancelar</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {item.name}
                                    <div>
                                        <button className="btn btn-secondary btn-sm me-2" onClick={() => setEditingItem(item)}>Editar</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Eliminar</button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};