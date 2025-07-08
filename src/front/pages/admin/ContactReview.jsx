import React, { useState, useEffect } from 'react';
import useGlobalReducer from '../../hooks/useGlobalReducer';

export const ContactReview = () => {
    const { store } = useGlobalReducer();
    const { token } = store;
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const url = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`${url}/api/contact-form`, {
                    headers: { 'Authorization': `Bearer ${token.token}` }
                });
                if (!response.ok) throw new Error("Error al cargar los mensajes.");
                const data = await response.json();
                setMessages(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, [token, url]);

    if (loading) return <p>Cargando mensajes...</p>;

    return (
        <div>
            <h1 className="font-title mb-4">Bandeja de Entrada de Contacto</h1>
            {messages.length === 0 ? (
                <p>No hay mensajes para mostrar.</p>
            ) : (
                <div className="accordion" id="contactMessagesAccordion">
                    {messages.map((msg, index) => (
                        <div key={msg.id} className="accordion-item">
                            <h2 className="accordion-header">
                                <button 
                                    className={`accordion-button ${index !== 0 ? 'collapsed' : ''}`} 
                                    type="button" 
                                    data-bs-toggle="collapse" 
                                    data-bs-target={`#collapse${msg.id}`}
                                >
                                    <span className="fw-bold me-2">De: {msg.name}</span> ({msg.email})
                                </button>
                            </h2>
                            <div 
                                id={`collapse${msg.id}`} 
                                className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} 
                                data-bs-parent="#contactMessagesAccordion"
                            >
                                <div className="accordion-body">
                                    <p>{msg.message}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};