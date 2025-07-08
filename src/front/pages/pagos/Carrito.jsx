import React, { useState } from 'react';
import useGlobalReducer from '../../hooks/useGlobalReducer';
import { Link, useNavigate } from 'react-router-dom';
import { calculateCartTotal } from '../../services/products';

export const Carrito = () => {
    const { store, dispatch } = useGlobalReducer();
    const { cartItems, token } = store;
    const navigate = useNavigate();
    const url = import.meta.env.VITE_BACKEND_URL;

    const [isRedirecting, setIsRedirecting] = useState(false);

    const handleProceedToCheckout = async () => {
        setIsRedirecting(true);
        const itemsToCheckout = cartItems.map(item => ({
            product_id: item.id,
            quantity: item.cantidad,
            stripe_price_id: item.stripe_price_id
        }));

        console.log(itemsToCheckout)
        try {
            const response = await fetch(`${url}/api/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.token}`
                },
                body: JSON.stringify(itemsToCheckout)
            });

            if (!response.ok) throw new Error('Error al crear la sesión de pago.');

            const session = await response.json();
            window.location.href = session.url;
        } catch (error) {
            console.error("Error al procesar el pago:", error);
            setIsRedirecting(false);
        }
    };

    const handleIncrement = (product) => dispatch({ type: 'ADD_TO_CART', payload: { product, quantity: 1 } });
    const handleDecrement = (productId) => dispatch({ type: 'DECREMENT_ITEM', payload: { productId } });
    const handleRemove = (productId) => dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
    const handleClearCart = () => dispatch({ type: 'RESET_CART' });

    if (cartItems.length === 0) {
        return (
            <div className="container my-5 text-center">
                <h2 className="mb-3 font-title">Tu Carrito Está Vacío</h2>
                <p className="lead">Parece que aún no has añadido ningún producto.</p>
                <Link to="/" className="btn btn-custom-submit mt-3">
                    Explorar Productos
                </Link>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <h2 className="mb-4 text-center font-title">Tu Carrito de Compras</h2>
            <div className="card shadow-sm rounded-4">
                <div className="card-body p-4">
                    {cartItems.map(item => (
                        <div key={item.id} className="row align-items-center mb-3 pb-3 border-bottom">
                            <div className="col-md-2 col-4">
                                <img
                                    src={item.images && item.images.length > 0 ? item.images[0].image_url : "https://via.placeholder.com/100x100"}
                                    alt={item.name}
                                    className="img-fluid rounded thumbnail-image"
                                />
                            </div>
                            <div className="col-md-4 col-8">
                                <h5 className="mb-1 font-title">{item.name}</h5>
                                <p className="text-muted mb-0">US$ {item.price.toFixed(2)}</p>
                            </div>
                            <div className="col-md-3 col-6 mt-3 mt-md-0 d-flex align-items-center justify-content-start justify-content-md-center">
                                <div className="input-group input-group-sm cart-product" >
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => handleDecrement(item.id)}
                                        disabled={item.cantidad <= 1}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="text"
                                        className="form-control text-center"
                                        value={item.cantidad}
                                        readOnly
                                    />
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => handleIncrement(item)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="col-md-2 col-6 mt-3 mt-md-0 text-md-end">
                                <p className="fw-bold mb-0">US$ {(item.price * item.cantidad).toFixed(2)}</p>
                            </div>
                            <div className="col-md-1 col-12 mt-3 mt-md-0 text-md-end">
                                <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => handleRemove(item.id)}
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="row mt-4">
                        <div className="col-md-6">
                            <button className="btn btn-outline-danger" onClick={handleClearCart}>
                                Vaciar Carrito
                            </button>
                        </div>
                        <div className="col-md-6 text-md-end text-center mt-3 mt-md-0">
                            <h4>Total: <span className="fw-bold">US$ {calculateCartTotal(cartItems).toFixed(2)}</span></h4>
                            <button
                                className="btn btn-custom-submit btn-lg mt-3"
                                onClick={handleProceedToCheckout}
                                disabled={isRedirecting}
                            >
                                {isRedirecting ? 'Procesando...' : 'Proceder al Pago'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};