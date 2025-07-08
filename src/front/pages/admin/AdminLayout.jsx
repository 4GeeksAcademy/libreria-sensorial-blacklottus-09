import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export const AdminLayout = () => {
    return (
        <div className="container-fluid">
            <div className="row">
                <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar vh-100 border-end">
                    <div className="position-sticky pt-3">
                        <h4 className="px-3 font-title">Panel Admin</h4>
                        <ul className="nav flex-column mt-3">
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/admin" end>Dashboard</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/admin/products">Productos</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/admin/orders">Órdenes</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/admin/users">Usuarios</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/admin/contact">Mensajes</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/admin/taxonomies">Categorías y Tags</NavLink>
                            </li>
                        </ul>
                    </div>
                </nav>

                <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                    <div className="pt-3">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};