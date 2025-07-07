import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { ProductCard } from "../components/ProductCard.jsx";

export const Home = () => {

    const { store, dispatch } = useGlobalReducer()
    const { products } = store

    return (
        <div className="body-custom-bg">
            <div className="position-relative text-center text-white">
                <img
                    src="https://res.cloudinary.com/dpue1nnbe/image/upload/v1751888448/Gemini_Generated_Image_dtb7cidtb7cidtb7_vgnckj.png"
                    alt="Una colección de libros antiguos"
                    className="img-fluid w-100 banner"
                />
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center banner" >
                    <h1 className="display-3 fw-bold contact-title text-white">
                        Más que un libro, una experiencia
                    </h1>
                    <p className="lead my-3">
                        Sumérgete en nuevas historias con todos tus sentidos.
                    </p>
                    <Link to="/kits" className="btn btn-custom-submit btn-lg">
                        Explorar Kits
                    </Link>
                </div>
            </div>

            <div className="container text-center my-5 py-5">
                <h2 className="contact-title mb-5">Una Experiencia Sensorial en 3 Pasos</h2>
                <div className="row">
                    <div className="col-md-4 mb-4">
                        <i className="fas fa-book-open fa-3x mb-3 text-terracota"></i>
                        <h3 className="h4 contact-title">1. Elige tu Aventura</h3>
                        <p className="text-muted">Selecciona un kit basado en el género o la sensación que buscas.</p>
                    </div>
                    <div className="col-md-4 mb-4">
                        <i className="fas fa-box-open fa-3x mb-3 text-terracota"></i>
                        <h3 className="h4 contact-title">2. Recíbelo en tu Puerta</h3>
                        <p className="text-muted">Preparamos tu caja con todos los elementos cuidadosamente seleccionados.</p>
                    </div>
                    <div className="col-md-4 mb-4">
                        <i className="fas fa-mug-hot fa-3x mb-3 text-terracota"></i>
                        <h3 className="h4 contact-title">3. Desconecta y Disfruta</h3>
                        <p className="text-muted">Prepara tu bebida, pon la música y déjate llevar por la lectura.</p>
                    </div>
                </div>
            </div>

            <div className="py-5 background-focus" >
                <div className="container">
                    <h2 className="contact-title text-center mb-5">Algunos de Nuestros Kits</h2>
                    <div className="row">
                        {products.slice(0, 4).map((product) => (
                            <div key={product.id} className="col-lg-3 col-md-6 mb-4">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container my-5 py-5">
                <div className="row align-items-center">
                    <div className="col-lg-6 mb-4 mb-lg-0">
                        <img src="https://picsum.photos/500/200" className="img-fluid rounded-4 shadow" alt="Rincón de lectura acogedor" />
                    </div>
                    <div className="col-lg-6 ps-lg-5">
                        <h2 className="contact-title mb-3">Una Invitación a la Pausa</h2>
                        <p className="text-muted">
                            En un mundo que se mueve a toda velocidad, "Librería Sensorial" nace como una invitación a la pausa. Creemos que la lectura es más que un pasatiempo; es un ritual, una forma de reconectar con nosotros mismos y con las historias de una manera más profunda y significativa.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};