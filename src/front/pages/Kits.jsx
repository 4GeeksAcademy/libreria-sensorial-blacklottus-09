import React, { useState, useMemo } from 'react';
import useGlobalReducer from "../hooks/useGlobalReducer";
import { ProductCard } from "../components/ProductCard";
import { sortProducts } from '../services/products';

export const Kits = () => {
    const { store } = useGlobalReducer();
    const { products, loading } = store;

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('default');

    const displayedProducts = useMemo(() => {
        let filtered = [...products];

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(p => p.category?.name === selectedCategory);
        }

        return sortProducts(filtered, sortBy);

    }, [products, selectedCategory, sortBy]);

    const categories = useMemo(() =>
        ['All', ...new Set(products.map(p => p.category?.name).filter(Boolean))]
        , [products]);

    return (
        <div className="container py-2 background-focus">
            <h1 className="font-title text-center mb-2 text-terracota fw-bold">Selecciona tu próxima experiencia literaria</h1>
            <div className="row mb-4 align-items-center justify-content-between">
                <div className="col-md-4 d-flex align-items-center gap-2">
                    <label htmlFor="category-filter" className="form-label text-secondary fw-bold mb-0">Filtrar:</label>
                    <select id="category-filter" className="form-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div className="col-md-4 d-flex align-items-center gap-2">
                    <label htmlFor="sort-by" className="form-label text-secondary fw-bold mb-0">Ordenar:</label>
                    <select id="sort-by" className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="default">Por defecto</option>
                        <option value="price-asc">Precio: Menor a Mayor</option>
                        <option value="price-desc">Precio: Mayor a Menor</option>
                        <option value="name-asc">Nombre: A-Z</option>
                    </select>
                </div>
            </div>
            <div className="row">
                {loading ? (
                    <p className="text-center text-muted fs-5">Cargando experiencias literarias...</p>
                ) : displayedProducts.length > 0 ? (
                    displayedProducts.map((product) => (
                        <div key={product.id} className="col-lg-4 col-md-6 mb-4">
                            <ProductCard product={product} />
                        </div>
                    ))
                ) : (
                    <p className="text-center text-muted mt-5 fs-5">No encontramos experiencias literarias para tu selección.</p>
                )}
            </div>
        </div>
    );
};