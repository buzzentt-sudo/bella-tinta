'use client';

import { FormEvent, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

const supabase = createClient();

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      window.location.href = '/admin';
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError('');

    const { data, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (loginError || !data.user) {
    console.error("ERROR LOGIN SUPABASE:", loginError);

    setError(
      loginError?.message || "No se pudo iniciar sesión."
    );

    setLoading(false);
    return;
  }

    const { data: profile, error: profileError } =
      await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

    if (
      profileError ||
      !profile ||
      profile.role !== 'admin'
    ) {
      await supabase.auth.signOut();

      setError(
        'Esta cuenta no tiene permisos de administrador.'
      );

      setLoading(false);
      return;
    }

    window.location.href = '/admin';
  }

  return (
    <main className="login-page">
      <div className="background">
        <div className="grain" />
        <div className="circle circle-one" />
        <div className="circle circle-two" />
      </div>

      <section className="login-container">
        <div className="brand">
          <div className="logo">BT</div>

          <div>
            <strong>BELLA TINTA</strong>
            <span>ESTUDIO DE TATUAJES</span>
          </div>
        </div>

        <div className="login-card">
          <div className="heading">
            <p>ÁREA PRIVADA</p>

            <h1>
              Bienvenido
              <br />
              <span>de nuevo.</span>
            </h1>

            <div className="line" />
          </div>

          <form onSubmit={handleLogin}>
            <label>
              EMAIL

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="tu@email.com"
                autoComplete="email"
                required
              />
            </label>

            <label>
              CONTRASEÑA

              <div className="password-wrapper">
                <input
                  type={
                    showPassword ? 'text' : 'password'
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? 'Ocultar contraseña'
                      : 'Mostrar contraseña'
                  }
                >
                  {showPassword ? 'OCULTAR' : 'VER'}
                </button>
              </div>
            </label>

            {error && (
              <div className="error">
                <span>!</span>
                {error}
              </div>
            )}

            <button
              className="submit"
              type="submit"
              disabled={loading}
            >
              <span>
                {loading
                  ? 'INGRESANDO...'
                  : 'INGRESAR AL PANEL'}
              </span>

              {!loading && <span>→</span>}
            </button>
          </form>

          <div className="back">
            <a href="/">← Volver al sitio</a>
          </div>
        </div>

        <footer>
          <span>BELLA TINTA</span>
          <span>ADMINISTRACIÓN PRIVADA</span>
        </footer>
      </section>

      <style jsx global>{
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          min-height: 100%;
          background: #080808;
        }

        body {
          color: #f2eee7;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        button,
        input {
          font: inherit;
        }

        .login-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #080808;
        }

        .background {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .grain {
          position: absolute;
          inset: -50%;
          opacity: 0.035;
          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E");
          transform: rotate(8deg);
        }

        .circle {
          position: absolute;
          border: 1px solid rgba(255, 255, 255, 0.045);
          border-radius: 50%;
        }

        .circle-one {
          width: 650px;
          height: 650px;
          top: -280px;
          right: -190px;
        }

        .circle-two {
          width: 450px;
          height: 450px;
          bottom: -250px;
          left: -170px;
        }

        .login-container {
          position: relative;
          z-index: 2;
          width: min(430px, calc(100% - 36px));
        }

        .brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 28px;
        }

        .logo {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #444;
          border-radius: 50%;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .brand strong {
          display: block;
          font-size: 12px;
          letter-spacing: 2px;
        }

        .brand span {
          display: block;
          margin-top: 5px;
          color: #555;
          font-size: 7px;
          letter-spacing: 2px;
        }

        .login-card {
          padding: 42px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          background:
            radial-gradient(
              circle at 90% 0%,
              rgba(255, 255, 255, 0.045),
              transparent 35%
            ),
            #0c0c0c;
          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.45),
            inset 0 1px 0 rgba(255, 255, 255, 0.025);
        }

        .heading p {
          margin: 0 0 13px;
          color: #666;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 2.5px;
        }

        .heading h1 {
          margin: 0;
          font-size: 47px;
          line-height: 0.9;
          letter-spacing: -2.5px;
        }

        .heading h1 span {
          color: #666;
        }

        .line {
          width: 100%;
          height: 1px;
          margin: 30px 0;
          background: #242424;
        }

        form label {
          display: block;
          margin-bottom: 20px;
          color: #777;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1.8px;
        }

        form input {
          width: 100%;
          height: 48px;
          margin-top: 8px;
          padding: 0 14px;
          border: 1px solid #242424;
          border-radius: 3px;
          outline: none;
          background: #080808;
          color: #eee;
          font-size: 12px;
          transition: border-color 0.2s ease;
        }

        form input::placeholder {
          color: #383838;
        }

        form input:focus {
          border-color: #555;
        }

        .password-wrapper {
          position: relative;
        }

        .password-wrapper input {
          padding-right: 65px;
        }

        .password-wrapper button {
          position: absolute;
          top: 50%;
          right: 13px;
          transform: translateY(-50%);
          padding: 5px;
          border: 0;
          background: transparent;
          color: #555;
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .password-wrapper button:hover {
          color: #aaa;
        }

        .error {
          display: flex;
          align-items: center;
          gap: 9px;
          margin: -3px 0 18px;
          padding: 11px 12px;
          border: 1px solid #3d2424;
          background: #160d0d;
          color: #c78d8d;
          font-size: 9px;
          line-height: 1.4;
        }

        .error span {
          width: 17px;
          height: 17px;
          display: flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border: 1px solid #6b4444;
          border-radius: 50%;
          font-size: 9px;
          font-weight: 900;
        }

        .submit {
          width: 100%;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
          padding: 0 17px;
          border: 0;
          border-radius: 3px;
          background: #f0ede6;
          color: #080808;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.5px;
          transition:
            transform 0.2s ease,
            opacity 0.2s ease;
        }

        .submit:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .submit:disabled {
          opacity: 0.55;
          cursor: wait;
        }

        .submit > span:last-child {
          font-size: 17px;
          font-weight: 400;
        }

        .back {
          margin-top: 25px;
          text-align: center;
        }

        .back a {
          color: #555;
          font-size: 9px;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .back a:hover {
          color: #aaa;
        }

        footer {
          display: flex;
          justify-content: space-between;
          margin-top: 18px;
          padding: 0 4px;
          color: #383838;
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        @media (max-width: 500px) {
          .login-container {
            width: min(100% - 24px, 430px);
          }

          .login-card {
            padding: 30px 22px;
          }

          .heading h1 {
            font-size: 40px;
          }

          .brand {
            margin-bottom: 20px;
          }

          footer {
            font-size: 6px;
          }
        }
      }</style>
    </main>
  );
}