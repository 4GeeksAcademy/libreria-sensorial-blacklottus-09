import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const OlvidoContraseña = () => {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setIsLoading(true);

        const url = `${import.meta.env.VITE_BACKEND_URL}/api/forgot-password`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email }),
            });

            if (response.ok) {
                setSent(true);
            } else {
                const data = await response.json();
                setError(data.msg || "Ocurrió un error. Verifica el correo e inténtalo de nuevo.");
            }
        } catch (err) {
            setError("No se pudo conectar con el servidor.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center py-5" >
            <div className="card shadow-sm border-0 rounded-4 bg-white" >
                <div className="card-body p-4 p-md-5">

                    {!sent ? (
                        <>
                            <h2 className="contact-title text-center mb-3">Recuperar Contraseña</h2>
                            <p className="text-center text-muted mb-4">
                                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                            </p>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label text-muted">Correo electrónico:</label>
                                    <input
                                        type="email"
                                        placeholder="tucorreo@ejemplo.com"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        onChange={(event) => setEmail(event.target.value)}
                                        value={email}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                {error && <div className="alert alert-danger small p-2 mb-3">{error}</div>}

                                <button type="submit" className="btn btn-custom-submit w-100" disabled={isLoading}>
                                    {isLoading ? 'Enviando...' : 'Enviar Enlace'}
                                </button>
                            </form>
                            <div className="text-center mt-4">
                                <Link to="/iniciar-sesion" className="link-custom">Volver a Inicio de Sesión</Link>
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <i className="fas fa-envelope-open-text fa-3x mb-3" ></i>
                            <h2 className="contact-title mb-3">Revisa tu Correo</h2>
                            <p className="text-muted">
                                Si tu correo está en nuestro sistema, en breve recibirás un enlace para recuperar tu contraseña.
                            </p>
                            <Link to="/iniciar-sesion" className="btn btn-custom-submit mt-3">
                                Volver a Inicio de Sesión
                            </Link>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};