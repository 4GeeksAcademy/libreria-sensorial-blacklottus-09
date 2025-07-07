import React from 'react';
import { Link } from 'react-router-dom';

export const QuienesSomos = () => {
    return (
        <div className="body-custom-bg">
           
            <div className="container-fluid p-0">
                <div className="position-relative">
                    <img 
                        src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070" 
                        alt="Una colección de libros antiguos y bien cuidados" 
                        className="img-fluid w-100"
                        style={{ height: '50vh', objectFit: 'cover' }}
                    />
                    <div 
                        className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                        <h1 className="display-4 fw-bold text-white text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Creemos en el poder de las historias
                        </h1>
                    </div>
                </div>
            </div>

           
            <div className="container my-5 py-5 text-center">
                <h2 className="contact-title mb-4">Nuestra Filosofía</h2>
                <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
                    En un mundo que se mueve a toda velocidad, "Librería Sensorial" nace como una invitación a la pausa. Creemos que la lectura es más que un pasatiempo; es un ritual, una forma de reconectar con nosotros mismos a través de los sentidos.
                </p>
            </div>

            <hr className="w-50 mx-auto" />

            <div className="container my-5 py-5">
                <h2 className="contact-title text-center mb-5">Una Experiencia para Cada Sentido</h2>
                <div className="row text-center">
                    <div className="col-md-3">
                        <h3 className="h4 contact-title">Vista</h3>
                        <p className="text-muted">Desde la belleza de las portadas hasta la cuidada selección de cada objeto que compone nuestros kits.</p>
                    </div>
                    <div className="col-md-3">
                        <h3 className="h4 contact-title">Olfato</h3>
                        <p className="text-muted">Aromas que te transportan. Velas, inciensos o esencias que construyen la atmósfera perfecta para cada relato.</p>
                    </div>
                    <div className="col-md-3">
                        <h3 className="h4 contact-title">Gusto</h3>
                        <p className="text-muted">Recetas de tés, cafés o cócteles especialmente seleccionadas para maridar con la trama de tu libro.</p>
                    </div>
                    <div className="col-md-3">
                        <h3 className="h4 contact-title">Oído</h3>
                        <p className="text-muted">Listas de reproducción musicales curadas para ser la banda sonora de tu aventura literaria.</p>
                    </div>
                </div>
            </div>

            <div className="py-5 change-color-focus" >
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-4 text-center">
                            <img 
                                src="https://randomuser.me/api/portraits/lego/6.jpg" 
                                alt="Retrato de la fundadora" 
                                className="img-fluid rounded-circle shadow-sm"
                                style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                            />
                        </div>
                        <div className="col-md-8">
                            <h3 className="contact-title mt-4 mt-md-0">Una Nota de la Fundadora</h3>
                            <p className="text-muted fst-italic">
                                "Librería Sensorial nació de mi amor por los domingos lluviosos, una taza de té y un libro que no podía soltar. Quería compartir esa sensación de inmersión total, donde el mundo exterior desaparece y solo queda la historia. Cada kit es una carta de amor a esos momentos mágicos."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container text-center my-5 py-5">
                <h2 className="contact-title">¿Lista para tu próxima aventura?</h2>
                <p className="lead text-muted my-3">Explora nuestros kits y encuentra la historia que te está esperando.</p>
                <Link to="/kits" className="btn btn-custom-submit mt-2">
                    Ver Todos los Kits
                </Link>
            </div>
        </div>
    );
};