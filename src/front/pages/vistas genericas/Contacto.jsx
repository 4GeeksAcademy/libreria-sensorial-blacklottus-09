import React, { useState } from 'react';

export const Contacto = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const [submitMessage, setSubmitMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitMessage(null);
        setIsLoading(true);

        const url = import.meta.env.VITE_BACKEND_URL;

        try {
            const response = await fetch(`${url}/api/contact-form`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitMessage({ type: 'success', text: '¡Mensaje enviado con éxito!' });
                setFormData({ name: '', email: '', message: '' });
            } else {
                setSubmitMessage({ type: 'error', text: 'Hubo un error al enviar tu mensaje.' });
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            setSubmitMessage({ type: 'error', text: 'Error de conexión con el servidor.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container my-5">
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
                <div className="row g-0">
                    <div className="col-lg-5 d-none d-lg-block">
                        <img 
                            src="https://picsum.photos/800/1200" 
                            alt="Escena de lectura acogedora" 
                            className="img-fluid h-100" 
                        />
                    </div>
                    <div className="col-lg-7 p-4 p-md-5">
                        <h2 className="contact-title mb-4">Envíanos un mensaje</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label text-muted">Tu Nombre</label>
                                <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label text-muted">Tu Correo Electrónico</label>
                                <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="message" className="form-label text-muted">Mensaje</label>
                                <textarea className="form-control" id="message" name="message" rows="6" value={formData.message} onChange={handleChange} required></textarea>
                            </div>
                            <button type="submit" className="btn btn-custom-submit w-100" disabled={isLoading}>
                                {isLoading ? 'Enviando...' : 'Enviar Mensaje'}
                            </button>
                            
                            {submitMessage && (
                                <div className={`alert mt-3 ${submitMessage.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                                    {submitMessage.text}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};