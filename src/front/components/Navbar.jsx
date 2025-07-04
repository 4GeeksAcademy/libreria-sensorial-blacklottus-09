import React from 'react';
import useGlobalReducer from '../hooks/useGlobalReducer';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/navbar.css'
import  logo from '../assets/img/logo.png'


export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const navigate = useNavigate();

	const handleLogout = () => {
		dispatch({ type: "LOGOUT" });
		navigate("/");
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-custom sticky-top">
			<div className="container">
				<Link className="navbar-brand-custom" to="/">
				<img src={logo} className='logo-image'/>
					Librería Sensorial
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
					<Link to="/busqueda" className="icon-link">
						<i className="fas fa-search"></i>
					</Link>

					<Link to="/carrito" className="icon-link position-relative">
						<i className="fas fa-shopping-cart"></i>
						{store.totalItems > 0 && (
							<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-accent">
								{store.totalItems}
								<span className="visually-hidden">items in cart</span>
							</span>
						)}
					</Link>

					<div className="dropdown">
						<button className="icon-link border-0 bg-transparent" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
							<i className="fas fa-user"></i>
						</button>
						<ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
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