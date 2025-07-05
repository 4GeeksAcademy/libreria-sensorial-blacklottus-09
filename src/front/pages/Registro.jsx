import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const initialStateUser = {
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
};

export const Registro = () => {
    const [user, setUser] = useState(initialStateUser);
    const [avatarFile, setAvatarFile] = useState(null)
    const [registered, setRegistered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (registered) {
            const timer = setTimeout(() => {
                navigate("/iniciar-sesion");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [registered, navigate]);

    const handleChange = ({ target }) => {
        setUser({ ...user, [target.name]: target.value });
    };

    const handleFileChange = (event) => {
        setAvatarFile(event.target.files[0]);
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (user.password !== user.confirmPassword) {
            setErrorMsg("Las contraseñas no coinciden.");
            return;
        }

        setIsLoading(true);
        setErrorMsg("");

        const formData = new FormData();
        formData.append("name", user.name);
        formData.append("email", user.email);
        formData.append("password", user.password);
        if(avatarFile){
            formData.append("avatar",avatarFile)
        }

        const url = import.meta.env.VITE_BACKEND_URL;

        try {
            const response = await fetch(`${url}/api/register`, {
                method: "POST",
                body: formData,
            });

            if (response.status === 201 || response.status === 200) {
                setUser(initialStateUser);
                setRegistered(true);
            } else {
                const data = await response.json();
                setErrorMsg(data.msg || "El usuario ya existe o los datos son inválidos.");
            }
        } catch (error) {
            setErrorMsg("Error de red o del servidor. Inténtalo de nuevo.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container my-5">
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
                <div className="row g-0">
                    <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center position-relative" style={{ backgroundColor: '#4A4441' }}>
                        <img
                            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1887"
                            alt="Estantería llena de libros"
                            className="img-fluid h-100"
                            style={{ objectFit: 'cover', opacity: '0.4' }}
                        />
                        <div className="position-absolute text-center p-5">
                            <h2 className="display-5 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Comienza tu próxima aventura literaria
                            </h2>
                        </div>
                    </div>

                    <div className="col-lg-6 p-4 p-md-5">
                        <h2 className="contact-title mb-4">Crea tu cuenta</h2>

                        {registered && (
                            <div className="alert alert-custom-success text-center">
                                ¡Usuario creado exitosamente! Serás redirigido al login...
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label text-muted">Nombre Completo</label>
                                <input type="text" name="name" value={user.name} onChange={handleChange} className="form-control" required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label text-muted">Correo Electrónico</label>
                                <input type="email" name="email" value={user.email} onChange={handleChange} className="form-control" required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="form-label text-muted">Contraseña</label>
                                <input type="password" name="password" value={user.password} onChange={handleChange} className="form-control" required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="form-label text-muted">Verificar contraseña</label>
                                <input type="password" name="confirmPassword" value={user.confirmPassword} onChange={handleChange} className="form-control" required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="avatar" className="form-label text-muted">Avatar (Opcional)</label>
                                <input 
                                    type="file" 
                                    name="avatar" 
                                    onChange={handleFileChange} 
                                    className="form-control" 
                                    accept="image/*" 
                                />
                            </div>

                            {errorMsg && <div className="alert alert-danger small p-2 mb-3">{errorMsg}</div>}

                            <button className="btn btn-custom-submit w-100" type="submit" disabled={isLoading}>
                                {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                            </button>
                        </form>
                        <div className="text-center mt-4">
                            <span className="text-muted">¿Ya tienes una cuenta? </span>
                            <Link to="/iniciar-sesion" className="link-custom">Inicia sesión aquí</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};