'use client';

import { createClient } from '@/lib/supabase';
import { useEffect, useState } from 'react';

const whatsappMessage =
  'Hola Bella Tinta, quiero consultar para reservar un turno para un tatuaje.';

const whatsappUrl = `https://wa.me/5493442315080?text=${encodeURIComponent(
  whatsappMessage
)}`;

const instagramUrl = 'https://www.instagram.com/bellatintaa_tatoo/';

type Trabajo = {
  id: string;
  image: string;
  alt: string;
};


export default function Home() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [trabajos, setTrabajos] = useState<Trabajo[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function loadGallery() {
      const { data, error } = await supabase
        .from('gallery')
        .select('id, image_url, alt')
        .eq('active', true)
        .order('position', { ascending: true });

      if (error) {
        console.error('ERROR GALERIA:', error);
        return;
      }

      setTrabajos(
        (data || []).map((item) => ({
          id: item.id,
          image: item.image_url,
          alt: item.alt || 'Tatuaje realizado en Bella Tinta',
        }))
      );
    }

    loadGallery();
  }, []);

  const closeMenu = () => setMenuOpen(false);

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedImage === null) return;

      if (event.key === 'Escape') {
        closeGallery();
      }

      if (event.key === 'ArrowRight') {
        nextImage();
      }

      if (event.key === 'ArrowLeft') {
        previousImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage]);

  useEffect(() => {
    document.body.style.overflow =
      selectedImage !== null ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedImage]);

  return (
    <>
      <style jsx global>{`
        :root {
          --bg: #080808;
          --bg-soft: #0e0e0e;
          --card: #121212;
          --card-light: #171717;
          --white: #f4f1eb;
          --muted: #9b9b9b;
          --line: rgba(255, 255, 255, 0.09);
          --accent: #ffffff;
        }

        * {
          box-sizing: border-box;
          scroll-behavior: smooth;
        }

        html {
          background: var(--bg);
        }

        body {
          margin: 0;
          background: var(--bg);
          color: var(--white);
          font-family:
            Arial,
            Helvetica,
            sans-serif;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        button {
          font: inherit;
        }

        ::selection {
          background: #fff;
          color: #000;
        }

        .bt-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(255, 255, 255, 0.055),
              transparent 34%
            ),
            var(--bg);
        }

        /* ---------------- NAV ---------------- */

        .bt-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 7%;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(8, 8, 8, 0.72);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .bt-logo {
          display: flex;
          align-items: center;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: #111;
        }

        .bt-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .bt-desktop-nav {
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .bt-desktop-nav a {
          color: #a9a9a9;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          transition: color 0.25s ease;
        }

        .bt-desktop-nav a:hover {
          color: #fff;
        }

        .bt-nav-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          padding: 0 18px;
          background: #f4f1eb;
          color: #080808 !important;
          border-radius: 999px;
          font-size: 10px !important;
          letter-spacing: 1.2px !important;
        }

        .bt-menu-button {
          display: none;
          width: 44px;
          height: 44px;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 5px;
          border: 0;
          background: transparent;
          color: white;
          cursor: pointer;
        }

        .bt-menu-button span {
          display: block;
          width: 22px;
          height: 1px;
          background: #fff;
          transition: transform 0.25s ease;
        }

        .bt-mobile-menu {
          position: fixed;
          inset: 76px 0 auto 0;
          z-index: 99;
          padding: 24px 7% 30px;
          background: rgba(8, 8, 8, 0.97);
          border-bottom: 1px solid var(--line);
          backdrop-filter: blur(20px);
        }

        .bt-mobile-menu a {
          display: block;
          padding: 17px 0;
          border-bottom: 1px solid var(--line);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        /* ---------------- HERO ---------------- */

        .bt-hero {
          position: relative;
          min-height: 100svh;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          padding: 150px 7% 70px;
          isolation: isolate;
        }

        .bt-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: -3;
          background:
            linear-gradient(
              180deg,
              rgba(0, 0, 0, 0.3) 0%,
              rgba(0, 0, 0, 0.35) 35%,
              rgba(0, 0, 0, 0.92) 88%,
              #080808 100%
            ),
            radial-gradient(
              circle at 70% 25%,
              rgba(255, 255, 255, 0.08),
              transparent 30%
            );
        }

        .bt-hero::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: -2;
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.025) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.025) 1px,
              transparent 1px
            );
          background-size: 45px 45px;
          mask-image: linear-gradient(to bottom, black, transparent 75%);
          opacity: 0.5;
        }

        .bt-hero-content {
          width: 100%;
          max-width: 850px;
        }

        .bt-eyebrow {
          margin: 0 0 18px;
          color: #a6a6a6;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 4px;
        }

        .bt-hero h1 {
          margin: 0;
          max-width: 800px;
          font-size: clamp(56px, 11vw, 118px);
          line-height: 0.86;
          font-weight: 900;
          letter-spacing: -5px;
          text-transform: uppercase;
        }

        .bt-hero h1 span {
          color: transparent;
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.7);
        }

        .bt-hero-description {
          max-width: 480px;
          margin: 30px 0 28px;
          color: #b2b2b2;
          font-size: 15px;
          line-height: 1.7;
        }

        .bt-hero-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .bt-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
          padding: 0 24px;
          border-radius: 999px;
          background: #f4f1eb;
          color: #080808;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.7px;
          transition:
            transform 0.25s ease,
            background 0.25s ease;
        }

        .bt-primary:hover {
          transform: translateY(-2px);
          background: #fff;
        }

        .bt-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
          padding: 0 23px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #ddd;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.7px;
          transition:
            background 0.25s ease,
            border-color 0.25s ease;
        }

        .bt-secondary:hover {
          background: rgba(255, 255, 255, 0.07);
          border-color: rgba(255, 255, 255, 0.35);
        }

        .bt-scroll {
          position: absolute;
          right: 7%;
          bottom: 72px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #666;
          font-size: 9px;
          letter-spacing: 2px;
          writing-mode: vertical-rl;
        }

        .bt-scroll::before {
          content: '';
          width: 1px;
          height: 48px;
          background: #555;
        }

        /* ---------------- SECTIONS ---------------- */

        .bt-section {
          width: min(1180px, 100%);
          margin: 0 auto;
          padding: 110px 7%;
        }

        .bt-section-heading {
          display: grid;
          grid-template-columns: 0.7fr 1.5fr;
          gap: 40px;
          align-items: end;
          margin-bottom: 50px;
        }

        .bt-section h2 {
          margin: 0;
          font-size: clamp(42px, 7vw, 78px);
          line-height: 0.95;
          letter-spacing: -3px;
          text-transform: uppercase;
        }

        .bt-section h2 span {
          color: #888;
        }

        .bt-intro {
          margin: 0;
          max-width: 390px;
          color: #8d8d8d;
          font-size: 14px;
          line-height: 1.8;
        }

        /* ---------------- GALLERY ---------------- */

        .bt-gallery {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .bt-gallery-card {
          position: relative;
          aspect-ratio: 1 / 1.16;
          padding: 0;
          overflow: hidden;
          border: 0;
          background: #111;
          cursor: pointer;
        }

        .bt-gallery-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.5),
            transparent 45%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .bt-gallery-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: grayscale(8%);
          transition:
            transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1),
            filter 0.4s ease;
        }

        .bt-gallery-card:hover img {
          transform: scale(1.06);
          filter: grayscale(0%);
        }

        .bt-gallery-card:hover::after {
          opacity: 1;
        }

        .bt-gallery-number {
          position: absolute;
          left: 14px;
          bottom: 13px;
          z-index: 2;
          color: white;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 2px;
          opacity: 0;
          transform: translateY(5px);
          transition: all 0.3s ease;
        }

        .bt-gallery-card:hover .bt-gallery-number {
          opacity: 1;
          transform: translateY(0);
        }

        /* ---------------- PROCESS ---------------- */

        .bt-process {
          position: relative;
          overflow: hidden;
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background:
            radial-gradient(
              circle at 80% 50%,
              rgba(255, 255, 255, 0.04),
              transparent 35%
            ),
            #0b0b0b;
        }

        .bt-process-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 70px;
          align-items: center;
        }

        .bt-process-copy {
          padding: 110px 7%;
        }

        .bt-process-copy h2 {
          margin: 0;
          font-size: clamp(45px, 7vw, 78px);
          line-height: 0.94;
          letter-spacing: -3px;
          text-transform: uppercase;
        }

        .bt-process-copy h2 span {
          color: #777;
        }

        .bt-process-copy p {
          max-width: 480px;
          margin: 28px 0 0;
          color: #969696;
          font-size: 14px;
          line-height: 1.8;
        }

        .bt-process-list {
          margin-right: 7%;
          border-top: 1px solid var(--line);
        }

        .bt-process-item {
          display: grid;
          grid-template-columns: 55px 1fr;
          gap: 18px;
          padding: 25px 0;
          border-bottom: 1px solid var(--line);
        }

        .bt-process-number {
          color: #777;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .bt-process-item h3 {
          margin: 0 0 8px;
          font-size: 17px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: -0.2px;
        }

        .bt-process-item p {
          margin: 0;
          color: #777;
          font-size: 13px;
          line-height: 1.65;
        }

        /* ---------------- ABOUT ---------------- */

        .bt-about {
          position: relative;
          padding: 130px 7%;
          background: #f1eee8;
          color: #090909;
          overflow: hidden;
        }

        .bt-about::before {
          content: 'BT';
          position: absolute;
          right: -35px;
          top: 20px;
          font-size: min(35vw, 480px);
          line-height: 1;
          font-weight: 900;
          color: rgba(0, 0, 0, 0.035);
          letter-spacing: -35px;
        }

        .bt-about-inner {
          position: relative;
          z-index: 1;
          width: min(1100px, 100%);
          margin: auto;
        }

        .bt-about .bt-eyebrow {
          color: #777;
        }

        .bt-about h2 {
          max-width: 800px;
          margin: 0;
          font-size: clamp(50px, 8vw, 92px);
          line-height: 0.9;
          letter-spacing: -5px;
          text-transform: uppercase;
        }

        .bt-about h2 span {
          color: #777;
        }

        .bt-about-text {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
          max-width: 900px;
          margin-top: 50px;
        }

        .bt-about-text p {
          margin: 0;
          color: #555;
          font-size: 14px;
          line-height: 1.9;
        }

        /* ---------------- FAQ ---------------- */

        .bt-faq-list {
          max-width: 850px;
          margin-left: auto;
          border-top: 1px solid var(--line);
        }

        .bt-faq-list details {
          border-bottom: 1px solid var(--line);
        }

        .bt-faq-list summary {
          position: relative;
          list-style: none;
          padding: 25px 45px 25px 0;
          cursor: pointer;
          font-size: 15px;
          font-weight: 700;
        }

        .bt-faq-list summary::-webkit-details-marker {
          display: none;
        }

        .bt-faq-list summary::after {
          content: '+';
          position: absolute;
          right: 0;
          top: 20px;
          color: #777;
          font-size: 24px;
          font-weight: 300;
          transition: transform 0.25s ease;
        }

        .bt-faq-list details[open] summary::after {
          transform: rotate(45deg);
        }

        .bt-faq-list p {
          max-width: 650px;
          margin: -5px 0 25px;
          padding-right: 30px;
          color: #777;
          font-size: 13px;
          line-height: 1.8;
        }

        /* ---------------- INSTAGRAM ---------------- */

        .bt-instagram {
          padding: 115px 7%;
          text-align: center;
          border-top: 1px solid var(--line);
          background:
            radial-gradient(
              circle at 50% 100%,
              rgba(255, 255, 255, 0.05),
              transparent 45%
            ),
            #0b0b0b;
        }

        .bt-instagram h2 {
          margin: 0;
          font-size: clamp(48px, 8vw, 88px);
          line-height: 0.9;
          letter-spacing: -4px;
          text-transform: uppercase;
        }

        .bt-instagram h2 span {
          color: #777;
        }

        .bt-instagram p:not(.bt-eyebrow) {
          max-width: 480px;
          margin: 25px auto 30px;
          color: #858585;
          font-size: 14px;
          line-height: 1.8;
        }

        .bt-instagram-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
          padding: 0 25px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.5px;
          transition:
            background 0.25s ease,
            color 0.25s ease;
        }

        .bt-instagram-button:hover {
          background: #fff;
          color: #000;
        }

        /* ---------------- CONTACT ---------------- */

        .bt-contact {
          position: relative;
          padding: 125px 7% 135px;
          text-align: center;
          overflow: hidden;
          background: #f1eee8;
          color: #090909;
        }

        .bt-contact .bt-eyebrow {
          color: #777;
        }

        .bt-contact h2 {
          margin: 0;
          font-size: clamp(56px, 10vw, 112px);
          line-height: 0.85;
          letter-spacing: -6px;
          text-transform: uppercase;
        }

        .bt-contact p:not(.bt-eyebrow) {
          max-width: 440px;
          margin: 28px auto;
          color: #666;
          font-size: 14px;
          line-height: 1.8;
        }

        .bt-contact-buttons {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .bt-contact-buttons a {
          min-width: 150px;
          min-height: 50px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.5px;
          border: 1px solid #111;
          transition:
            background 0.25s ease,
            color 0.25s ease;
        }

        .bt-contact-buttons a:first-child {
          background: #090909;
          color: #fff;
        }

        .bt-contact-buttons a:first-child:hover {
          background: #333;
        }

        .bt-contact-buttons a:last-child {
          color: #111;
        }

        .bt-contact-buttons a:last-child:hover {
          background: #090909;
          color: #fff;
        }

        /* ---------------- FOOTER ---------------- */

        .bt-footer {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 20px;
          padding: 35px 7%;
          background: #070707;
          color: #666;
          border-top: 1px solid var(--line);
        }

        .bt-footer-brand {
          color: #ddd;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .bt-footer p {
          margin: 0;
          font-size: 10px;
          letter-spacing: 1px;
        }

        .bt-footer a {
          justify-self: end;
          font-size: 10px;
          letter-spacing: 1px;
        }

        /* ---------------- LIGHTBOX ---------------- */

        .bt-lightbox {
          position: fixed;
          inset: 0;
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
          background: rgba(0, 0, 0, 0.96);
          backdrop-filter: blur(12px);
          animation: btFadeIn 0.2s ease;
        }

        @keyframes btFadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        .bt-lightbox-content {
          position: relative;
          max-width: min(900px, 82vw);
          max-height: 88vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .bt-lightbox-content img {
          max-width: 100%;
          max-height: 82vh;
          display: block;
          object-fit: contain;
        }

        .bt-lightbox-counter {
          margin: 14px 0 0;
          color: #666;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 3px;
        }

        .bt-lightbox-close,
        .bt-lightbox-prev,
        .bt-lightbox-next {
          position: absolute;
          z-index: 5;
          border: 0;
          color: white;
          background: rgba(255, 255, 255, 0.08);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .bt-lightbox-close:hover,
        .bt-lightbox-prev:hover,
        .bt-lightbox-next:hover {
          background: rgba(255, 255, 255, 0.18);
        }

        .bt-lightbox-close {
          top: 25px;
          right: 25px;
          font-size: 27px;
          font-weight: 200;
        }

        .bt-lightbox-prev {
          left: 25px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 32px;
          font-weight: 200;
        }

        .bt-lightbox-next {
          right: 25px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 32px;
          font-weight: 200;
        }

        /* ---------------- FLOATING WHATSAPP ---------------- */

        .bt-floating-whatsapp {
          position: fixed;
          right: 18px;
          bottom: 18px;
          z-index: 90;
          display: flex;
          align-items: center;
          gap: 9px;
          min-height: 50px;
          padding: 0 17px;
          border-radius: 999px;
          background: #f4f1eb;
          color: #090909;
          box-shadow: 0 10px 35px rgba(0, 0, 0, 0.35);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.3px;
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .bt-floating-whatsapp:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 40px rgba(0, 0, 0, 0.45);
        }

        .bt-wa-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #111;
        }

        /* ---------------- MOBILE ---------------- */

        @media (max-width: 800px) {
          .bt-nav {
            height: 68px;
            padding: 0 18px;
          }

          .bt-logo {
            width: 44px;
            height: 44px;
          }

          .bt-desktop-nav {
            display: none;
          }

          .bt-menu-button {
            display: flex;
          }

          .bt-mobile-menu {
            inset: 68px 0 auto 0;
            padding: 18px 22px 25px;
          }

          .bt-hero {
            min-height: 100svh;
            padding: 120px 22px 46px;
            align-items: flex-end;
          }

          .bt-hero::after {
            background-size: 32px 32px;
          }

          .bt-eyebrow {
            margin-bottom: 15px;
            font-size: 9px;
            letter-spacing: 3px;
          }

          .bt-hero h1 {
            font-size: clamp(52px, 16vw, 82px);
            letter-spacing: -4px;
            line-height: 0.88;
          }

          .bt-hero-description {
            margin: 23px 0 23px;
            font-size: 13px;
            line-height: 1.7;
            max-width: 330px;
          }

          .bt-hero-actions {
            width: 100%;
          }

          .bt-primary,
          .bt-secondary {
            min-height: 50px;
            flex: 1;
            padding: 0 13px;
            font-size: 9px;
            letter-spacing: 1.2px;
          }

          .bt-scroll {
            display: none;
          }

          .bt-section {
            padding: 76px 18px;
          }

          .bt-section-heading {
            display: block;
            margin-bottom: 32px;
          }

          .bt-section h2 {
            font-size: clamp(42px, 14vw, 62px);
            letter-spacing: -3px;
            margin-bottom: 20px;
          }

          .bt-intro {
            font-size: 13px;
          }

          .bt-gallery {
            grid-template-columns: repeat(2, 1fr);
            gap: 5px;
          }

          .bt-gallery-card {
            aspect-ratio: 1 / 1.22;
          }

          .bt-gallery-number {
            opacity: 1;
            transform: none;
            left: 9px;
            bottom: 8px;
            font-size: 8px;
          }

          .bt-process {
            padding: 0;
          }

          .bt-process-grid {
            display: block;
          }

          .bt-process-copy {
            padding: 78px 18px 45px;
          }

          .bt-process-copy h2 {
            font-size: clamp(45px, 14vw, 65px);
            letter-spacing: -3px;
          }

          .bt-process-copy p {
            font-size: 13px;
            margin-top: 22px;
          }

          .bt-process-list {
            margin: 0 18px 65px;
          }

          .bt-process-item {
            grid-template-columns: 40px 1fr;
            gap: 10px;
            padding: 22px 0;
          }

          .bt-process-item h3 {
            font-size: 15px;
          }

          .bt-process-item p {
            font-size: 12px;
          }

          .bt-about {
            padding: 85px 18px;
          }

          .bt-about::before {
            font-size: 70vw;
            right: -25px;
            top: 30px;
          }

          .bt-about h2 {
            font-size: clamp(48px, 15vw, 70px);
            letter-spacing: -4px;
          }

          .bt-about-text {
            display: block;
            margin-top: 35px;
          }

          .bt-about-text p {
            font-size: 13px;
            line-height: 1.8;
            margin-bottom: 22px;
          }

          .bt-faq-list {
            margin: 0;
          }

          .bt-faq-list summary {
            padding: 21px 35px 21px 0;
            font-size: 13px;
            line-height: 1.4;
          }

          .bt-faq-list summary::after {
            top: 17px;
          }

          .bt-faq-list p {
            font-size: 12px;
            line-height: 1.75;
          }

          .bt-instagram {
            padding: 80px 18px;
          }

          .bt-instagram h2 {
            font-size: clamp(47px, 15vw, 70px);
            letter-spacing: -4px;
          }

          .bt-instagram p:not(.bt-eyebrow) {
            font-size: 13px;
          }

          .bt-contact {
            padding: 85px 18px 105px;
          }

          .bt-contact h2 {
            font-size: clamp(52px, 17vw, 80px);
            letter-spacing: -5px;
          }

          .bt-contact p:not(.bt-eyebrow) {
            font-size: 13px;
          }

          .bt-contact-buttons {
            width: 100%;
          }

          .bt-contact-buttons a {
            flex: 1;
            min-width: 130px;
          }

          .bt-footer {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 32px 18px 85px;
            gap: 14px;
          }

          .bt-footer a {
            justify-self: auto;
          }

          .bt-lightbox {
            padding: 18px;
          }

          .bt-lightbox-content {
            max-width: 100%;
            max-height: 82vh;
          }

          .bt-lightbox-content img {
            max-height: 75vh;
            max-width: 100%;
          }

          .bt-lightbox-close {
            top: 15px;
            right: 15px;
            width: 43px;
            height: 43px;
          }

          .bt-lightbox-prev,
          .bt-lightbox-next {
            top: auto;
            bottom: 22px;
            transform: none;
            width: 44px;
            height: 44px;
          }

          .bt-lightbox-prev {
            left: 22px;
          }

          .bt-lightbox-next {
            right: 22px;
          }

          .bt-lightbox-counter {
            margin-bottom: 60px;
          }

          .bt-floating-whatsapp {
            right: 14px;
            bottom: 14px;
            min-height: 47px;
            padding: 0 15px;
            font-size: 8px;
          }
        }

        @media (max-width: 380px) {
          .bt-hero h1 {
            font-size: 48px;
            letter-spacing: -3px;
          }

          .bt-primary,
          .bt-secondary {
            font-size: 8px;
          }

          .bt-gallery {
            gap: 4px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <main className="bt-page">
        {/* NAVBAR */}

        <header className="bt-nav">
          <a href="#" className="bt-logo" aria-label="Bella Tinta">
            <img
              src="/logo.jpg"
              alt="Bella Tinta Tattoo Studio"
            />
          </a>

          <nav className="bt-desktop-nav">
            <a href="#trabajos">TRABAJOS</a>
            <a href="#proceso">PROCESO</a>
            <a href="#nosotros">NOSOTROS</a>
            <a href="#faq">FAQ</a>
            <a href="#contacto">CONTACTO</a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="bt-nav-cta"
            >
              RESERVAR
            </a>
          </nav>

          <button
            className="bt-menu-button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            type="button"
          >
            <span />
            <span />
            <span />
          </button>
        </header>

        {/* MOBILE MENU */}

        {menuOpen && (
          <nav className="bt-mobile-menu">
            <a href="#trabajos" onClick={closeMenu}>
              TRABAJOS
            </a>

            <a href="#proceso" onClick={closeMenu}>
              PROCESO
            </a>

            <a href="#nosotros" onClick={closeMenu}>
              NOSOTROS
            </a>

            <a href="#faq" onClick={closeMenu}>
              FAQ
            </a>

            <a href="#contacto" onClick={closeMenu}>
              CONTACTO
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              onClick={closeMenu}
            >
              RESERVAR TURNO →
            </a>
          </nav>
        )}

        {/* HERO */}

        <section className="bt-hero">
          <div className="bt-hero-content">
            <p className="bt-eyebrow">
              BELLA TINTA · TATTOO STUDIO
            </p>

            <h1>
              TU PIEL.
              <br />
              <span>TU HISTORIA.</span>
            </h1>

            <p className="bt-hero-description">
              Tatuajes pensados para vos. Diseños personalizados,
              atención cercana y una obsesión por cada detalle.
            </p>

            <div className="bt-hero-actions">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="bt-primary"
              >
                RESERVAR TURNO
              </a>

              <a href="#trabajos" className="bt-secondary">
                VER TRABAJOS
              </a>
            </div>
          </div>

          <div className="bt-scroll">SCROLL</div>
        </section>

        {/* PORTFOLIO */}

        <section id="trabajos" className="bt-section">
          <div className="bt-section-heading">
            <div>
              <p className="bt-eyebrow">
                01 · PORTFOLIO
              </p>
            </div>

            <div>
              <h2>
                Trabajos
                <br />
                <span>recientes.</span>
              </h2>

              <p className="bt-intro">
                Una selección de tatuajes realizados en Bella Tinta.
                Tocá cualquier imagen para verla en detalle.
              </p>
            </div>
          </div>

          <div className="bt-gallery">
            {trabajos.map((trabajo) => (
              <button
                key={trabajo.id}
                className="bt-gallery-card"
                onClick={() =>
                  setSelectedImage(trabajos.indexOf(trabajo) + 1)
                }
                aria-label={`Ver trabajo ${trabajos.indexOf(trabajo) + 1}`}
                type="button"
              >
                <img
                  src={trabajo.image}
                  alt={trabajo.alt}
                  loading={
                    trabajos.indexOf(trabajo) < 4 ? 'eager' : 'lazy'
                  }
                />

                <span className="bt-gallery-number">
                  {String(trabajos.indexOf(trabajo) + 1).padStart(2, '0')}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* LIGHTBOX */}

        {selectedImage !== null && (
          <div
            className="bt-lightbox"
            onClick={closeGallery}
            role="dialog"
            aria-modal="true"
            aria-label="Galería de tatuajes"
          >
            <button
              className="bt-lightbox-close"
              onClick={closeGallery}
              aria-label="Cerrar galería"
              type="button"
            >
              ×
            </button>

            <button
              className="bt-lightbox-prev"
              onClick={(event) => {
                event.stopPropagation();
                previousImage();
              }}
              aria-label="Trabajo anterior"
              type="button"
            >
              ‹
            </button>

            <div
              className="bt-lightbox-content"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <img
                src={trabajos[selectedImage - 1]?.image}
                alt={trabajos[selectedImage - 1]?.alt || "Tatuaje realizado en Bella Tinta"}
              />

              <p className="bt-lightbox-counter">
                {String(selectedImage).padStart(2, '0')} /{' '}
                {String(trabajos.length).padStart(2, '0')}
              </p>
            </div>

            <button
              className="bt-lightbox-next"
              onClick={(event) => {
                event.stopPropagation();
                nextImage();
              }}
              aria-label="Siguiente trabajo"
              type="button"
            >
              ›
            </button>
          </div>
        )}

        {/* PROCESS */}

        <section id="proceso" className="bt-process">
          <div className="bt-process-grid">
            <div className="bt-process-copy">
              <p className="bt-eyebrow">
                02 · EL PROCESO
              </p>

              <h2>
                Tu idea,
                <br />
                <span>hecha realidad.</span>
              </h2>

              <p>
                No se trata solamente de tatuar. Se trata de
                entender lo que querés, trabajar la idea y
                convertirla en algo que realmente quieras llevar
                en tu piel.
              </p>
            </div>

            <div className="bt-process-list">
              <div className="bt-process-item">
                <span className="bt-process-number">
                  01
                </span>

                <div>
                  <h3>Contanos tu idea</h3>

                  <p>
                    Mandanos una referencia, una imagen, un
                    dibujo o simplemente contanos qué tenés en
                    mente.
                  </p>
                </div>
              </div>

              <div className="bt-process-item">
                <span className="bt-process-number">
                  02
                </span>

                <div>
                  <h3>Diseñamos juntos</h3>

                  <p>
                    Trabajamos la propuesta para encontrar una
                    composición que funcione y represente tu
                    idea.
                  </p>
                </div>
              </div>

              <div className="bt-process-item">
                <span className="bt-process-number">
                  03
                </span>

                <div>
                  <h3>Coordinamos</h3>

                  <p>
                    Definimos los detalles y coordinamos el día
                    y horario para realizar tu tatuaje.
                  </p>
                </div>
              </div>

              <div className="bt-process-item">
                <span className="bt-process-number">
                  04
                </span>

                <div>
                  <h3>Lo llevamos a tu piel</h3>

                  <p>
                    Llegó el momento. Tu diseño pasa del papel
                    a tu piel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}

        <section id="nosotros" className="bt-about">
          <div className="bt-about-inner">
            <p className="bt-eyebrow">
              03 · BELLA TINTA
            </p>

            <h2>
              Arte que
              <br />
              <span>queda en tu piel.</span>
            </h2>

            <div className="bt-about-text">
              <p>
                Cada tatuaje cuenta una historia. En Bella Tinta
                buscamos transformar ideas en diseños únicos,
                cuidando cada detalle para que el resultado
                represente realmente a quien lo lleva.
              </p>

              <p>
                Trabajamos cada proyecto de manera personalizada.
                Escuchamos la idea, pensamos el diseño y buscamos
                que el resultado final sea algo que puedas sentir
                propio durante muchos años.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}

        <section id="faq" className="bt-section">
          <div className="bt-section-heading">
            <div>
              <p className="bt-eyebrow">
                04 · FAQ
              </p>
            </div>

            <div>
              <h2>
                Antes de
                <br />
                <span>tatuarte.</span>
              </h2>
            </div>
          </div>

          <div className="bt-faq-list">
            <details>
              <summary>
                ¿Cómo puedo reservar un turno?
              </summary>

              <p>
                Podés escribirnos directamente por WhatsApp.
                Contanos qué tatuaje tenés en mente y te ayudamos
                con los próximos pasos.
              </p>
            </details>

            <details>
              <summary>
                ¿Puedo llevar mi propio diseño?
              </summary>

              <p>
                Sí. Podés enviarnos tu diseño, referencia o idea
                para conversar sobre cómo adaptarlo correctamente
                a un tatuaje.
              </p>
            </details>

            <details>
              <summary>
                ¿Hacen diseños personalizados?
              </summary>

              <p>
                Sí. Trabajamos las ideas de manera personalizada
                para buscar un resultado que se adapte a lo que
                estás buscando.
              </p>
            </details>

            <details>
              <summary>
                ¿Qué estilos trabajan?
              </summary>

              <p>
                Podemos trabajar diferentes estilos y propuestas.
                Lo ideal es enviarnos tu referencia o idea para
                evaluar el proyecto.
              </p>
            </details>

            <details>
              <summary>
                ¿Dónde puedo ver más trabajos?
              </summary>

              <p>
                En nuestro Instagram podés encontrar más trabajos,
                novedades y contenido de Bella Tinta.
              </p>
            </details>
          </div>
        </section>

        {/* INSTAGRAM */}

        <section className="bt-instagram">
          <p className="bt-eyebrow">
            05 · SEGUINOS
          </p>

          <h2>
            Más trabajos,
            <br />
            <span>en Instagram.</span>
          </h2>

          <p>
            Descubrí más tatuajes, novedades y contenido de
            Bella Tinta en nuestro Instagram.
          </p>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="bt-instagram-button"
          >
            @BELLATINTAA_TATOO →
          </a>
        </section>

        {/* CONTACT */}

        <section id="contacto" className="bt-contact">
          <p className="bt-eyebrow">
            06 · CONTACTO
          </p>

          <h2>
            Hablemos
            <br />
            de tu idea.
          </h2>

          <p>
            ¿Ya sabés qué querés tatuarte? Escribinos y empezamos
            a darle forma.
          </p>

          <div className="bt-contact-buttons">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              WHATSAPP
            </a>

            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
            >
              INSTAGRAM
            </a>
          </div>
        </section>

        {/* FOOTER */}

        <footer className="bt-footer">
          <div className="bt-footer-brand">
            BELLA TINTA
          </div>

          <p>© 2026 Bella Tinta Tattoo</p>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
          >
            @bellatintaa_tatoo
          </a>
        </footer>

        {/* FLOATING WHATSAPP */}

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="bt-floating-whatsapp"
          aria-label="Contactar a Bella Tinta por WhatsApp"
        >
          <span className="bt-wa-dot" />
          RESERVAR TURNO
        </a>
      </main>
    </>
  );
}