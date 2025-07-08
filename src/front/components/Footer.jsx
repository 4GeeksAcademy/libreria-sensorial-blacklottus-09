import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css';

export const Footer = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setSubmitMessage('');

        const url = import.meta.env.VITE_BACKEND_URL;

        try {
            const response = await fetch(`${url}/api/newsletter`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email })
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitMessage({ type: 'success', text: data.msg || `¡Gracias por suscribirte!` });
                setEmail('');
            } else {
                setSubmitMessage({ type: 'error', text: data.msg || 'Hubo un error con la suscripción.' });
            }
        } catch (error) {
            console.error("Error al enviar la suscripción:", error);
            setSubmitMessage({ type: 'error', text: 'No se pudo conectar con el servidor.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <footer className="footer-custom">
            <div className="container py-5">
                <div className="row">
                    <div className="col-lg-4 mb-4 mb-lg-0">
                        <h5 className="footer-brand-title">Librería Sensorial</h5>
                        <p className="footer-text">
                            Despertando historias, un sentido a la vez. Kits de lectura inmersiva para tu momento de pausa.
                        </p>
                        <div className="social-icons mt-4">
                            <a href="#" className="social-link me-3"><i className="fab fa-instagram"></i></a>
                            <a href="#" className="social-link me-3"><i className="fab fa-pinterest-p"></i></a>
                            <a href="#" className="social-link"><i className="fab fa-facebook-f"></i></a>
                        </div>
                    </div>

                    <div className="col-6 col-lg-2 mb-3">
                        <h5 className="footer-heading">Explorar</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2"><Link to="/kits" className="footer-link">Kits</Link></li>
                            <li className="mb-2"><Link to="/quienes-somos" className="footer-link">Sobre Nosotros</Link></li>
                            <li className="mb-2"><Link to="/contactanos" className="footer-link">Contacto</Link></li>
                        </ul>
                    </div>

                    <div className="col-6 col-lg-2 mb-3">
                        <h5 className="footer-heading">Soporte</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2"><Link to="/preguntas-frecuentes" className="footer-link">Preguntas Frecuentes</Link></li>
                            <li className="mb-2"><Link to="/politica-cancelacion" className="footer-link">Envíos y Devoluciones</Link></li>
                            <li className="mb-2"><Link to="/terminos-condiciones" className="footer-link">Términos y Condiciones</Link></li>
                            <li className="mb-2"><Link to="/politica-privacidad" className="footer-link">Política de Privacidad</Link></li>
                        </ul>
                    </div>

                    <div className="col-lg-4 mb-3">
                        <h5 className="footer-heading">Únete al Club</h5>
                        <p className="footer-text">Recibe novedades, lanzamientos exclusivos y recomendaciones literarias cada mes.</p>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <input
                                    type="email"
                                    className="form-control newsletter-input"
                                    placeholder="Tu correo electrónico"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                                <button className="btn btn-custom-accent" type="submit" disabled={isLoading}>
                                    {isLoading ? 'Enviando...' : 'Suscribirse'}
                                </button>
                            </div>
                            {submitMessage && (
                                <div className={`mt-2 small ${submitMessage.type === 'success' ? 'text-white' : 'text-danger'}`}>
                                    {submitMessage.text}
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                <div className="d-flex justify-content-center pt-4 mt-4 border-top-custom">
                    <p className="footer-text">&copy; {new Date().getFullYear()} Librería Sensorial. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};