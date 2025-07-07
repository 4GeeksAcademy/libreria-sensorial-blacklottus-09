import React from 'react';

export const ProductCarousel = ({ images, carouselId = "product-carousel" }) => {
    if (!images || images.length === 0) return null

    return (
        <div id={carouselId} className="carousel slide m-2">
            <div className="carousel-indicators ">
                {images.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        data-bs-target={`#${carouselId}`}
                        data-bs-slide-to={index}
                        className={index === 0 ? "active" : ""}
                        aria-current={index === 0 ? "true" : "false"}
                        aria-label={`Slide ${index + 1}`}
                    />
                ))}
            </div>
            <div className="carousel-inner">
                {images.map((image, index) => (
                    <div
                        key={image.id || index}
                        className={`carousel-item ${index === 0 ? "active" : ""}`}
                    >
                        <img
                            src={image.image_url}
                            className="d-block w-100"
                            alt={image.alt_text}
                        />
                    </div>
                ))}
            </div>
            <button
                className="carousel-control-prev"
                type="button"
                data-bs-target={`#${carouselId}`}
                data-bs-slide="prev"
            >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Anterior</span>
            </button>
            <button
                className="carousel-control-next"
                type="button"
                data-bs-target={`#${carouselId}`}
                data-bs-slide="next"
            >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Siguiente</span>
            </button>
        </div>
    );
};