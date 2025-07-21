'use client'
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../app/context/AuthContext';
import './navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const { user, logout, loading } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setIsDropdownOpen(false);
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Cerrar dropdown si se hace clic afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-content">
            <div className="navbar-logo">
              <Link href="/" className="logo-link">
                <img src="/images/Logo.png" alt="Logo" className="logo-image" />
              </Link>
            </div>
            <div>Cargando...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo */}
          <div className="navbar-logo">
            <Link href="/" className="logo-link">
              <img src="/images/Logo.png" alt="Logo" className="logo-image" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="navbar-desktop">
            <div className="navbar-links">
              <Link href="/" className={`nav-link ${isActive('/') ? 'nav-link-active' : ''}`}>Inicio</Link>
              <Link href="../../pc-build" className={`nav-link ${isActive('/pc-build') ? 'nav-link-active' : ''}`}>Configurador PC</Link>
              <Link href="/products" className={`nav-link ${isActive('/products') ? 'nav-link-active' : ''}`}>Productos</Link>
              <Link href="/about" className={`nav-link ${isActive('/about') ? 'nav-link-active' : ''}`}>Acerca de</Link>
            </div>
          </div>

          {/* Auth Section */}
          <div className="navbar-auth">
            {!user ? (
              <div className="auth-buttons">
                <Link href="/login" className="auth-login">Iniciar Sesión</Link>
                <Link href="/register" className="auth-register">Registrarse</Link>
              </div>
            ) : (
              <div className="user-dropdown" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="user-button"
                  disabled={isLoggingOut}
                >
                  <span className="user-greeting">
                    {isLoggingOut ? 'Cerrando sesión...' : `Hola ${user.username || user.email}`}
                  </span>
                  <ChevronDown className={`chevron-icon ${isDropdownOpen ? 'chevron-rotate' : ''}`} />
                </button>

                {isDropdownOpen && !isLoggingOut && (
                  <div className="dropdown-menu">
                    <Link href="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                      <User className="dropdown-icon" />
                      Mi Perfil
                    </Link>
                    <Link href="/my-builds" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                      <Settings className="dropdown-icon" />
                      Mis Armados
                    </Link>
                    <button onClick={handleLogout} className="dropdown-item dropdown-logout" disabled={isLoggingOut}>
                      <LogOut className="dropdown-icon" />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="navbar-mobile-toggle">
            <button onClick={toggleMenu} className="mobile-toggle-button">
              {isOpen ? <X className="toggle-icon" /> : <Menu className="toggle-icon" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="navbar-mobile">
            <div className="mobile-menu">
              <Link href="/" className={`mobile-link ${isActive('/') ? 'mobile-link-active' : ''}`} onClick={() => setIsOpen(false)}>Inicio</Link>
              <Link href="/pc-builder" className={`mobile-link ${isActive('/pc-builder') ? 'mobile-link-active' : ''}`} onClick={() => setIsOpen(false)}>Configurador PC</Link>
              <Link href="/builds" className={`mobile-link ${isActive('/builds') ? 'mobile-link-active' : ''}`} onClick={() => setIsOpen(false)}>Mis Configuraciones</Link>
              <Link href="/about" className={`mobile-link ${isActive('/about') ? 'mobile-link-active' : ''}`} onClick={() => setIsOpen(false)}>Acerca de</Link>

              <div className="mobile-auth">
                {!user ? (
                  <>
                    <Link href="/login" className="mobile-auth-login" onClick={() => setIsOpen(false)}>Iniciar Sesión</Link>
                    <Link href="/register" className="mobile-auth-register" onClick={() => setIsOpen(false)}>Registrarse</Link>
                  </>
                ) : (
                  <>
                    <div className="mobile-user-info">
                      <span className="mobile-user-greeting">
                        {isLoggingOut ? 'Cerrando sesión...' : `Hola ${user.username || user.email}`}
                      </span>
                    </div>
                    {!isLoggingOut && (
                      <>
                        <Link href="/profile" className="mobile-user-link" onClick={() => setIsOpen(false)}>
                          <User className="mobile-user-icon" />
                          Mi Perfil
                        </Link>
                        <Link href="/my-builds" className="mobile-user-link" onClick={() => setIsOpen(false)}>
                          <Settings className="mobile-user-icon" />
                          Mis Armados
                        </Link>
                        <button onClick={() => { handleLogout(); setIsOpen(false); }} className="mobile-user-link mobile-logout" disabled={isLoggingOut}>
                          <LogOut className="mobile-user-icon" />
                          Cerrar Sesión
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;