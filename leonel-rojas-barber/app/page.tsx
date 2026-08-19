'use client';

const WHATSAPP = '5493442676237';

const services = [
  {
    number: '01',
    title: 'Corte',
    description: 'Corte personalizado, prolijo y adaptado a tu estilo.',
  },
  {
    number: '02',
    title: 'Corte + Barba',
    description: 'El servicio completo para renovar tu look.',
  },
  {
    number: '03',
    title: 'Barba',
    description: 'Perfilado, definición y terminación de barba.',
  },
];

function reserve(service: string) {
  const message = `Hola Leonel! Quiero reservar un turno para ${service}. ¿Qué horarios tenés disponibles?`;
  const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;

  window.open(url, '_blank');
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080808] text-white">

      {/* HERO */}
      <section className="relative flex min-h-screen items-center px-6 py-24">

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-[#c9a227]/10 blur-[120px]" />
          <div className="absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-white/[0.025] blur-[100px]" />

          <div className="absolute right-[10%] top-[18%] hidden h-80 w-80 rounded-full border border-[#c9a227]/10 md:block" />
          <div className="absolute right-[13%] top-[21%] hidden h-64 w-64 rounded-full border border-white/[0.04] md:block" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl">

          <div className="max-w-4xl">

            <div className="mb-8 flex items-center gap-4">
              <span className="h-px w-12 bg-[#c9a227]" />

              <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#c9a227]">
                Barbería · Colorimetría
              </span>
            </div>

            <h1 className="text-[17vw] font-black uppercase leading-[0.78] tracking-[-0.08em] sm:text-8xl md:text-9xl">
              Leonel
              <br />
              <span className="text-[#c9a227]">Rojas</span>
            </h1>

            <div className="mt-10 max-w-xl">
              <p className="text-lg font-medium leading-8 text-white/70 sm:text-xl">
                Tu estilo empieza con un buen corte.
              </p>

              <p className="mt-3 text-sm leading-6 text-white/35">
                Cortes, barba y trabajos de colorimetría.
                Reservá tu turno directamente por WhatsApp.
              </p>
            </div>

            <button
              onClick={() => reserve('un turno')}
              className="group mt-10 inline-flex items-center gap-5 rounded-full bg-[#c9a227] px-8 py-5 text-xs font-black uppercase tracking-[0.18em] text-black transition duration-300 hover:scale-[1.03] hover:bg-[#e0bb3d]"
            >
              Reservar turno

              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-sm text-white transition group-hover:translate-x-1">
                →
              </span>
            </button>

          </div>

          <div className="mt-20 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-6 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30">
            <span>Lunes a sábado</span>
            <span>•</span>
            <span>Isaías Torres 923</span>
          </div>

        </div>
      </section>


      {/* SERVICES */}
      <section className="border-t border-white/10 px-6 py-28">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr]">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a227]">
                Servicios
              </p>

              <h2 className="mt-5 max-w-md text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                Elegí cómo querés verte.
              </h2>

              <p className="mt-5 max-w-sm text-sm leading-7 text-white/35">
                Seleccioná el servicio que querés y enviá tu solicitud
                directamente a Leonel.
              </p>
            </div>

            <div className="grid gap-3">

              {services.map((service) => (
                <article
                  key={service.number}
                  className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition duration-300 hover:border-[#c9a227]/40 hover:bg-white/[0.04] sm:p-7"
                >

                  <div className="flex items-start justify-between">

                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#c9a227]">
                      {service.number}
                    </span>

                    <span className="text-sm font-semibold text-white/50">
                      $XX.XXX
                    </span>

                  </div>

                  <h3 className="mt-8 text-2xl font-bold">
                    {service.title}
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-6 text-white/35">
                    {service.description}
                  </p>

                  <button
                    onClick={() => reserve(service.title)}
                    className="mt-7 flex w-full items-center justify-between rounded-xl border border-white/10 px-5 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition duration-300 group-hover:border-[#c9a227] group-hover:bg-[#c9a227] group-hover:text-black"
                  >
                    Reservar {service.title}

                    <span className="text-base">
                      ↗
                    </span>
                  </button>

                </article>
              ))}

            </div>

          </div>

        </div>
      </section>


      {/* COLORIMETRIA */}
      <section className="px-6 py-16">

        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[#c9a227]/25 bg-[#c9a227]/[0.05] p-8 sm:p-12 md:p-16">

          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#c9a227]/10 blur-[80px]" />

          <div className="relative grid gap-10 md:grid-cols-[1fr_auto] md:items-end">

            <div>

              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#c9a227]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a227]">
                  Servicio destacado
                </span>
              </div>

              <h2 className="mt-6 max-w-2xl text-4xl font-black uppercase leading-tight sm:text-6xl">
                Colorimetría.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/45">
                Trabajos de color personalizados para crear un estilo diferente
                y que realmente te represente.
              </p>

            </div>

            <div>

              <p className="mb-4 text-right text-sm font-semibold text-white/45">
                $XX.XXX
              </p>

              <button
                onClick={() => reserve('Colorimetría')}
                className="rounded-full bg-[#c9a227] px-7 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-black transition hover:scale-[1.03] hover:bg-[#e0bb3d]"
              >
                Consultar colorimetría →
              </button>

            </div>

          </div>

        </div>
      </section>


      {/* RESERVATION PROCESS */}
      <section className="px-6 py-28">

        <div className="mx-auto max-w-7xl">

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.025] p-8 sm:p-12 md:p-16">

            <div className="grid gap-14 md:grid-cols-2">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a227]">
                  Reservas
                </p>

                <h2 className="mt-5 max-w-lg text-4xl font-bold leading-tight sm:text-5xl">
                  Reservar tu turno es simple.
                </h2>

              </div>

              <div className="space-y-9">

                <div className="flex gap-6">
                  <span className="text-xs font-bold text-[#c9a227]">
                    01
                  </span>

                  <div>
                    <h3 className="font-semibold">
                      Elegí tu servicio
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/35">
                      Elegí entre corte, barba, combo o colorimetría.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <span className="text-xs font-bold text-[#c9a227]">
                    02
                  </span>

                  <div>
                    <h3 className="font-semibold">
                      Tocá reservar
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/35">
                      Se abrirá WhatsApp con el mensaje listo para enviar.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <span className="text-xs font-bold text-[#c9a227]">
                    03
                  </span>

                  <div>
                    <h3 className="font-semibold">
                      Coordiná tu horario
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/35">
                      Leonel te confirma el día y horario disponible.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* INFO */}
      <section className="border-t border-white/10 px-6 py-28">

        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2">

          <div className="rounded-2xl border border-white/10 p-8 sm:p-10">

            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a227]">
              Horarios
            </p>

            <h2 className="mt-5 text-3xl font-bold">
              Lunes a sábado.
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-6 text-white/35">
              Consultá la disponibilidad del día directamente con Leonel.
            </p>

            <button
              onClick={() => reserve('un turno')}
              className="mt-8 rounded-full border border-white/15 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition hover:border-[#c9a227] hover:bg-[#c9a227] hover:text-black"
            >
              Consultar horarios
            </button>

          </div>


          <div className="rounded-2xl border border-white/10 p-8 sm:p-10">

            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a227]">
              Ubicación
            </p>

            <h2 className="mt-5 text-3xl font-bold">
              Isaías Torres 923.
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-6 text-white/35">
              Encontrá la barbería y acercate a tu próximo turno.
            </p>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Isa%C3%ADas%20Torres%20923"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex rounded-full border border-white/15 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition hover:border-[#c9a227] hover:bg-[#c9a227] hover:text-black"
            >
              Abrir ubicación
            </a>

          </div>

        </div>

      </section>


      {/* CTA BEFORE GALLERY */}
      <section className="px-6 py-20">

        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#c9a227] px-8 py-14 text-black sm:px-12 md:px-16">

          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">

            <div>

              <p className="text-[10px] font-black uppercase tracking-[0.35em] opacity-60">
                ¿Listo para tu próximo look?
              </p>

              <h2 className="mt-4 max-w-2xl text-4xl font-black uppercase leading-tight tracking-tight sm:text-5xl">
                Reservá tu turno con Leonel.
              </h2>

            </div>

            <button
              onClick={() => reserve('un turno')}
              className="group flex items-center justify-center gap-4 rounded-full bg-black px-7 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white transition hover:scale-[1.03]"
            >
              Reservar por WhatsApp

              <span className="transition group-hover:translate-x-1">
                →
              </span>
            </button>

          </div>

        </div>

      </section>


      {/* GALLERY */}
      <section className="border-t border-white/10 px-6 py-28">

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a227]">
                Trabajos
              </p>

              <h2 className="mt-5 text-4xl font-bold sm:text-5xl">
                Galería.
              </h2>

            </div>

            <p className="max-w-sm text-sm leading-6 text-white/35">
              Próximamente vas a poder ver acá los cortes y trabajos de
              colorimetría de Leonel.
            </p>

          </div>


          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3">

            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
              >
                <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold uppercase tracking-[0.25em] text-white/15">
                  Foto {item}
                </div>
              </div>
            ))}

          </div>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 py-12">

        <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.15em]">
              Leonel Rojas
            </p>

            <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-white/30">
              Barbería · Colorimetría
            </p>

          </div>

          <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
            Isaías Torres 923 · Lunes a sábado
          </p>

        </div>

      </footer>


      {/* WHATSAPP FLOATING */}
      <button
        onClick={() => reserve('un turno')}
        aria-label="Reservar turno por WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#c9a227] text-black shadow-2xl transition duration-300 hover:scale-110 sm:h-auto sm:w-auto sm:px-6 sm:py-4"
      >

        <span className="text-lg sm:hidden">
          W
        </span>

        <span className="hidden text-[10px] font-black uppercase tracking-[0.18em] sm:inline">
          Reservar por WhatsApp
        </span>

      </button>

    </main>
  );
}