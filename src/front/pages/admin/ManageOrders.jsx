import React, { useState, useEffect } from 'react';
import useGlobalReducer from '../../hooks/useGlobalReducer';

export const ManageOrders = () => {
    const { store } = useGlobalReducer();
    const { token } = store;
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const url = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${url}/api/all-orders`, { // Llama al nuevo endpoint de admin
                    headers: { 'Authorization': `Bearer ${token.token}` }
                });
                if (!response.ok) throw new Error("Error al cargar las órdenes.");
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [token, url]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await fetch(`${url}/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) throw new Error("No se pudo actualizar el estado.");
            
            // Actualiza el estado local para reflejar el cambio en la UI al instante
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

        } catch (error) {
            console.error(error);
            alert("Error al actualizar el estado de la orden.");
        }
    };

    if (loading) return <p>Cargando órdenes...</p>;

    return (
        <div>
            <h1 className="font-title mb-4">Gestionar Órdenes</h1>
            <div className="accordion" id="ordersAccordion">
                {orders.map((order, index) => (
                    <div key={order.id} className="accordion-item">
                        <h2 className="accordion-header">
                            <button className={`accordion-button ${index !== 0 ? 'collapsed' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapseOrder${order.id}`}>
                                Pedido #{order.id} - <span className="fw-bold mx-2">{order.user.name}</span> - Total: ${order.total_amount.toFixed(2)}
                            </button>
                        </h2>
                        <div id={`collapseOrder${order.id}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} data-bs-parent="#ordersAccordion">
                            <div className="accordion-body">
                                <h5>Detalles del Pedido</h5>
                                <ul className="list-group list-group-flush mb-3">
                                    {order.items.map(item => (
                                        <li key={item.id} className="list-group-item d-flex justify-content-between">
                                            <span>{item.product.name} (x{item.quantity})</span>
                                            <span>${(item.price_per_unit * item.quantity).toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="d-flex align-items-center">
                                    <label htmlFor={`status-${order.id}`} className="form-label me-2 mb-0">Estado:</label>
                                    <select 
                                        id={`status-${order.id}`} 
                                        className="form-select form-select-sm" 
                                        style={{width: '150px'}}
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    >
                                        <option value="pending">Pendiente</option>
                                        <option value="shipped">Enviado</option>
                                        <option value="delivered">Entregado</option>
                                        <option value="cancelled">Cancelado</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};