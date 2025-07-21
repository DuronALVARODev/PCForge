"use client";

import '../components/layout/layout.css';
import Navbar from '../components/navbar/navbar';
import Footer from '../components/footer/footer';
import './globals.css';
import { AuthProvider, useAuth } from '../app/context/AuthContext';

const LayoutWithNavbar = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuth();
  if (loading) return null;
  return (
    <>
      <Navbar />
      <main className="main-content">{children}</main>
      <Footer />
    </>
  );
};

const RootLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <html lang="es">
      <body className="app-container">
        <AuthProvider>
          <LayoutWithNavbar>{children}</LayoutWithNavbar>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
