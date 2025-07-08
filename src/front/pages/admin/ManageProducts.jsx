import React, { useState, useEffect } from 'react';
import useGlobalReducer from '../../hooks/useGlobalReducer';
import { Link } from 'react-router-dom';

export const ManageProducts = () => {
    const { store, dispatch } = useGlobalReducer();
    const { products, token } = store;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const url = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${url}/api/products`);
                if (!response.ok) {
                    throw new Error("No se pudieron cargar los productos.");
                }
                const data = await response.json();
                dispatch({ type: 'GET_PRODUCTS', payload: data });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [dispatch, url]); 

    const handleDelete = async (productId) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este producto?")) return;

        try {
            const response = await fetch(`${url}/api/products/${productId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("No se pudo eliminar el producto.");
            dispatch({ type: 'DELETE_PRODUCT', payload: { productId } });
        } catch (err) {
            setError(err.message);
        }
    };
    
    if (loading) {
        return <p className="text-center">Cargando productos...</p>;
    }
    
    if (error) {
        return <p className="alert alert-danger">{error}</p>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="font-title">Gestionar Productos</h1>
                <Link to="/admin/products/new" className="btn btn-custom-submit">+ Crear Nuevo</Link>
            </div>
            
            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Categoría</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>${(product.price).toFixed(2)}</td>
                                <td>{product.stock_quantity}</td>
                                <td>{product.category?.name || 'N/A'}</td>
                                <td>
                                    <Link to={`/admin/products/edit/${product.id}`} className="btn btn-sm btn-secondary me-2">Editar</Link>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(product.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {products.length === 0 && <p className="text-center text-muted mt-3">No hay productos para mostrar.</p>}
        </div>
    );
};