"use client"
import React from 'react';
import './about.css';

const AcercaDe = () => {
  const features = [
    {
      icon: '🔧',
      title: 'Verificación de Compatibilidad',
      description: 'Nuestro sistema verifica automáticamente la compatibilidad entre todos los componentes de tu build, evitando errores costosos.'
    },
    {
      icon: '💾',
      title: 'Guarda tus Builds',
      description: 'Crea tu perfil y guarda todas tus configuraciones de PC. Compártelas con amigos mediante un link único.'
    },
    {
      icon: '🎯',
      title: 'Catálogo Centralizado',
      description: 'Accede a miles de componentes de diferentes marcas y categorías desde una sola plataforma.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Componentes' },
    { number: '50+', label: 'Marcas' },
    { number: '15+', label: 'Retailers' },
    { number: '99.9%', label: 'Precisión' }
  ];

  return (
    <main className="about-container">
      {/* Hero Section */}
      <section className="about-hero-section">
        <div className="about-hero-wrapper">
          <div className="about-hero-image">
            <img 
              src="/images/aboutBG.png"
              alt="Componentes de PC - Procesadores, GPU, Memoria RAM y más" 
              className="about-hero-img"
            />
          </div>
          <div className="about-hero-content">
            <div className="about-hero-badge">
              <span className="about-badge-text">Tu plataforma de confianza</span>
            </div>
            <h1 className="about-main-title">
              Sobre <span className="about-brand-highlight">PC Forge</span>
            </h1>
            <p className="about-hero-subtitle">
              La herramienta más completa para armar tu PC perfecta
            </p>
            <p className="about-hero-description">
              PC Forge es tu aliado definitivo en el mundo del hardware. No somos una tienda, 
              somos la plataforma que conecta toda la información que necesitas para tomar 
              las mejores decisiones al armar tu computadora.
            </p>
            <div className="about-hero-stats">
              <div className="about-hero-stat">
                <div className="about-stat-number-hero">10K+</div>
                <div className="about-stat-label-hero">Componentes</div>
              </div>
              <div className="about-hero-stat">
                <div className="about-stat-number-hero">50+</div>
                <div className="about-stat-label-hero">Marcas</div>
              </div>
              <div className="about-hero-stat">
                <div className="about-stat-number-hero">15+</div>
                <div className="about-stat-label-hero">Retailers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission-section">
        <div className="about-section-wrapper">
          <h2 className="about-section-title">Nuestra Misión</h2>
          <div className="about-mission-grid">
            <div className="about-mission-text">
              <p>
                Creemos que armar una PC no debería ser complicado ni costoso. Por eso creamos 
                PC Forge: una plataforma que centraliza toda la información de componentes, 
                verifica su compatibilidad y te conecta directamente con los mejores precios 
                del mercado.
              </p>
              <p>
                Nuestro objetivo es democratizar el conocimiento sobre hardware y hacer que 
                cualquier persona, sin importar su nivel de experiencia, pueda armar la 
                computadora de sus sueños.
              </p>
            </div>
            <div className="about-mission-visual">
              <div className="about-stats-grid">
                {stats.map((stat, index) => (
                  <div key={index} className="about-stat-card">
                    <div className="about-stat-number">{stat.number}</div>
                    <div className="about-stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="about-features-section">
        <div className="about-section-wrapper">
          <h2 className="about-section-title">¿Qué te Ofrecemos?</h2>
          <div className="about-features-grid">
            {features.map((feature, index) => (
              <div key={index} className="about-feature-card">
                <div className="about-feature-icon">{feature.icon}</div>
                <h3 className="about-feature-title">{feature.title}</h3>
                <p className="about-feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="about-process-section">
        <div className="about-section-wrapper">
          <h2 className="about-section-title">¿Cómo Funciona?</h2>
          <div className="about-process-steps">
            <div className="about-step">
              <div className="about-step-number">1</div>
              <div className="about-step-content">
                <h3>Explora Componentes</h3>
                <p>Navega por nuestro extenso catálogo de componentes de las mejores marcas</p>
              </div>
            </div>
            <div className="about-step">
              <div className="about-step-number">2</div>
              <div className="about-step-content">
                <h3>Verifica Compatibilidad</h3>
                <p>Nuestro sistema valida automáticamente que todos los componentes funcionen juntos</p>
              </div>
            </div>
            <div className="about-step">
              <div className="about-step-number">3</div>
              <div className="about-step-content">
                <h3>Compara Precios</h3>
                <p>Ve los mejores precios de múltiples retailers y elige dónde comprar</p>
              </div>
            </div>
            <div className="about-step">
              <div className="about-step-number">4</div>
              <div className="about-step-content">
                <h3>Guarda y Comparte</h3>
                <p>Guarda tu build en tu perfil y compártela con la comunidad</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta-section">
        <div className="about-cta-content">
          <h2 className="about-cta-title">¿Listo para Armar tu PC?</h2>
          <p className="about-cta-description">
            Únete a miles de usuarios que ya confían en PC Forge para crear sus builds perfectas
          </p>
          <div className="about-cta-buttons">
            <button className="about-btn-primary">Comenzar Ahora</button>
            <button className="about-btn-secondary">Ver Builds Populares</button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AcercaDe;