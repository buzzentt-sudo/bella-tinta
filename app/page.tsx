'use client';

import { useState } from 'react';

const whatsappMessage =
  'Hola Bella Tinta, quiero consultar para reservar un turno para un tatuaje.';

const whatsappUrl = `https://wa.me/5493442315080?text=${encodeURIComponent(
  whatsappMessage
)}`;

const trabajos = Array.from({ length: 21 }, (_, index) => ({
  id: index + 1,
  image: `/trabajo-${index + 1}.jpg`,
}));

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const closeGallery = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage === null) return;

    setSelectedImage(
      selectedImage === trabajos.length ? 1 : selectedImage + 1
    );
  };

  const previousImage = () => {
    if (selectedImage === null) return;

    setSelectedImage(
      selectedImage === 1 ? trabajos.length : selectedImage - 1
    );
  };

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <nav>
          <a href="#" className="logo">
            <img
              src="/logo.jpg"
              alt="Bella Tinta Tattoo Studio"
            />
          </a>

          <div className="nav-links">
            <a href="#trabajos">Trabajos</a>
            <a href="#estilos">Estilos</a>
            <a href="#nosotros">Nosotros</a>
            <a href="#faq">FAQ</a>
            <a href="#contacto">Contacto</a>
          </div>
        </nav>

        <div className="hero-content">
          <p className="eyebrow">TATTOO STUDIO</p>

          <h1>
            TU PIEL.
            <br />
            <span>TU HISTORIA.</span>
          </h1>

          <p className="hero-text">
            Tatuajes hechos para vos, con identidad, detalle y personalidad.
          </p>

          <a
            href={whatsappUrl}
            className="button"
            target="_blank"
            rel="noreferrer"
          >
            RESERVAR TURNO
          </a>
        </div>
      </section>

      {/* GALERÍA */}
      <section id="trabajos" className="section">
        <p className="eyebrow">PORTFOLIO</p>

        <h2>Trabajos recientes</h2>

        <p className="section-intro">
          Conocé algunos de los trabajos realizados en Bella Tinta.
        </p>

        <div className="gallery">
          {trabajos.map((trabajo) => (
            <button
              key={trabajo.id}
              className="gallery-card"
              onClick={() => setSelectedImage(trabajo.id)}
              aria-label={`Ver trabajo ${trabajo.id}`}
            >
              <div className="gallery-image">
                <img
                  src={trabajo.image}
                  alt={`Trabajo de tatuaje ${trabajo.id} de Bella Tinta`}
                />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* LIGHTBOX */}
      {selectedImage !== null && (
        <div
          className="lightbox"
          onClick={closeGallery}
          role="dialog"
          aria-modal="true"
          aria-label="Galería de trabajos"
        >
          <button
            className="lightbox-close"
            onClick={closeGallery}
            aria-label="Cerrar"
          >
            ×
          </button>

          <button
            className="lightbox-prev"
            onClick={(event) => {
              event.stopPropagation();
              previousImage();
            }}
            aria-label="Trabajo anterior"
          >
            ‹
          </button>

          <div
            className="lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={`/trabajo-${selectedImage}.jpg`}
              alt={`Trabajo de tatuaje ${selectedImage} de Bella Tinta`}
            />

            <p>
              {selectedImage} / {trabajos.length}
            </p>
          </div>

          <button
            className="lightbox-next"
            onClick={(event) => {
              event.stopPropagation();
              nextImage();
            }}
            aria-label="Siguiente trabajo"
          >
            ›
          </button>
        </div>
      )}

      {/* ESTILOS */}
      <section id="estilos" className="section styles">
        <p className="eyebrow">ESPECIALIDADES</p>

        <h2>Encontrá tu estilo</h2>

        <div className="style-list">
          <div>
            <span>01</span>
            <h3>Blackwork</h3>
          </div>

          <div>
            <span>02</span>
            <h3>Fine Line</h3>
          </div>

          <div>
            <span>03</span>
            <h3>Realismo</h3>
          </div>

          <div>
            <span>04</span>
            <h3>Lettering</h3>
          </div>

          <div>
            <span>05</span>
            <h3>Ornamental</h3>
          </div>

          <div>
            <span>06</span>
            <h3>Diseños personalizados</h3>
          </div>
        </div>
      </section>

      {/* NOSOTROS */}
      <section id="nosotros" className="about">
        <div className="about-content">
          <p className="eyebrow">BELLA TINTA</p>

          <h2>
            Arte que
            <br />
            <span>queda en tu piel.</span>
          </h2>

          <p>
            Cada tatuaje cuenta una historia. En Bella Tinta buscamos
            transformar tus ideas en diseños únicos, cuidando cada detalle
            para que el resultado represente realmente quién sos.
          </p>

          <p>
            Trabajamos cada proyecto de manera personalizada para conseguir
            un resultado único.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section faq">
        <p className="eyebrow">PREGUNTAS FRECUENTES</p>

        <h2>Antes de tatuarte</h2>

        <div className="faq-list">
          <details>
            <summary>¿Cómo puedo reservar un turno?</summary>

            <p>
              Podés comunicarte directamente por WhatsApp y contarnos qué
              tatuaje tenés en mente.
            </p>
          </details>

          <details>
            <summary>¿Puedo llevar mi propio diseño?</summary>

            <p>
              Sí. Podés enviar tu idea o diseño y conversar sobre cómo
              adaptarlo para que funcione correctamente como tatuaje.
            </p>
          </details>

          <details>
            <summary>¿Hacen diseños personalizados?</summary>

            <p>
              Sí. Cada proyecto puede trabajarse de manera personalizada.
            </p>
          </details>

          <details>
            <summary>¿Qué estilos trabajan?</summary>

            <p>
              Entre los estilos disponibles se encuentran Blackwork, Fine
              Line, Realismo, Lettering, Ornamental y diseños personalizados.
            </p>
          </details>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="instagram-section">
        <div>
          <p className="eyebrow">SEGUINOS</p>

          <h2>
            Más trabajos,
            <br />
            <span>en Instagram.</span>
          </h2>

          <p>
            Conocé más trabajos y novedades de Bella Tinta directamente en
            nuestro Instagram.
          </p>

          <a
            href="https://www.instagram.com/bellatintaa_tatoo/"
            target="_blank"
            rel="noreferrer"
            className="instagram-button"
          >
            @bellatintaa_tatoo
          </a>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="contact">
        <p className="eyebrow">¿LISTO PARA TU PRÓXIMO TATUAJE?</p>

        <h2>
          Hablemos de
          <br />
          tu idea.
        </h2>

        <p>Contanos qué tenés en mente y coordinamos tu turno.</p>

        <div className="contact-buttons">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
          >
            WHATSAPP
          </a>

          <a
            href="https://www.instagram.com/bellatintaa_tatoo/"
            target="_blank"
            rel="noreferrer"
          >
            INSTAGRAM
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">BELLA TINTA</div>

        <p>© 2026 Bella Tinta Tattoo</p>

        <a
          href="https://www.instagram.com/bellatintaa_tatoo/"
          target="_blank"
          rel="noreferrer"
        >
          @bellatintaa_tatoo
        </a>
      </footer>
    </main>
  );
}