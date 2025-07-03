import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
    return (
        <div className="d-flex align-items-center justify-content-center vh-100 body-custom-bg">
            <div className="text-center">
                <h1 className="display-1 fw-bold contact-title" style={{ fontSize: '8rem' }}>404</h1>
                <p className="fs-3">
                    Página no encontrada
                </p>
                <p className="lead text-muted">
                    Lo sentimos, la página que estás buscando no existe o fue movida.
                </p>
                <Link to="/" className="btn btn-custom-submit mt-3">
                    Volver al Inicio
                </Link>
            </div>
        </div>
    );
};