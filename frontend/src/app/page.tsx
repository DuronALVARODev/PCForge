'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import './homepage.css';
import { Button } from '@/components/ui/button';
import { UserPlus, Cpu, CheckCircle2, User, Save } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

export default function HomePage() {
  useEffect(() => {
    document.title = 'Inicio | PCForge';
  }, []);
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
  };

  return (
    <main className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Consigue Tu
              <br />
              PC Perfecta
              <br />
              Hoy!
            </h1>
            <p className="hero-subtitle">
              Elige de Nuestra Selección Pre-Construida o Construye
              Tu Propia PC!
            </p>
            <div className="hero-buttons">
              <Button className='btn-primary'>Pre-Construida</Button>
              <Button className="btn-secondary">Construye Tu PC</Button>
            </div>
          </div>
          
        </div>
        
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section" >
        <motion.div className="how-it-works-content" initial={{ opacity: 0, x: 1000 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false }} transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}>
          <h2 className="section-title-white">¿Cómo Funciona?</h2>
          <p className="section-subtitle">Arma tu PC perfecta en 4 simples pasos</p>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <UserPlus className="step-icon text-primary w-8 h-8" />
              <h3>Regístrate o Entra</h3>
              <p>Crea tu cuenta o entra como invitado para comenzar</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <Cpu className="step-icon text-primary w-8 h-8" />
              <h3>Elegí tus Componentes</h3>
              <p>Selecciona de nuestra amplia gama de componentes de calidad</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <CheckCircle2 className="step-icon text-primary w-8 h-8" />
              <h3>Verificá Compatibilidad</h3>
              <p>Nuestro sistema verifica automáticamente la compatibilidad</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>

                <Save className="step-icon text-primary w-6 h-6" />

              <h3>Visualizá y Guardá</h3>
              <p>Ve tu build en 3D y guárdala para comprar después</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Call to Action Section */}


      {/* Featured Builds Section */}
      <section className="builds-section">
        <div className="builds-content">
          <div className="builds-header">
            <h2 className="section-title-black">Builds Destacadas</h2>
            <p className="section-subtitle">Configuraciones populares para inspirarte</p>
          </div>
          <div className="builds-grid">
            <div className="build-card gaming">
              <div className="build-image">
                <div className="build-overlay">
                  <span className="build-category">GAMING</span>
                </div>
              </div>
              <div className="build-info">
                <h3>PC Gaming Elite</h3>
                <p>RTX 4070 • Ryzen 7 7700X • 32GB RAM</p>
                <div className="build-price">$52,000</div>
                <button className="build-btn">Ver Build</button>
              </div>
            </div>
            <div className="build-card design">
              <div className="build-image">
                <div className="build-overlay">
                  <span className="build-category">DISEÑO</span>
                </div>
              </div>
              <div className="build-info">
                <h3>Workstation Creativa</h3>
                <p>RTX 4060 Ti • Intel i7-13700 • 64GB RAM</p>
                <div className="build-price">$68,000</div>
                <button className="build-btn">Ver Build</button>
              </div>
            </div>
            <div className="build-card programming">
              <div className="build-image">
                <div className="build-overlay">
                  <span className="build-category">CÓDIGO</span>
                </div>
              </div>
              <div className="build-info">
                <h3>Developer Pro</h3>
                <p>GTX 1660 Super • Ryzen 5 7600 • 32GB RAM</p>
                <div className="build-price">$35,000</div>
                <button className="build-btn">Ver Build</button>
              </div>
            </div>
            <div className="build-card budget">
              <div className="build-image">
                <div className="build-overlay">
                  <span className="build-category">ECONÓMICA</span>
                </div>
              </div>
              <div className="build-info">
                <h3>PC Entrada</h3>
                <p>GTX 1650 • Ryzen 5 5600G • 16GB RAM</p>
                <div className="build-price">$22,000</div>
                <button className="build-btn">Ver Build</button>
              </div>
            </div>
            <div className="build-card streaming">
              <div className="build-image">
                <div className="build-overlay">
                  <span className="build-category">STREAMING</span>
                </div>
              </div>
              <div className="build-info">
                <h3>Stream Master</h3>
                <p>RTX 4070 Super • Intel i9-13900K • 32GB RAM</p>
                <div className="build-price">$75,000</div>
                <button className="build-btn">Ver Build</button>
              </div>
            </div>
            <div className="build-card office">
              <div className="build-image">
                <div className="build-overlay">
                  <span className="build-category">OFICINA</span>
                </div>
              </div>
              <div className="build-info">
                <h3>Office Pro</h3>
                <p>Integrados • Intel i5-13400 • 16GB RAM</p>
                <div className="build-price">$18,000</div>
                <button className="build-btn">Ver Build</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
      <div className="testimonials-content">
        <h2 className="section-title-black">Lo Que Dicen Nuestros Usuarios</h2>
        <Slider {...settings} className="testimonials-carousel">
          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p>&quot;PCForge me ayudó a armar mi primera PC gaming. La verificación de compatibilidad me ahorró muchos dolores de cabeza.&quot;</p>
            <div className="testimonial-author">
              <User className="author-avatar" />
              <div className="author-info">
                <span className="author-name">Carlos M.</span>
                <span className="author-title">Gamer</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p>&quot;Como diseñador necesitaba una workstation potente. El equipo de PCForge me recomendó la configuración perfecta para mi presupuesto.&quot;</p>
            <div className="testimonial-author">
              <User className="author-avatar" />
              <div className="author-info">
                <span className="author-name">María L.</span>
                <span className="author-title">Diseñadora Gráfica</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p>&quot;La visualización 3D es increíble. Pude ver exactamente cómo se vería mi PC antes de comprarla. Definitivamente recomendado.&quot;</p>
            <div className="testimonial-author">
              <User className="author-avatar" />
              <div className="author-info">
                <span className="author-name">Roberto S.</span>
                <span className="author-title">Programador</span>
              </div>
            </div>
          </div>
        </Slider>
      </div>
    </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <div className="final-cta-content">
          <h2>¿Listo para Empezar?</h2>
          <p>Armá tu PC perfecta ahora mismo y lleva tu experiencia al siguiente nivel</p>
          <button className="cta-button">Configurar Ahora</button>
          <div className="cta-features">
            <span>✓ Gratis y sin compromiso</span>
            <span>✓ Verificación automática</span>
            <span>✓ Soporte experto</span>
          </div>
        </div>
      </section>
    </main>
  );
}