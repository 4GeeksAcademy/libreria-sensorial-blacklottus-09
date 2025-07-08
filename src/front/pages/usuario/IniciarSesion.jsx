import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import useGlobalReducer from '../../hooks/useGlobalReducer';

const initialStateUser = {
    email: "",
    password: "",
};

export const IniciarSesion = () => {
    const [user, setUser] = useState(initialStateUser);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const { dispatch, store } = useGlobalReducer();
    const navigate = useNavigate();

    const handleChange = ({ target }) => {
        setUser({ ...user, [target.name]: target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage(null);
        setLoading(true);

        const url = import.meta.env.VITE_BACKEND_URL;

        try {
            const response = await fetch(`${url}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                dispatch({ type: "LOGIN", payload: { token: data.token, user: data.user } });
                console.log(store)
                setMessage({ type: 'success', text: "¡Inicio de sesión exitoso! Redirigiendo..." });

                if (data.user?.is_admin) {
                    setTimeout(() => navigate("/admin"), 1500);
                } else {
                    setTimeout(() => navigate("/"), 1500);
                }
            } else {
                setMessage({ type: 'error', text: data.msg || "Credenciales incorrectas." });
            }
        } catch (error) {
            console.error("Error en la solicitud de login:", error);
            setMessage({ type: 'error', text: "Error de conexión. Inténtalo de nuevo." });
        } finally {
            setLoading(false);
        }
    };

    if (store.token) {
        return <Navigate to={store.user?.is_admin ? "/admin" : "/"} replace />;
    }


    return (
        <div className="container my-5">
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
                <div className="row g-0">
                    <div className="col-lg-6 p-4 p-md-5">
                        <h2 className="contact-title mb-4">Bienvenida de Nuevo</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label text-muted">Correo Electrónico</label>
                                <input type="email" name="email" value={user.email} onChange={handleChange} className="form-control" required disabled={loading} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label text-muted">Contraseña</label>
                                <input type="password" name="password" value={user.password} onChange={handleChange} className="form-control" required disabled={loading} />
                            </div>

                            <div className="text-end mb-4">
                                <Link to="/olvido-su-contraseña" className="link-custom small">¿Olvidaste tu contraseña?</Link>
                            </div>

                            {message && (
                                <div className={`alert small p-2 mb-3 ${message.type === 'success' ? 'alert-custom-success' : 'alert-danger'}`}>
                                    {message.text}
                                </div>
                            )}

                            <button className="btn btn-custom-submit w-100" type="submit" disabled={loading}>
                                {loading ? "Iniciando Sesión..." : "Iniciar Sesión"}
                            </button>
                        </form>
                        <div className="text-center mt-4">
                            <span className="text-muted">¿No tienes una cuenta? </span>
                            <Link to="/registro" className="link-custom">Crea una aquí</Link>
                        </div>
                    </div>
                    <div className="col-lg-6 d-none d-lg-block">
                        <img
                            src="https://res.cloudinary.com/dpue1nnbe/image/upload/v1751917064/photo-1505330622279-bf7d7fc918f4_p4zljd.jpg"
                            alt="Banner relajante para acompañar el inicio de sesion"
                            className="img-fluid h-100 cover-fit"

                        />
                    </div>
                </div>
            </div>
        </div>
    );
};