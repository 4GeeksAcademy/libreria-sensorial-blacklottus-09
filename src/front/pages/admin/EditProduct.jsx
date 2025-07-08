import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useGlobalReducer from '../../hooks/useGlobalReducer';

export const EditProduct = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { store } = useGlobalReducer();
    const { token } = store;
    const url = import.meta.env.VITE_BACKEND_URL;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newImageFile, setNewImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${url}/api/products/${productId}`);
                if (!response.ok) throw new Error("Producto no encontrado.");
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId, url]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateProduct = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${url}/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.token}`
                },
                body: JSON.stringify(product)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.msg || "Error al actualizar el producto.");
            
            alert("¡Producto actualizado exitosamente!");
            navigate('/admin/products');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    const handleFileChange = (event) => {
        setNewImageFile(event.target.files[0]);
    };

    const handleImageUpload = async () => {
        if (!newImageFile) return;
        
        setIsUploading(true);
        const formData = new FormData();
        formData.append('image_file', newImageFile);
        formData.append('alt_text', `Imagen de ${product.name}`);

        try {
            const response = await fetch(`${url}/api/products/${productId}/images`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token.token}` },
                body: formData,
            });
            const newImage = await response.json();
            if (!response.ok) throw new Error(newImage.msg || "Error al subir imagen.");
            
            setProduct(prev => ({ ...prev, images: [...prev.images, newImage] }));
            setNewImageFile(null);
            document.getElementById('image-upload-input').value = ""; // Resetea el input file
        } catch (err) {
            alert(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteImage = async (imageId) => {
        if (!window.confirm("¿Seguro que quieres eliminar esta imagen?")) return;
        try {
            const response = await fetch(`${url}/api/images/${imageId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token.token}` }
            });
            if (!response.ok) throw new Error("No se pudo eliminar la imagen.");
            setProduct(prev => ({ ...prev, images: prev.images.filter(img => img.id !== imageId) }));
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <p>Cargando producto...</p>;
    if (error && !product) return <p className="alert alert-danger">{error}</p>;
    if (!product) return <p>No se encontró el producto.</p>;

    return (
        <div>
            <h1 className="font-title mb-4">Editar Producto (ID: {product.id})</h1>
            <form onSubmit={handleUpdateProduct}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nombre</label>
                    <input type="text" id="name" name="name" className="form-control" value={product.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Descripción</label>
                    <textarea id="description" name="description" className="form-control" value={product.description} onChange={handleChange} rows="5" required></textarea>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="price" className="form-label">Precio</label>
                        <input type="number" step="0.01" id="price" name="price" className="form-control" value={product.price} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="stock_quantity" className="form-label">Stock</label>
                        <input type="number" id="stock_quantity" name="stock_quantity" className="form-control" value={product.stock_quantity} onChange={handleChange} required />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="category_id" className="form-label">ID de Categoría</label>
                        <input type="number" id="category_id" name="category_id" className="form-control" value={product.category_id} onChange={handleChange} required />
                    </div>
                     <div className="col-md-6 mb-3">
                        <label htmlFor="stripe_price_id" className="form-label">ID de Precio de Stripe</label>
                        <input type="text" id="stripe_price_id" name="stripe_price_id" className="form-control" value={product.stripe_price_id || ''} onChange={handleChange} />
                    </div>
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mt-3 border-top pt-3">
                    <button type="submit" className="btn btn-custom-submit" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                    <Link to="/admin/products" className="btn btn-secondary ms-2">Cancelar</Link>
                </div>
            </form>
            <hr className="my-5" />
            <div className="mt-4">
                <h3 className="font-title mb-3">Gestionar Imágenes</h3>
                <div className="d-flex flex-wrap gap-3 mb-4">
                    {product.images.map(image => (
                        <div key={image.id} className="position-relative">
                            <img src={image.image_url} alt={image.alt_text} style={{height: '100px', width: '100px', objectFit: 'cover'}} className="rounded"/>
                            <button 
                                onClick={() => handleDeleteImage(image.id)} 
                                className="btn btn-sm btn-danger rounded-circle position-absolute top-0 end-0 d-flex align-items-center justify-content-center"
                                style={{transform: 'translate(25%, -25%)', width: '25px', height: '25px'}}
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
                <h5>Añadir Nueva Imagen</h5>
                <div className="input-group">
                    <input type="file" id="image-upload-input" className="form-control" onChange={handleFileChange} accept="image/*"/>
                    <button className="btn btn-outline-secondary" type="button" onClick={handleImageUpload} disabled={isUploading || !newImageFile}>
                        {isUploading ? 'Subiendo...' : 'Subir Imagen'}
                    </button>
                </div>
            </div>
        </div>
    );
};