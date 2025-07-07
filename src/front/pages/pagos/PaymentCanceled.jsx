import React from 'react';
import { Link } from 'react-router-dom';

export const PaymentCanceled = () => {
    return (
        <div className="container text-center py-5">
            <h2 className="font-title mb-3">Pago Cancelado</h2>
            <p className="lead">Tu proceso de pago fue cancelado. No se ha realizado ningún cargo.</p>
            <p>Puedes volver a tu carrito para intentarlo de nuevo o seguir explorando nuestros productos.</p>
            <div className="mt-4">
                <Link to="/carrito" className="btn btn-secondary me-3">Volver al Carrito</Link>
                <Link to="/kits" className="btn btn-custom-submit">Seguir Comprando</Link>
            </div>
        </div>
    );
};