import React, { useState, useEffect } from 'react';
import useGlobalReducer from '../../hooks/useGlobalReducer';

export const OrderHistory = () => {
    const { store } = useGlobalReducer();
    const { token } = store;
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const url = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${url}/api/orders`, {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("No se pudo obtener el historial de órdenes.");
                }

                const data = await response.json();
                setOrders(data);
                console.log(data)
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token, url]);

    if (loading) {
        return <p>Cargando tu historial de pedidos...</p>;
    }

    if (error) {
        return <p className="alert alert-danger">{error}</p>;
    }

    return (
        <div className='container my-5'>
            <h2 className="font-title mb-4 text-center text-terracota">Historial de Pedidos</h2>
            {orders.length === 0 ? (
                <p>Aún no has realizado ningún pedido.</p>
            ) : (
                <div className="accordion" id="ordersAccordion">
                    {orders.map((order, index) => (
                        <div key={order.id} className="accordion-item  ">
                            <h2 className="accordion-header " id={`heading${order.id}`}>
                                <button
                                    className={`accordion-button ${index === 0 ? 'active' : 'collapsed'}`}
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#collapse${order.id}`}
                                    aria-expanded={index === 0 ? 'true' : 'false'}
                                >
                                    <span className="fw-bold me-2">Pedido N.º {order.id}</span> - {new Date(order.order_date).toLocaleDateString()}
                                </button>
                            </h2>
                            <div
                                id={`collapse${order.id}`}
                                className={`accordion-collapse collapse   ${index === 0 ? 'show' : ''}`}
                                aria-labelledby={`heading${order.id}`}
                                data-bs-parent="#ordersAccordion"
                            >
                                <div className="accordion-body">
                                    <ul className="list-group list-group-flush">
                                        {order.items.map(item => (
                                            <li key={item.id} className="list-group-item d-flex justify-content-between">
                                                <span>{item.product.name} (x{item.quantity})</span>
                                                <span>Precio por unidad: US$ {(item.price_per_unit).toFixed(2)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="text-end fw-bold mt-3">
                                        Total: US$ {order.total_amount.toFixed(2)}
                                    </div>
                                    <div className="text-end text-muted mt-1">
                                        Estado: {order.status}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};