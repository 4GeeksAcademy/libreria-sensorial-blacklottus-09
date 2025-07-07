import React from 'react';
import { Link } from 'react-router-dom';
import { ProductCarousel } from './ProductCarousel';

export const ProductCard = ({ product }) => {
    if (!product) return null;

    return (
        <div className="card h-100 border-0 shadow-sm rounded-1">
            <ProductCarousel 
                images={product.images}
                carouselId={`carousel-${product.id}`}
            />
            <div className="card-body d-flex flex-column text-center ">
                <h4 className="card-title font-title mb-1">{product.name}</h4>
                <p className="card-text fs-4 mt-1 mb-2 text-terracota fw-bold">{product.price} $</p>
                <p className="card-text small text-secondary">
                    {product.description?.substring(0, 80)}...
                </p>
                <Link to={`/products/${product.id}`} className="btn btn-custom-submit mt-auto">
                    Ver Detalles
                </Link>
            </div>
        </div>
    );
};