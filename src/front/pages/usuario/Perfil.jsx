import React from 'react';

export const Perfil = () => {
    return (

        <div className="d-flex flex-column flex-shrink-0 p-3 bg-light side-bar-width" >
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <a href="#" className="nav-link active" aria-current="page">
                        <svg className="bi me-2 side-bar-item" >
                            <use xlinkHref="#home"></use>
                        </svg>
                        Home
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link link-dark">
                        <svg className="bi me-2 side-bar-item" >
                            <use xlinkHref="#speedometer2"></use>
                        </svg>
                        Dashboard
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link link-dark">
                        <svg className="bi me-2 side-bar-item" >
                            <use xlinkHref="#table"></use>
                        </svg>
                        Orders
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link link-dark">
                        {/* Placeholder for SVG icon */}
                        <svg className="bi me-2 side-bar-item" >
                            <use xlinkHref="#grid"></use>
                        </svg>
                        Products
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link link-dark">
                        <svg className="bi me-2 side-bar-item" >
                            <use xlinkHref="#people-circle"></use>
                        </svg>
                        Customers
                    </a>
                </li>
            </ul>

        </div>
    );
};