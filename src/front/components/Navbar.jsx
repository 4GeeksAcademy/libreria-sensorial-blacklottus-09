import React from 'react';
import useGlobalReducer from '../hooks/useGlobalReducer';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';
import logo from '../assets/img/logo.png';

export const Navbar = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch({ type: "LOGOUT" });
        navigate("/");
    };

    const handleRemoveFromCart = (item) => {
        dispatch({ type: "REMOVE_FAVORITE", payload: item }); // Asumiendo que esta es la acción correcta
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-custom sticky-top pt-1">
            <div className="container">
                <Link className="navbar-brand-custom pb-3" to="/">
                    <img src={logo} className='logo-image' alt="Librería Sensorial Logo" />
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/kits">Kits de Experiencia</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/quienes-somos">Sobre Nosotros</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contactanos">Contactanos</Link>
                        </li>
                    </ul>
                </div>

                <div className="d-flex align-items-center">
                    <Link to="/busqueda" className="icon-link me-3">
                        <i className="fas fa-search"></i>
                    </Link>

                    {/* --- Carrito de Compras (Corregido) --- */}
                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn border-0 position-relative icon-link border-0 bg-transparent"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="fa-solid fa-cart-shopping"></i>
                            {store.totalItems > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                                    {store.totalItems}
                                    <span className="visually-hidden">items in cart</span>
                                </span>
                            )}
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><h6 className="dropdown-header">Carrito de Compras</h6></li>
                            <li><hr className="dropdown-divider" /></li>
                            {store.totalItems === 0 ? (
                                <li><span className="dropdown-item text-muted">El carrito está vacío.</span></li>
                            ) : (
                                store.items.map(item => (
                                    <li key={item.id} className="dropdown-item d-flex justify-content-between align-items-center">
                                        <span>{item.name} (x{item.quantity})</span>
                                        <button className="btn btn-sm btn-outline-danger border-0 p-0" onClick={() => handleRemoveFromCart(item)}>
                                            &times;
                                        </button>
                                    </li>
                                ))
                            )}
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                                <Link className="dropdown-item text-center" to="/cart">
                                    Ver Carrito Completo
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="dropdown">
                        <button className="icon-link border-0 bg-transparent" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="fas fa-user"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            {!store.token ? (
                                <>
                                    <li><Link className="dropdown-item" to="/iniciar-sesion">Iniciar Sesión</Link></li>
                                    <li><Link className="dropdown-item" to="/registro">Registrarse</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><h6 className="dropdown-header">Mi Cuenta</h6></li>
                                    <li><Link className="dropdown-item" to="/perfil">Mi Perfil</Link></li>
                                    <li><Link className="dropdown-item" to="/historial-de-compras">Mis Pedidos</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button className="dropdown-item" onClick={handleLogout}>
                                            Cerrar Sesión
                                        </button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};