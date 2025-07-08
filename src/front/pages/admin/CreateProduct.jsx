import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useGlobalReducer from '../../hooks/useGlobalReducer';

const initialState = {
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category_id: '',
    stripe_price_id: ''
};

export const CreateProduct = () => {
    const navigate = useNavigate();
    const { store } = useGlobalReducer();
    const { token } = store;
    const url = import.meta.env.VITE_BACKEND_URL;

    const [productData, setProductData] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProductData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${url}/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.token}`
                },
                body: JSON.stringify(productData)
            });

            const newProduct = await response.json();
            if (!response.ok) {
                throw new Error(newProduct.msg || "Error al crear el producto.");
            }
            
            alert("¡Producto creado exitosamente! Ahora serás redirigido para añadir imágenes.");
            navigate(`/admin/products/edit/${newProduct.id}`); // Redirige a la página de edición

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="font-title mb-4">Crear Nuevo Producto</h1>
            <form onSubmit={handleSubmit} id="create-product-form">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nombre</label>
                    <input type="text" id="name" name="name" className="form-control" value={productData.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Descripción</label>
                    <textarea id="description" name="description" className="form-control" value={productData.description} onChange={handleChange} rows="5" required></textarea>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="price" className="form-label">Precio</label>
                        <input type="number" step="0.01" id="price" name="price" className="form-control" value={productData.price} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="stock_quantity" className="form-label">Stock</label>
                        <input type="number" id="stock_quantity" name="stock_quantity" className="form-control" value={productData.stock_quantity} onChange={handleChange} required />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="category_id" className="form-label">ID de Categoría</label>
                        <input type="number" id="category_id" name="category_id" className="form-control" value={productData.category_id} onChange={handleChange} required />
                    </div>
                     <div className="col-md-6 mb-3">
                        <label htmlFor="stripe_price_id" className="form-label">ID de Precio de Stripe (Opcional)</label>
                        <input type="text" id="stripe_price_id" name="stripe_price_id" className="form-control" value={productData.stripe_price_id} onChange={handleChange} />
                    </div>
                </div>
                
                {error && <div className="alert alert-danger">{error}</div>}

                <div className="mt-3">
                    <button type="submit" className="btn btn-custom-submit" disabled={loading}>
                        {loading ? 'Creando...' : 'Crear Producto y Continuar'}
                    </button>
                    <Link to="/admin/products" className="btn btn-secondary ms-2">Cancelar</Link>
                </div>
            </form>
        </div>
    );
};