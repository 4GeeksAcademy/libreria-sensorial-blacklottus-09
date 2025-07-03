import React from 'react';

export const PoliticaPrivacidad = () => {
    return (
        <div className="body-custom-bg">
            <div className="container my-5 py-5" style={{ maxWidth: '800px' }}>
                <div className="text-center mb-5">
                    <h1 className="display-4 contact-title">Política de Privacidad</h1>
                    <p className="text-muted">Última actualización: 3 de Julio de 2025</p>
                </div>

                <div className="text-start">
                    <p className="lead">
                        En Librería Sensorial, valoramos y respetamos tu privacidad. Esta Política de Privacidad describe cómo recopilamos, usamos y protegemos tu información personal cuando visitas y utilizas nuestro sitio web.
                    </p>

                    <h2 className="contact-title h4 mt-5 mb-3">1. Información que Recopilamos</h2>
                    <p className="text-muted">
                        Podemos recopilar la siguiente información:
                        <ul>
                            <li><strong>Información Personal:</strong> Nombre, dirección de correo electrónico, dirección de envío y número de teléfono que nos proporcionas al crear una cuenta o realizar un pedido.</li>
                            <li><strong>Información de Pago:</strong> Los datos de tu tarjeta de crédito o débito son procesados directamente por nuestros proveedores de pago seguros (ej. Stripe, PayPal) y no son almacenados en nuestros servidores.</li>
                            <li><strong>Información Técnica:</strong> Dirección IP, tipo de navegador, sistema operativo y datos de navegación recopilados a través de cookies para mejorar tu experiencia en nuestro sitio.</li>
                        </ul>
                    </p>

                    <h2 className="contact-title h4 mt-5 mb-3">2. Cómo Usamos tu Información</h2>
                    <p className="text-muted">
                        Utilizamos la información que recopilamos para los siguientes propósitos:
                        <ul>
                            <li>Procesar y enviar tus pedidos.</li>
                            <li>Comunicarnos contigo sobre tu pedido o para responder a tus consultas.</li>
                            <li>Mejorar y personalizar tu experiencia de compra en nuestro sitio web.</li>
                            <li>Enviarte correos electrónicos de marketing (solo si has dado tu consentimiento explícito), de los cuales puedes darte de baja en cualquier momento.</li>
                        </ul>
                    </p>

                    <h2 className="contact-title h4 mt-5 mb-3">3. Cómo Compartimos tu Información</h2>
                    <p className="text-muted">
                        No vendemos, alquilamos ni compartimos tu información personal con terceros para fines de marketing. Solo compartimos tu información con socios de confianza que nos ayudan a operar nuestro sitio web y negocio, tales como:
                        <ul>
                            <li>Empresas de logística y envío para entregar tus pedidos.</li>
                            <li>Pasarelas de pago para procesar tus transacciones de forma segura.</li>
                        </ul>
                    </p>
                    
                    <h2 className="contact-title h4 mt-5 mb-3">4. Seguridad de los Datos</h2>
                    <p className="text-muted">
                        Implementamos una variedad de medidas de seguridad para mantener la seguridad de tu información personal. Nuestro sitio web utiliza encriptación SSL (Secure Socket Layer) y las contraseñas de los usuarios se almacenan de forma hasheada (encriptada).
                    </p>

                    <h2 className="contact-title h4 mt-5 mb-3">5. Tus Derechos</h2>
                    <p className="text-muted">
                        Tienes derecho a acceder, corregir o eliminar tu información personal que tenemos registrada. Si deseas ejercer alguno de estos derechos, por favor contáctanos.
                    </p>
                    <h2 className="contact-title h4 mt-5 mb-3">6. Nada de esto es real y esto es una simulacion</h2>
                    <p className="text-muted">
                        La informacion aqui presente no representa ningun tipo de documento legal ni nada en si, es solo un ejemplo de como este componente deberia verse en una pagina real. att: el editor {`<3`}
                    </p>
                </div>
            </div>
        </div>
    );
};