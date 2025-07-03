import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";

import '../index.css';

export const RecuperarContraseña = () => {
    const [newPass, setNewPass] = useState("");
    const [searchParams, _] = useSearchParams();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const url = import.meta.env.VITE_BACKEND_URL;

        const response = await fetch(`${url}/api/reset-password`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${searchParams.get("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "password": newPass }),
        });

        if (response.ok) {
            navigate("/iniciar-sesion");
        }
    };



    return (
        <div className="container d-flex align-items-center justify-content-center">
            <div className="card shadow-sm border-0 rounded-4 bg-white" >
                <div className="card-body p-4 p-md-5">
                    <h2 className="contact-title text-center mb-3">Restablecer Contraseña</h2>
                    <p className="text-center text-muted mb-4">
                        Ingresa tu nueva contraseña. Asegúrate de que sea segura.
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label text-muted">Nueva Contraseña:</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="form-control"
                                id="btnPassword"
                                name="password"
                                onChange={(event) => setNewPass(event.target.value)}
                                value={newPass}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-custom-submit w-100" >
                            Actualizar Contraseña
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
};