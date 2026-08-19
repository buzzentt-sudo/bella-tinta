export default function Home() {
  const whatsappMessage =
    "Hola Bella Tinta, quiero consultar para reservar un turno para un tatuaje.";

  const whatsappUrl = `https://wa.me/5493442315080?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <nav>
          <div className="logo">
  <img src="/logo.jpg" alt="Bella Tinta Tattoo Studio" />
</div>

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

          <a href={whatsappUrl} className="button" target="_blank" rel="noreferrer">
            RESERVAR TURNO
          </a>
        </div>
      </section>

      {/* GALERÍA */}
      <section id="trabajos" className="section">
        <p className="eyebrow">PORTFOLIO</p>

        <h2>Trabajos recientes</h2>

        <p className="section-intro">
          Algunos de los estilos que podés encontrar en Bella Tinta.
        </p>

        <div className="gallery">
          <div className="gallery-card">
            <div className="gallery-image">
              <div className="gallery-placeholder">
                <span>BLACKWORK</span>
                <small>Próximamente</small>
              </div>
            </div>

            <div className="gallery-info">
              <span>01</span>
              <h3>Blackwork</h3>
            </div>
          </div>

          <div className="gallery-card">
            <div className="gallery-image">
              <div className="gallery-placeholder">
                <span>FINE LINE</span>
                <small>Próximamente</small>
              </div>
            </div>

            <div className="gallery-info">
              <span>02</span>
              <h3>Fine Line</h3>
            </div>
          </div>

          <div className="gallery-card">
            <div className="gallery-image">
              <div className="gallery-placeholder">
                <span>REALISMO</span>
                <small>Próximamente</small>
              </div>
            </div>

            <div className="gallery-info">
              <span>03</span>
              <h3>Realismo</h3>
            </div>
          </div>

          <div className="gallery-card">
            <div className="gallery-image">
              <div className="gallery-placeholder">
                <span>LETTERING</span>
                <small>Próximamente</small>
              </div>
            </div>

            <div className="gallery-info">
              <span>04</span>
              <h3>Lettering</h3>
            </div>
          </div>

          <div className="gallery-card">
            <div className="gallery-image">
              <div className="gallery-placeholder">
                <span>ORNAMENTAL</span>
                <small>Próximamente</small>
              </div>
            </div>

            <div className="gallery-info">
              <span>05</span>
              <h3>Ornamental</h3>
            </div>
          </div>

          <div className="gallery-card">
            <div className="gallery-image">
              <div className="gallery-placeholder">
                <span>PERSONALIZADO</span>
                <small>Próximamente</small>
              </div>
            </div>

            <div className="gallery-info">
              <span>06</span>
              <h3>Diseños personalizados</h3>
            </div>
          </div>
        </div>
      </section>

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

      {/* SOBRE BELLA TINTA */}
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
            Desde diseños minimalistas hasta piezas más complejas, trabajamos
            cada proyecto de manera personalizada.
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
              Sí. Podés enviar tu idea o diseño y podemos conversar sobre cómo
              adaptarlo para que funcione correctamente como tatuaje.
            </p>
          </details>

          <details>
            <summary>¿Hacen diseños personalizados?</summary>
            <p>
              Sí. Cada proyecto puede trabajarse de manera personalizada para
              conseguir un resultado único.
            </p>
          </details>

          <details>
            <summary>¿Qué estilos trabajan?</summary>
            <p>
              Entre los estilos disponibles se encuentran Blackwork, Fine
              Line, Realismo, Lettering y diseños personalizados.
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
          <a href={whatsappUrl} target="_blank" rel="noreferrer">
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