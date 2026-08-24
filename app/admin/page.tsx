'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

type Section = 'dashboard' | 'gallery' | 'content' | 'faq' | 'settings';

type GalleryItem = {
  id: string;
  image_url: string;
  storage_path: string | null;
  alt: string;
  position: number;
  active: boolean;
};

type FAQItem = {
  id: string;
  question: string;
  answer: string;
  position: number;
  active: boolean;
};

type SiteContent = {
  hero?: {
    eyebrow?: string;
    title?: string;
    description?: string;
  };
  about?: {
    eyebrow?: string;
    title?: string;
    paragraph1?: string;
    paragraph2?: string;
  };
  contact?: {
    whatsapp?: string;
    instagram?: string;
  };
};

const supabase = createClient();

export default function AdminPage() {
  const [section, setSection] = useState<Section>('dashboard');
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [faq, setFaq] = useState<FAQItem[]>([]);
  const [content, setContent] = useState<SiteContent>({});

  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    setLoading(true);
    setError('');

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = '/admin/login';
      return;
    }

    setUserEmail(user.email || '');

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      await supabase.auth.signOut();
      window.location.href = '/admin/login';
      return;
    }

    await Promise.all([
      loadGallery(),
      loadFAQ(),
      loadContent(),
    ]);

    setLoading(false);
  }

  async function loadGallery() {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('position', { ascending: true });

    if (!error && data) {
      setGallery(data);
    }
  }

  async function loadFAQ() {
    const { data, error } = await supabase
      .from('faq')
      .select('*')
      .order('position', { ascending: true });

    if (!error && data) {
      setFaq(data);
    }
  }

  async function loadContent() {
    const { data, error } = await supabase
      .from('site_content')
      .select('section, content');

    if (error || !data) return;

    const result: SiteContent = {};

    for (const item of data) {
      if (item.section === 'hero') {
        result.hero = item.content;
      }

      if (item.section === 'about') {
        result.about = item.content;
      }

      if (item.section === 'contact') {
        result.contact = item.content;
      }
    }

    setContent(result);
  }

  function showMessage(text: string) {
    setMessage(text);
    setError('');

    setTimeout(() => {
      setMessage('');
    }, 3000);
  }

  function showError(text: string) {
    setError(text);
    setMessage('');
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  }

  async function uploadImage(file: File) {
    setUploading(true);
    setError('');

    try {
      const extension = file.name.split('.').pop() || 'jpg';

      const filename = `${crypto.randomUUID()}.${extension}`;

      const path = `gallery/${filename}`;

      const { error: uploadError } = await supabase.storage
        .from('bella-tinta-gallery')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from('bella-tinta-gallery')
        .getPublicUrl(path);

      const { error: insertError } = await supabase
        .from('gallery')
        .insert({
          image_url: publicUrl,
          storage_path: path,
          alt: 'Tatuaje realizado en Bella Tinta',
          position: gallery.length,
          active: true,
        });

      if (insertError) {
        await supabase.storage
          .from('bella-tinta-gallery')
          .remove([path]);

        throw insertError;
      }

      await loadGallery();

      showMessage('Trabajo agregado correctamente.');
    } catch (err) {
      console.error(err);
      showError('No se pudo subir la imagen.');
    } finally {
      setUploading(false);
    }
  }

  async function deleteGalleryItem(item: GalleryItem) {
    const confirmed = window.confirm(
      '¿Seguro que querés eliminar este trabajo?'
    );

    if (!confirmed) return;

    try {
      if (item.storage_path) {
        await supabase.storage
          .from('bella-tinta-gallery')
          .remove([item.storage_path]);
      }

      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      await loadGallery();

      showMessage('Trabajo eliminado.');
    } catch (err) {
      console.error(err);
      showError('No se pudo eliminar el trabajo.');
    }
  }

  async function updateGalleryAlt(
    id: string,
    alt: string
  ) {
    const { error } = await supabase
      .from('gallery')
      .update({ alt })
      .eq('id', id);

    if (error) {
      showError('No se pudo guardar el texto.');
      return;
    }

    setGallery((items) =>
      items.map((item) =>
        item.id === id ? { ...item, alt } : item
      )
    );

    showMessage('Texto actualizado.');
  }

  async function saveContent(
    sectionName: 'hero' | 'about' | 'contact',
    value: Record<string, string>
  ) {
    const { error } = await supabase
      .from('site_content')
      .upsert(
        {
          section: sectionName,
          content: value,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'section',
        }
      );

    if (error) {
      console.error(error);
      showError('No se pudo guardar el contenido.');
      return;
    }

    await loadContent();

    showMessage('Cambios guardados correctamente.');
  }

  async function addFAQ() {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      showError('Completá la pregunta y la respuesta.');
      return;
    }

    const { error } = await supabase.from('faq').insert({
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      position: faq.length,
      active: true,
    });

    if (error) {
      showError('No se pudo agregar la pregunta.');
      return;
    }

    setNewQuestion('');
    setNewAnswer('');

    await loadFAQ();

    showMessage('Pregunta agregada.');
  }

  async function updateFAQ(
    id: string,
    field: 'question' | 'answer',
    value: string
  ) {
    const { error } = await supabase
      .from('faq')
      .update({
        [field]: value,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      showError('No se pudo guardar la pregunta.');
      return;
    }

    setFaq((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, [field]: value }
          : item
      )
    );
  }

  async function deleteFAQ(id: string) {
    const confirmed = window.confirm(
      '¿Eliminar esta pregunta frecuente?'
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from('faq')
      .delete()
      .eq('id', id);

    if (error) {
      showError('No se pudo eliminar.');
      return;
    }

    await loadFAQ();

    showMessage('Pregunta eliminada.');
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-mark">BT</div>
        <p>Cargando panel...</p>

        <style jsx>{`
          .admin-loading {
            min-height: 100vh;
            background: #080808;
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
          }

          .loading-mark {
            width: 60px;
            height: 60px;
            border: 1px solid #444;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            letter-spacing: 2px;
            margin-bottom: 18px;
          }

          p {
            color: #777;
            font-size: 12px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div className="admin-page">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-logo">BT</div>

            <div>
              <strong>BELLA TINTA</strong>
              <span>ADMIN PANEL</span>
            </div>
          </div>

          <nav>
            <button
              className={
                section === 'dashboard' ? 'active' : ''
              }
              onClick={() => setSection('dashboard')}
            >
              <span>01</span>
              Inicio
            </button>

            <button
              className={
                section === 'gallery' ? 'active' : ''
              }
              onClick={() => setSection('gallery')}
            >
              <span>02</span>
              Galería
            </button>

            <button
              className={
                section === 'content' ? 'active' : ''
              }
              onClick={() => setSection('content')}
            >
              <span>03</span>
              Contenido
            </button>

            <button
              className={
                section === 'faq' ? 'active' : ''
              }
              onClick={() => setSection('faq')}
            >
              <span>04</span>
              Preguntas
            </button>

            <button
              className={
                section === 'settings' ? 'active' : ''
              }
              onClick={() => setSection('settings')}
            >
              <span>05</span>
              Configuración
            </button>
          </nav>

          <div className="sidebar-bottom">
            <a href="/" target="_blank">
              Ver página →
            </a>

            <button onClick={logout}>
              Cerrar sesión
            </button>
          </div>
        </aside>

        <main className="main">
          <header className="topbar">
            <div>
              <p className="eyebrow">BELLA TINTA</p>

              <h1>
                {section === 'dashboard' && 'Panel general'}
                {section === 'gallery' && 'Galería'}
                {section === 'content' && 'Contenido'}
                {section === 'faq' && 'Preguntas frecuentes'}
                {section === 'settings' && 'Configuración'}
              </h1>
            </div>

            <div className="user">
              <span>{userEmail}</span>

              <div className="user-avatar">
                {userEmail.charAt(0).toUpperCase()}
              </div>
            </div>
          </header>

          {message && (
            <div className="toast success">
              ✓ {message}
            </div>
          )}

          {error && (
            <div className="toast error">
              {error}
            </div>
          )}

          {/* DASHBOARD */}

          {section === 'dashboard' && (
            <section className="content">
              <div className="welcome">
                <div>
                  <p className="eyebrow">
                    BIENVENIDO AL PANEL
                  </p>

                  <h2>
                    Todo Bella Tinta
                    <br />
                    <span>desde un solo lugar.</span>
                  </h2>

                  <p>
                    Administrá los trabajos, textos y
                    preguntas frecuentes de la página.
                  </p>
                </div>

                <a href="/" target="_blank">
                  VISITAR WEB →
                </a>
              </div>

              <div className="stats">
                <div className="stat">
                  <span>TRABAJOS</span>
                  <strong>{gallery.length}</strong>
                  <small>en la galería</small>
                </div>

                <div className="stat">
                  <span>PREGUNTAS</span>
                  <strong>{faq.length}</strong>
                  <small>preguntas frecuentes</small>
                </div>

                <div className="stat">
                  <span>ESTADO</span>
                  <strong>OK</strong>
                  <small>sitio conectado</small>
                </div>
              </div>

              <div className="quick">
                <button
                  onClick={() => setSection('gallery')}
                >
                  <span>+</span>
                  <strong>Agregar trabajo</strong>
                  <small>Subir una nueva imagen</small>
                </button>

                <button
                  onClick={() => setSection('content')}
                >
                  <span>✎</span>
                  <strong>Editar página</strong>
                  <small>Modificar textos y datos</small>
                </button>

                <button
                  onClick={() => setSection('faq')}
                >
                  <span>?</span>
                  <strong>Editar FAQ</strong>
                  <small>Administrar preguntas</small>
                </button>
              </div>
            </section>
          )}

          {/* GALLERY */}

          {section === 'gallery' && (
            <section className="content">
              <div className="section-header">
                <div>
                  <p>
                    {gallery.length} trabajos publicados
                  </p>
                </div>

                <label className="upload-button">
                  {uploading
                    ? 'SUBIENDO...'
                    : '+ AGREGAR TRABAJO'}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={uploading}
                    onChange={(event) => {
                      const file = event.target.files?.[0];

                      if (file) {
                        uploadImage(file);
                      }

                      event.currentTarget.value = '';
                    }}
                  />
                </label>
              </div>

              {gallery.length === 0 ? (
                <div className="empty">
                  <span>+</span>
                  <h3>No hay trabajos todavía</h3>
                  <p>
                    Subí la primera imagen de la galería.
                  </p>
                </div>
              ) : (
                <div className="gallery-grid">
                  {gallery.map((item, index) => (
                    <article
                      className="gallery-card"
                      key={item.id}
                    >
                      <div className="gallery-image">
                        <img
                          src={item.image_url}
                          alt={item.alt}
                        />

                        <span className="gallery-number">
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <button
                          className="delete"
                          onClick={() =>
                            deleteGalleryItem(item)
                          }
                        >
                          ×
                        </button>
                      </div>

                      <input
                        value={item.alt}
                        onChange={(event) =>
                          updateGalleryAlt(
                            item.id,
                            event.target.value
                          )
                        }
                        placeholder="Descripción"
                      />
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* CONTENT */}

          {section === 'content' && (
            <section className="content">
              <div className="editor">
                <div className="editor-header">
                  <div>
                    <p className="eyebrow">
                      HERO · PRINCIPAL
                    </p>
                    <h2>Portada</h2>
                  </div>
                </div>

                <label>
                  Pequeño título
                  <input
                    value={content.hero?.eyebrow || ''}
                    onChange={(event) =>
                      setContent({
                        ...content,
                        hero: {
                          ...content.hero,
                          eyebrow: event.target.value,
                        },
                      })
                    }
                  />
                </label>

                <label>
                  Título principal
                  <input
                    value={content.hero?.title || ''}
                    onChange={(event) =>
                      setContent({
                        ...content,
                        hero: {
                          ...content.hero,
                          title: event.target.value,
                        },
                      })
                    }
                  />
                </label>

                <label>
                  Descripción
                  <textarea
                    value={
                      content.hero?.description || ''
                    }
                    onChange={(event) =>
                      setContent({
                        ...content,
                        hero: {
                          ...content.hero,
                          description: event.target.value,
                        },
                      })
                    }
                  />
                </label>

                <button
                  className="save"
                  onClick={() =>
                    saveContent('hero', {
                      eyebrow:
                        content.hero?.eyebrow || '',
                      title:
                        content.hero?.title || '',
                      description:
                        content.hero?.description || '',
                    })
                  }
                >
                  GUARDAR PORTADA
                </button>
              </div>

              <div className="editor">
                <div className="editor-header">
                  <div>
                    <p className="eyebrow">
                      NOSOTROS · SOBRE BELLA TINTA
                    </p>
                    <h2>Sobre nosotros</h2>
                  </div>
                </div>

                <label>
                  Pequeño título
                  <input
                    value={content.about?.eyebrow || ''}
                    onChange={(event) =>
                      setContent({
                        ...content,
                        about: {
                          ...content.about,
                          eyebrow: event.target.value,
                        },
                      })
                    }
                  />
                </label>

                <label>
                  Título
                  <input
                    value={content.about?.title || ''}
                    onChange={(event) =>
                      setContent({
                        ...content,
                        about: {
                          ...content.about,
                          title: event.target.value,
                        },
                      })
                    }
                  />
                </label>

                <label>
                  Primer párrafo
                  <textarea
                    value={
                      content.about?.paragraph1 || ''
                    }
                    onChange={(event) =>
                      setContent({
                        ...content,
                        about: {
                          ...content.about,
                          paragraph1: event.target.value,
                        },
                      })
                    }
                  />
                </label>

                <label>
                  Segundo párrafo
                  <textarea
                    value={
                      content.about?.paragraph2 || ''
                    }
                    onChange={(event) =>
                      setContent({
                        ...content,
                        about: {
                          ...content.about,
                          paragraph2: event.target.value,
                        },
                      })
                    }
                  />
                </label>

                <button
                  className="save"
                  onClick={() =>
                    saveContent('about', {
                      eyebrow:
                        content.about?.eyebrow || '',
                      title:
                        content.about?.title || '',
                      paragraph1:
                        content.about?.paragraph1 || '',
                      paragraph2:
                        content.about?.paragraph2 || '',
                    })
                  }
                >
                  GUARDAR SOBRE NOSOTROS
                </button>
              </div>

              <div className="editor">
                <div className="editor-header">
                  <div>
                    <p className="eyebrow">
                      CONTACTO · REDES
                    </p>
                    <h2>Contacto</h2>
                  </div>
                </div>

                <label>
                  Número de WhatsApp
                  <input
                    value={
                      content.contact?.whatsapp || ''
                    }
                    onChange={(event) =>
                      setContent({
                        ...content,
                        contact: {
                          ...content.contact,
                          whatsapp: event.target.value,
                        },
                      })
                    }
                  />
                </label>

                <label>
                  Usuario de Instagram
                  <input
                    value={
                      content.contact?.instagram || ''
                    }
                    onChange={(event) =>
                      setContent({
                        ...content,
                        contact: {
                          ...content.contact,
                          instagram: event.target.value,
                        },
                      })
                    }
                  />
                </label>

                <button
                  className="save"
                  onClick={() =>
                    saveContent('contact', {
                      whatsapp:
                        content.contact?.whatsapp || '',
                      instagram:
                        content.contact?.instagram || '',
                    })
                  }
                >
                  GUARDAR CONTACTO
                </button>
              </div>
            </section>
          )}

          {/* FAQ */}

          {section === 'faq' && (
            <section className="content">
              <div className="editor">
                <div className="editor-header">
                  <div>
                    <p className="eyebrow">
                      NUEVA PREGUNTA
                    </p>

                    <h2>Agregar FAQ</h2>
                  </div>
                </div>

                <label>
                  Pregunta
                  <input
                    value={newQuestion}
                    onChange={(event) =>
                      setNewQuestion(event.target.value)
                    }
                    placeholder="Ej: ¿Cuánto cuesta un tatuaje?"
                  />
                </label>

                <label>
                  Respuesta
                  <textarea
                    value={newAnswer}
                    onChange={(event) =>
                      setNewAnswer(event.target.value)
                    }
                    placeholder="Escribí la respuesta..."
                  />
                </label>

                <button
                  className="save"
                  onClick={addFAQ}
                >
                  AGREGAR PREGUNTA
                </button>
              </div>

              <div className="faq-admin-list">
                {faq.map((item, index) => (
                  <article
                    className="faq-admin-card"
                    key={item.id}
                  >
                    <div className="faq-admin-number">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    <div className="faq-admin-fields">
                      <label>
                        Pregunta
                        <input
                          value={item.question}
                          onChange={(event) =>
                            updateFAQ(
                              item.id,
                              'question',
                              event.target.value
                            )
                          }
                        />
                      </label>

                      <label>
                        Respuesta
                        <textarea
                          value={item.answer}
                          onChange={(event) =>
                            updateFAQ(
                              item.id,
                              'answer',
                              event.target.value
                            )
                          }
                        />
                      </label>
                    </div>

                    <button
                      className="faq-delete"
                      onClick={() =>
                        deleteFAQ(item.id)
                      }
                    >
                      ELIMINAR
                    </button>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* SETTINGS */}

          {section === 'settings' && (
            <section className="content">
              <div className="settings-card">
                <p className="eyebrow">
                  CUENTA ADMINISTRADORA
                </p>

                <h2>Seguridad</h2>

                <div className="account-row">
                  <span>Email</span>
                  <strong>{userEmail}</strong>
                </div>

                <div className="account-row">
                  <span>Rol</span>
                  <strong>ADMIN</strong>
                </div>

                <div className="account-row">
                  <span>Estado</span>
                  <strong className="online">
                    CONECTADO
                  </strong>
                </div>

                <button
                  className="logout-button"
                  onClick={logout}
                >
                  CERRAR SESIÓN
                </button>
              </div>
            </section>
          )}
        </main>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #080808;
          color: #f3f0ea;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        button,
        input,
        textarea {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        .admin-page {
          min-height: 100vh;
          display: flex;
          background:
            radial-gradient(
              circle at 80% 0%,
              rgba(255, 255, 255, 0.04),
              transparent 30%
            ),
            #080808;
        }

        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          width: 250px;
          display: flex;
          flex-direction: column;
          padding: 30px 22px;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          background: #090909;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 8px;
          margin-bottom: 65px;
        }

        .brand-logo {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #444;
          border-radius: 50%;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .brand strong {
          display: block;
          font-size: 11px;
          letter-spacing: 1.8px;
        }

        .brand span {
          display: block;
          margin-top: 4px;
          color: #555;
          font-size: 7px;
          letter-spacing: 1.5px;
        }

        .sidebar nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sidebar nav button {
          width: 100%;
          display: grid;
          grid-template-columns: 32px 1fr;
          align-items: center;
          padding: 14px 10px;
          border: 0;
          border-radius: 6px;
          background: transparent;
          color: #777;
          text-align: left;
          font-size: 12px;
          transition: all 0.2s ease;
        }

        .sidebar nav button span {
          color: #444;
          font-size: 8px;
          letter-spacing: 1px;
        }

        .sidebar nav button:hover {
          background: #111;
          color: #ddd;
        }

        .sidebar nav button.active {
          background: #f1eee8;
          color: #090909;
        }

        .sidebar nav button.active span {
          color: #555;
        }

        .sidebar-bottom {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sidebar-bottom a,
        .sidebar-bottom button {
          padding: 12px 10px;
          border: 0;
          background: transparent;
          color: #666;
          text-align: left;
          font-size: 10px;
        }

        .sidebar-bottom a:hover,
        .sidebar-bottom button:hover {
          color: #fff;
        }

        .main {
          width: calc(100% - 250px);
          margin-left: 250px;
          min-height: 100vh;
        }

        .topbar {
          min-height: 115px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 25px 55px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .eyebrow {
          margin: 0 0 8px;
          color: #666;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 2.5px;
        }

        .topbar h1 {
          margin: 0;
          font-size: 28px;
          letter-spacing: -1px;
        }

        .user {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user > span {
          color: #666;
          font-size: 10px;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #333;
          border-radius: 50%;
          font-size: 11px;
          font-weight: 800;
        }

        .content {
          max-width: 1250px;
          margin: 0 auto;
          padding: 55px;
        }

        .toast {
          position: fixed;
          right: 25px;
          top: 25px;
          z-index: 50;
          padding: 14px 18px;
          border-radius: 7px;
          font-size: 11px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
        }

        .toast.success {
          background: #f1eee8;
          color: #080808;
        }

        .toast.error {
          background: #381616;
          color: #ffb0b0;
        }

        .welcome {
          display: flex;
          justify-content: space-between;
          gap: 40px;
          align-items: flex-end;
          padding: 45px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background:
            radial-gradient(
              circle at 90% 20%,
              rgba(255, 255, 255, 0.07),
              transparent 35%
            ),
            #0d0d0d;
        }

        .welcome h2 {
          margin: 0;
          font-size: clamp(38px, 5vw, 65px);
          line-height: 0.9;
          letter-spacing: -3px;
        }

        .welcome h2 span {
          color: #666;
        }

        .welcome p:not(.eyebrow) {
          max-width: 430px;
          margin: 25px 0 0;
          color: #777;
          font-size: 13px;
          line-height: 1.7;
        }

        .welcome > a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 45px;
          padding: 0 18px;
          border: 1px solid #333;
          border-radius: 999px;
          color: #ddd;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.3px;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          margin-top: 10px;
          gap: 10px;
        }

        .stat {
          padding: 28px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          background: #0d0d0d;
        }

        .stat span {
          display: block;
          color: #555;
          font-size: 8px;
          letter-spacing: 2px;
        }

        .stat strong {
          display: block;
          margin: 14px 0 4px;
          font-size: 38px;
          letter-spacing: -2px;
        }

        .stat small {
          color: #555;
          font-size: 9px;
        }

        .quick {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 10px;
        }

        .quick button {
          min-height: 150px;
          padding: 25px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: #0d0d0d;
          color: #fff;
          text-align: left;
          transition: background 0.2s ease;
        }

        .quick button:hover {
          background: #141414;
        }

        .quick button > span {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 35px;
          height: 35px;
          margin-bottom: 25px;
          border: 1px solid #333;
          border-radius: 50%;
          color: #aaa;
        }

        .quick strong {
          display: block;
          font-size: 12px;
        }

        .quick small {
          display: block;
          margin-top: 7px;
          color: #555;
          font-size: 9px;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 30px;
        }

        .section-header p {
          margin: 0;
          color: #666;
          font-size: 11px;
        }

        .upload-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 45px;
          padding: 0 18px;
          border-radius: 999px;
          background: #f1eee8;
          color: #080808;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1px;
          cursor: pointer;
        }

        .upload-button input {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .gallery-card {
          min-width: 0;
        }

        .gallery-image {
          position: relative;
          aspect-ratio: 1 / 1.15;
          overflow: hidden;
          background: #111;
        }

        .gallery-image img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .gallery-number {
          position: absolute;
          left: 10px;
          bottom: 9px;
          color: #fff;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .delete {
          position: absolute;
          top: 9px;
          right: 9px;
          width: 30px;
          height: 30px;
          border: 0;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.65);
          color: #fff;
          font-size: 18px;
        }

        .gallery-card > input {
          width: 100%;
          margin-top: 7px;
          padding: 10px 0;
          border: 0;
          border-bottom: 1px solid #222;
          outline: 0;
          background: transparent;
          color: #888;
          font-size: 10px;
        }

        .empty {
          padding: 90px 20px;
          border: 1px dashed #2a2a2a;
          text-align: center;
        }

        .empty > span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 55px;
          height: 55px;
          border: 1px solid #333;
          border-radius: 50%;
          color: #777;
          font-size: 24px;
        }

        .empty h3 {
          margin: 20px 0 7px;
          font-size: 15px;
        }

        .empty p {
          margin: 0;
          color: #555;
          font-size: 11px;
        }

        .editor {
          max-width: 850px;
          margin-bottom: 15px;
          padding: 32px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: #0d0d0d;
        }

        .editor-header {
          margin-bottom: 30px;
        }

        .editor-header h2 {
          margin: 0;
          font-size: 24px;
        }

        .editor label {
          display: block;
          margin-bottom: 20px;
          color: #777;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.3px;
          text-transform: uppercase;
        }

        .editor input,
        .editor textarea {
          display: block;
          width: 100%;
          margin-top: 8px;
          padding: 14px;
          border: 1px solid #222;
          outline: 0;
          border-radius: 4px;
          background: #090909;
          color: #ddd;
          font-size: 12px;
          resize: vertical;
        }

        .editor textarea {
          min-height: 110px;
          line-height: 1.6;
        }

        .editor input:focus,
        .editor textarea:focus {
          border-color: #555;
        }

        .save {
          min-height: 44px;
          padding: 0 18px;
          border: 0;
          border-radius: 999px;
          background: #f1eee8;
          color: #090909;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .faq-admin-list {
          max-width: 900px;
        }

        .faq-admin-card {
          display: grid;
          grid-template-columns: 45px 1fr auto;
          gap: 20px;
          align-items: start;
          padding: 25px 0;
          border-top: 1px solid #222;
        }

        .faq-admin-number {
          color: #555;
          font-size: 10px;
          font-weight: 800;
        }

        .faq-admin-fields label {
          display: block;
          margin-bottom: 14px;
          color: #555;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .faq-admin-fields input,
        .faq-admin-fields textarea {
          width: 100%;
          margin-top: 7px;
          padding: 12px;
          border: 1px solid #222;
          outline: 0;
          background: #0d0d0d;
          color: #ddd;
          font-size: 11px;
        }

        .faq-admin-fields textarea {
          min-height: 90px;
          resize: vertical;
        }

        .faq-delete {
          border: 0;
          background: transparent;
          color: #744;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .settings-card {
          max-width: 650px;
          padding: 35px;
          border: 1px solid #222;
          background: #0d0d0d;
        }

        .settings-card h2 {
          margin: 0 0 35px;
          font-size: 30px;
        }

        .account-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 18px 0;
          border-top: 1px solid #222;
        }

        .account-row span {
          color: #555;
          font-size: 10px;
        }

        .account-row strong {
          color: #ccc;
          font-size: 10px;
        }

        .account-row strong.online {
          color: #8eaa8e;
        }

        .logout-button {
          margin-top: 30px;
          min-height: 42px;
          padding: 0 17px;
          border: 1px solid #422;
          background: transparent;
          color: #b77;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        @media (max-width: 900px) {
          .sidebar {
            position: static;
            width: 100%;
            height: auto;
            border-right: 0;
            border-bottom: 1px solid #222;
            padding: 18px;
          }

          .admin-page {
            display: block;
          }

          .brand {
            margin-bottom: 20px;
          }

          .sidebar nav {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
          }

          .sidebar nav button {
            display: block;
            padding: 10px 5px;
            text-align: center;
            font-size: 9px;
          }

          .sidebar nav button span {
            display: block;
            margin-bottom: 5px;
          }

          .sidebar-bottom {
            display: none;
          }

          .main {
            width: 100%;
            margin-left: 0;
          }

          .topbar {
            padding: 22px 18px;
          }

          .user > span {
            display: none;
          }

          .content {
            padding: 22px 18px 60px;
          }

          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 6px;
          }

          .quick,
          .stats {
            grid-template-columns: 1fr;
          }

          .welcome {
            display: block;
            padding: 28px;
          }

          .welcome > a {
            margin-top: 25px;
          }

          .faq-admin-card {
            grid-template-columns: 30px 1fr;
          }

          .faq-delete {
            grid-column: 2;
            justify-self: start;
          }
        }

        @media (max-width: 500px) {
          .topbar h1 {
            font-size: 23px;
          }

          .sidebar nav button {
            font-size: 8px;
          }

          .sidebar nav button span {
            font-size: 7px;
          }

          .welcome h2 {
            font-size: 40px;
            letter-spacing: -2px;
          }

          .section-header {
            align-items: flex-end;
            gap: 10px;
          }

          .upload-button {
            padding: 0 13px;
            font-size: 8px;
          }

          .editor {
            padding: 22px;
          }
        }
      `}</style>
    </>
  );
}