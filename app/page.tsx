export default function Home() {
  return (
    <main>
      <section className="hero">
        <nav>
          <div className="logo">BELLA TINTA</div>

          <div className="nav-links">
            <a href="#trabajos">Trabajos</a>
            <a href="#estilos">Estilos</a>
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

          <a href="#contacto" className="button">
            RESERVAR TURNO
          </a>
        </div>
      </section>

      <section id="trabajos" className="section">
        <p className="eyebrow">PORTFOLIO</p>
        <h2>Trabajos recientes</h2>

        <div className="gallery">
          <div className="gallery-card">BLACKWORK</div>
          <div className="gallery-card">FINE LINE</div>
          <div className="gallery-card">REALISMO</div>
        </div>
      </section>

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
        </div>
      </section>

      <section id="contacto" className="contact">
        <p className="eyebrow">¿LISTO PARA TU PRÓXIMO TATUAJE?</p>

        <h2>Hablemos de tu idea.</h2>

        <p>
          Contanos qué tenés en mente y coordinamos tu turno.
        </p>

        <a href="https://www.instagram.com/bellatintaa_tatoo/">
          INSTAGRAM
        </a>
      </section>

      <footer>
        <p>© 2026 Bella Tinta Tattoo</p>
      </footer>
    </main>
  );
}
