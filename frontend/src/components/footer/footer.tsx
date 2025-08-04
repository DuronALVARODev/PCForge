// components/footer/Footer.tsx
'use client'
import React from 'react';
import Link from 'next/link';
import { Instagram, Youtube, Facebook, Linkedin } from 'lucide-react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      {/* Main Footer Content */}
      <div className="footer-container">
        <div className="footer-grid">
          
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="brand-logo">
              {/* TODO: Cambiar por <Image /> de next/image para optimización */}
              <img 
                src="/images/Logo.png" 
                alt="Logo" 
                className="logo-image"
              />
            </div>
            <p className="brand-description">
              Construye tu PC gaming perfecta con nuestra herramienta integral de construcción de PC. 
              Compara componentes, verifica compatibilidad y crea la configuración gaming definitiva.
            </p>
            
            {/* Social Media Icons */}
            <div className="social-links">
              <a href="#" className="social-link">
                <Instagram size={20} />
              </a>
              <a href="#" className="social-link">
                <Youtube size={20} />
              </a>
              <div className="social-link">
                {/* X (Twitter) Icon - Custom SVG */}
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              <a href="#" className="social-link">
                <Facebook size={20} />
              </a>
              <a href="#" className="social-link">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="footer-section">
            <h3 className="section-title">Navegación</h3>
            <div className="section-links">
              <Link href="/" className="footer-link footer-link-active">
                Inicio
              </Link>
              <Link href="../../pc-build" className="footer-link">
                Constructor de PC
              </Link>
              <Link href="../../products" className="footer-link">
                Productos
              </Link>
              <Link href="/about" className="footer-link">
                Acerca de
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <div className="footer-bottom-content">
            <div className="copyright">
              © 2024 PC Builder. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;