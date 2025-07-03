import React from 'react';

export const PreguntasFrecuentes = () => {
    return (
        <div className="body-custom-bg">
            <div className="container-fluid text-center py-5 change-color-focus" >
                <h1 className="display-4 contact-title">Preguntas Frecuentes</h1>
                <p className="lead text-muted">¿Tienes dudas? Aquí resolvemos las más comunes.</p>
            </div>

            <div className="container my-5" >
                <div className="accordion" id="faqAccordion">

                    <div className="accordion-item mb-3 border-0 shadow-sm rounded-3">
                        <h2 className="accordion-header" id="headingOne">
                            <button className="accordion-button collapsed contact-title" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                ¿Qué incluye exactamente un kit de Librería Sensorial?
                            </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#faqAccordion">
                            <div className="accordion-body text-muted">
                                Cada kit es único, pero todos incluyen: un libro cuidadosamente seleccionado, una bebida artesanal (té, café o infusión), un elemento aromático (como una vela o incienso), una playlist curada para la lectura, y un pequeño objeto temático que complementa la historia.
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item mb-3 border-0 shadow-sm rounded-3">
                        <h2 className="accordion-header" id="headingTwo">
                            <button className="accordion-button collapsed contact-title" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                ¿Hacen envíos a todo el país?
                            </button>
                        </h2>
                        <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#faqAccordion">
                            <div className="accordion-body text-muted">
                                ¡Sí! Realizamos envíos a todo el pais. Los costos y tiempos de entrega pueden variar según tu ubicación. Podrás ver el detalle completo antes de finalizar tu compra.
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item mb-3 border-0 shadow-sm rounded-3">
                        <h2 className="accordion-header" id="headingThree">
                            <button className="accordion-button collapsed contact-title" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                ¿Puedo personalizar un kit o sugerir un libro?
                            </button>
                        </h2>
                        <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#faqAccordion">
                            <div className="accordion-body text-muted">
                                Por el momento, nuestros kits vienen predefinidos para asegurar la mejor experiencia curada. Sin embargo, ¡nos encanta escuchar tus ideas! Siempre estamos buscando inspiración para futuras ediciones. No dudes en escribirnos a través de nuestro formulario de contacto.
                            </div>
                        </div>
                    </div>
                    
                    <div className="accordion-item mb-3 border-0 shadow-sm rounded-3">
                        <h2 className="accordion-header" id="headingFour">
                            <button className="accordion-button collapsed contact-title" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                ¿Qué métodos de pago aceptan?
                            </button>
                        </h2>
                        <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#faqAccordion">
                            <div className="accordion-body text-muted">
                                Aceptamos todas las principales tarjetas de crédito y débito a través de nuestra pasarela de pago segura, así como pagos a través de Stripe.
                            </div>
                        </div>
                    </div>

                </div>
            </div>

             <div className="container text-center my-5 py-5">
                <h3 className="contact-title">¿No encontraste tu respuesta?</h3>
                <p className="lead text-muted my-3">Nuestro equipo está listo para ayudarte. Contáctanos directamente.</p>
                <a href="/contactanos" className="btn btn-custom-submit mt-2">
                    Ir a Contactanos
                </a>
            </div>
        </div>
    );
};