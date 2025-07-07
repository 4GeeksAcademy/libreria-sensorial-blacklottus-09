import React from 'react';
import { StarsRating } from './StarsRating'; 

export const ProductDetails = ({ product, quantity, handleQuantityChange, handleAddToCart, title }) => {
    
    if (!product) {
        return null;
    }

    const maxQuantityToShow = Math.min(product.stock_quantity, 10);

    return (
        <div>
            <h1 className="font-title fs-3 mb-3">{title}</h1>
            
            <div className="d-flex align-items-center gap-2 mb-1">
                <span className="fs-5">{product.average_rating.toFixed(1)}</span>
                <StarsRating rating={product.average_rating} style="text-terracota" />
                <span className="text-muted">
                    ({product.reviews.length}{" "}
                    {product.reviews.length === 1 ? "reseña" : "reseñas"})
                </span>
            </div>

            <div className="d-flex align-items-start mb-2">
                <span className="fs-6">US$</span>
                <span className="fs-2 fw-normal lh-1">{Math.trunc(product.price)}</span>
                <span className="fs-6">
                    {Math.trunc((product.price - Math.trunc(product.price)) * 100)
                        .toString()
                        .padStart(2, "0")}
                </span>
            </div>

            <p className="mb-4 fs-6 text-secondary">{product.description}</p>

            <div className="mb-4">
                <label htmlFor="quantity-select" className="form-label fs-5">Cantidad:</label>
                <select
                    id="quantity-select"
                    className="form-select form-select-lg"
                    aria-label="Selector de cantidad"
                    value={quantity}
                    onChange={handleQuantityChange}
                >
                    {Array.from({ length: maxQuantityToShow }).map((_, index) => {
                        const quantity_selected = index + 1;
                        return (
                            <option key={quantity_selected} value={quantity_selected}>
                                {`${quantity_selected} ${quantity_selected === 1 ? "unidad" : "unidades"}`}
                            </option>
                        );
                    })}
                </select>
            </div>

            <button
                className="btn btn-custom-submit w-100 btn-lg"
                type="button"
                onClick={handleAddToCart}
            >
                Añadir al Carrito
            </button>
        </div>
    );
};