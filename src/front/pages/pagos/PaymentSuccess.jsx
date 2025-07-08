import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import useGlobalReducer from '../../hooks/useGlobalReducer';
import { ProductCard } from '../../components/ProductCard';

export const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const { store, dispatch } = useGlobalReducer();
    const [status, setStatus] = useState('processing')
    const [order, setOrder] = useState(null);
    ;
    const url = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        if (sessionId) {
            const verifyPayment = async () => {
                try {
                    const response = await fetch(`${url}/api/order/success`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${store.token.token}`
                        },
                        body: JSON.stringify({ session_id: sessionId })
                    });

                    if (!response.ok) throw new Error("La verificación del pago falló.");
                    const orderData = await response.json();
                    setOrder(orderData);

                    setStatus('success');
                    dispatch({ type: 'RESET_CART' });
                } catch (error) {
                    console.error(error);
                    setStatus('error');
                }
            };
            verifyPayment();
        } else {
            setStatus('error');
        }
    }, [sessionId, dispatch, store.token.token, url]);

    if (status === 'processing') {
        return <div className="text-center py-5"><h2>Verificando tu pago...</h2></div>;
    }

    if (status === 'error') {
        return (
            <div className="text-center py-5">
                <h2 className="text-danger">Hubo un error al procesar tu orden</h2>
                <Link to="/" className="btn btn-primary">Volver al Inicio</Link>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h2 className="text-success font-title">¡Gracias por tu compra!</h2>
                <p className="lead">Este es el resumen de tu pedido N.º {order?.id}.</p>
            </div>

            {order && (
                <div className="row justify-content-center">
                    {order.items.map(item => (
                        <div key={item.id} className="col-lg-4 col-md-6 mb-4">
                            <ProductCard product={item.product} />
                        </div>
                    ))}
                </div>
            )}

            <div className="text-center mt-5">
                <Link to="/profile" className="btn btn-custom-submit">Ver Historial de Pedidos</Link>
            </div>
        </div>
    );
};