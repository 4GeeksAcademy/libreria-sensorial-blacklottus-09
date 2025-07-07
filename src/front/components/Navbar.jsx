import React from 'react';
import useGlobalReducer from '../hooks/useGlobalReducer';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';
import logo from '../assets/img/logo.png';

export const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const totalItemsInCart = store.cartItems.reduce((total, item) => total + item.cantidad, 0);

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch({ type: "LOGOUT" });
        navigate("/");
    };

    const handleRemoveFromCartDropdown = (itemToRemove) => {
        dispatch({ type: "REMOVE_ITEM", payload: { productId: itemToRemove.id } });
    };
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/busqueda?q=${searchQuery}`);
            setSearchQuery('');
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-custom sticky-top pt-1">
            <div className="container">
                <Link className="navbar-brand-custom pb-3 pb-lg-0" to="/">
                    <img src={logo} className='logo-image' alt="Librería Sensorial Logo" />
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className=" collapse navbar-collapse " id="navbarNav">
                    <form className=" d-flex input-group input-group-lg my-lg-auto mb-4" onSubmit={handleSearchSubmit}>
                        <input
                            type="search"
                            className="form-control ms-lg-5 "
                            placeholder="Buscar productos..."
                            aria-label="Buscar"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                        />
                        <button className="btn terracota me-lg-5" type="submit">
                            <i className="fas fa-search fa-lg"></i>
                        </button>
                    </form>
                </div>
                <div className="d-flex align-items-center ">
                    <div className="btn-group me-3 m-auto ">
                        <button
                            type="button"
                            className="btn border-0 position-relative icon-link bg-transparent p-0"
                            data-bs-toggle="dropdown"
                            data-bs-display="static"
                            aria-expanded="false"
                        >
                            <i className="fa-solid fa-cart-shopping fa-lg"></i>
                            {totalItemsInCart > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill terracota ">
                                    {totalItemsInCart}{" "}
                                    <span className="visually-hidden">items in cart</span>
                                </span>
                            )}
                        </button>

                        <ul className="dropdown-menu dropdown-menu-lg-end p-2" >
                            <li>
                                <h6 className="dropdown-header text-center">Carrito de Compras</h6>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            {store.cartItems.length === 0 ? (
                                <li className="px-3 py-2">
                                    <span className="dropdown-item-text text-muted">
                                        Aún no hay artículos en el carrito.
                                    </span>
                                </li>
                            ) : (
                                <>
                                    {store.cartItems.map(item => (
                                        <li key={item.id} className="dropdown-item d-flex align-items-center mb-2 px-3 py-2">
                                            <img
                                                src={item.images && item.images.length > 0 ? item.images[0].image_url : "https://via.placeholder.com/50x50?text=No+Img"}
                                                alt={item.name}
                                                className="img-thumbnail me-2 cart-image"
                                            />
                                            <div className="flex-grow-1">
                                                <p className="mb-0 fw-bold text-truncate">{item.name}</p>
                                                <small className="text-muted">
                                                    <b>{item.cantidad} x US$ {item.price.toFixed(2)}</b>
                                                </small>
                                            </div>
                                            <button
                                                className="btn btn-sm btn-outline-danger border-0 px-2 ms-2"
                                                onClick={() => handleRemoveFromCartDropdown(item)}
                                                aria-label={`Eliminar ${item.name}`}
                                            >
                                                &times;
                                            </button>
                                        </li>
                                    ))}
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li className="px-3 py-2 text-end">
                                        <p className="mb-0 fs-5">Total: <span className="fw-bold">US$ {store.cartItems.reduce((acc, item) => acc + item.price * item.cantidad, 0).toFixed(2)}</span></p>
                                    </li>
                                </>
                            )}
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                                <Link className="dropdown-item text-center btn btn-primary mt-2" to="/carrito">
                                    Ver Carrito Completo
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="dropdown">
                        <button 
                        className="icon-link border-0 bg-transparent" 
                        type="button" 
                        data-bs-display="static"
                        data-bs-toggle="dropdown" 
                        aria-expanded="false"
                        >
                            <i className="fas fa-user fa-lg"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-lg-end">
                            {!store.token ? (
                                <>
                                    <li><Link className="dropdown-item" to="/iniciar-sesion">Iniciar Sesión</Link></li>
                                    <li><Link className="dropdown-item" to="/registro">Registrarse</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><h6 className="dropdown-header">Mi Cuenta</h6></li>
                                    {/* <li><Link className="dropdown-item" to="/perfil">Mi Perfil</Link></li> */}
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
        </nav >
    );
};