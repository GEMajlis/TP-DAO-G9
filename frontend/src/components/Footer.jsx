import React from 'react';

function Footer() {
    return (
        <footer>
            <div className="mb-1">
                <a
                    className="redes"
                    href="https://www.facebook.com"
                    target="_blank"
                >
                    <i title="Facebook" className="fab fa-facebook fa-lg"></i>
                </a>
                <a
                    className="redes"
                    href="https://twitter.com"
                    target="_blank"
                >
                    <i title="Twitter" className="fab fa-twitter fa-lg"></i>
                </a>
                <a
                    className="redes"
                    href="https://www.instagram.com"
                    target="_blank"
                >
                    <i title="Instagram" className="fab fa-instagram fa-lg"></i>
                </a>
                <a
                    className="redes"
                    href="https://www.whatsapp.com"
                    target="_blank"
                >
                    <i title="Whatsapp" className="fab fa-whatsapp fa-lg"></i>
                </a>
            </div>
            <small>
                <span>Todos los derechos reservados © SoftPro</span>
            </small>
        </footer>
    );
}

export { Footer };