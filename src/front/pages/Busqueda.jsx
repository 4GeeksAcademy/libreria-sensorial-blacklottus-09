import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';

export const Busqueda = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const url = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        if (query) {
            const fetchSearchResults = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await fetch(`${url}/api/products/search?q=${query}`);
                    if (!response.ok) {
                        throw new Error('La respuesta del servidor no fue exitosa');
                    }
                    const data = await response.json();
                    setResults(data);
                } catch (err) {
                    setError('No se pudo realizar la búsqueda. Inténtalo de nuevo.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchSearchResults();
        } else {
            setResults([]);
        }
    }, [query]);

    return (
        // Fondo principal de la vista
        <div className="container py-5 background-focus">
            {/* Título principal con la fuente 'Playfair Display' */}
            <h1 className="font-title text-center mb-5">Resultados de Búsqueda para: "{query}"</h1>

            {loading && <p className="text-center">Buscando...</p>}
            {error && <p className="alert alert-danger">{error}</p>}

            {!loading && !error && (
                results.length > 0 ? (
                    <div className="row">
                        {results.map(product => (
                            <div key={product.id} className="col-lg-3 col-md-6 mb-4">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                ) : (
                    query && <p className="text-center mt-4">No se encontraron resultados para "{query}".</p>
                )
            )}
        </div>
    );
};