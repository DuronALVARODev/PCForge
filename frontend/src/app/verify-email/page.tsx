'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import './verify-email.css';

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Token no proporcionado.');
      return;
    }

    const verify = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await axios.get(`${apiUrl}/api/auth/verify-email?token=${token}`);
        setStatus('success');
        setMessage(res.data.message || 'Verificación exitosa.');
      } catch (err) {
        setStatus('error');
        // Use a more specific type for error handling
        if (typeof err === 'object' && err !== null && 'response' in err) {
          const errorObj = err as { response?: { data?: { message?: string } } };
          setMessage(errorObj.response?.data?.message || 'Error al verificar el correo.');
        } else {
          setMessage('Error al verificar el correo.');
        }
      }
    };

    verify();
  }, [searchParams]);

  const getStatusTitle = () => {
    switch (status) {
      case 'verifying':
        return 'Verificando Email';
      case 'success':
        return 'Email Verificado';
      case 'error':
        return 'Error de Verificación';
      default:
        return 'Verificación de Email';
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'verifying':
        return 'Verificando correo electrónico';
      case 'success':
      case 'error':
        return message;
      default:
        return '';
    }
  };

  return (
    <div className="verify-email-container">
      <div className="verification-card">
        <h1>{getStatusTitle()}</h1>
        
        <div className={`status-icon ${status}`}></div>
        
        <div className={`status-message ${status}`}>
          {getStatusMessage()}
          {status === 'verifying' && <span className="loading-dots"></span>}
        </div>

        {status === 'success' && (
          <Link href="/login" className="action-button">
            Ir al Login
          </Link>
        )}

        {status === 'error' && (
          <div style={{ marginTop: '1rem' }}>
            <Link href="/register" className="action-button" style={{ marginRight: '1rem' }}>
              Volver a Registrarse
            </Link>
            <Link href="/login" className="action-button">
              Ir al Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;