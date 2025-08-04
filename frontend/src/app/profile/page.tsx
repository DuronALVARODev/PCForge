'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Key, MapPin, Trash2, LogOut, Save, Edit3, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import './profile.css';

// Esquemas de validación
const shippingSchema = z.object({
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  phone: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
  street: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  colony: z.string().min(2, 'La colonia es requerida'),
  city: z.string().min(2, 'La ciudad es requerida'),
  state: z.string().min(2, 'El estado es requerido'),
  postalCode: z.string().min(5, 'El código postal debe tener al menos 5 dígitos'),
  country: z.string().min(2, 'El país es requerido'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: z.string()
    .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial'),
  confirmPassword: z.string().min(1, 'Confirma la nueva contraseña'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

const deleteAccountSchema = z.object({
  password: z.string().min(1, 'La contraseña es requerida para eliminar la cuenta'),
});

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Formulario de información de envío
  const shippingForm = useForm({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      street: '',
      colony: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'México'
    }
  });

  // Formulario de cambio de contraseña
  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  // Formulario de eliminación de cuenta
  const deleteForm = useForm({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      password: ''
    }
  });

  type ChangePasswordData = z.infer<typeof passwordSchema>;
  const handleChangePassword = async (data: ChangePasswordData) => {
    try {
      setSuccess('');
      setError('');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.post(
        `${apiUrl}/api/auth/change-password`,
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        },
        { withCredentials: true }
      );
      setSuccess(response.data.message || 'Contraseña cambiada exitosamente');
      setShowChangePasswordModal(false);
      passwordForm.reset();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Error al cambiar la contraseña');
      } else {
        setError('Error al cambiar la contraseña');
      }
      setSuccess('');
    }
  };

  type DeleteAccountData = z.infer<typeof deleteAccountSchema>;
  const handleDeleteAccount = async (data: DeleteAccountData) => {
    try {
      setSuccess('');
      setError('');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.post(
        `${apiUrl}/api/auth/delete-account`,
        { password: data.password },
        { withCredentials: true }
      );
      setSuccess(response.data.message || 'Cuenta eliminada exitosamente');
      setShowDeleteModal(false);
      deleteForm.reset();
      // Cerrar sesión y limpiar usuario
      logout();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Error al eliminar la cuenta');
      } else {
        setError('Error al eliminar la cuenta');
      }
      setSuccess('');
    }
  };

  type ShippingData = z.infer<typeof shippingSchema>;
  const handleSaveShippingInfo = async (data: ShippingData) => {
    try {
      // Aquí iría la lógica para guardar la información de envío
      console.log('Guardar información de envío:', data);
      setSuccess('Información de envío guardada exitosamente');
      setError('');
      setIsEditing(false);
    } catch (err) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const errorObj = err as { response?: { data?: { message?: string } } };
        setError(errorObj.response?.data?.message || 'Error al guardar la información');
      } else {
        setError('Error al guardar la información');
      }
      setSuccess('');
    }
  };

  const handleLogout = () => {
    logout();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUserCreatedDate = () => {
    if (!user || typeof user.createdAt !== 'string') return 'Fecha no disponible';
    return formatDate(user.createdAt);
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-user-info">
            <div className="profile-avatar">
              <User size={48} />
            </div>
            <h3>{user.username}</h3>
            <p>{user.email}</p>
          </div>

          <nav className="profile-nav">
            <button 
              className={`profile-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={20} />
              Mi Perfil
            </button>
            {/* Botón de Información de Envío eliminado */}
            <button 
              className={`profile-nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <Key size={20} />
              Seguridad
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {/* Mensajes de éxito y error */}
          {success && <div className="profile-success-message">{success}</div>}
          {error && <div className="profile-error-message">{error}</div>}

          {activeTab === 'profile' && (
            <div className="profile-section">
              <div className="profile-header">
                <h2>Información del Perfil</h2>
              </div>

              <div className="profile-card">
                <div className="profile-field">
                  <Mail className="profile-field-icon" size={20} />
                  <div className="profile-field-content">
                    <label>Correo Electrónico</label>
                    <p>{user.email}</p>
                  </div>
                </div>

                <div className="profile-field">
                  <User className="profile-field-icon" size={20} />
                  <div className="profile-field-content">
                    <label>Nombre de Usuario</label>
                    <p>{user.username}</p>
                  </div>
                </div>

                <div className="profile-field">
                  <Calendar className="profile-field-icon" size={20} />
                  <div className="profile-field-content">
                    <label>Fecha de Registro</label>
                    <p>{getUserCreatedDate()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Apartado de Información de Envío eliminado */}

          {activeTab === 'security' && (
            <div className="profile-section">
              <div className="profile-header">
                <h2>Seguridad</h2>
              </div>

              <div className="profile-card">
                <div className="profile-security-actions">
                  <Button 
                    variant="outline"
                    onClick={() => setShowChangePasswordModal(true)}
                  >
                    <Key size={20} />
                    Cambiar Contraseña
                  </Button>

                  <Button 
                    variant="secondary"
                    onClick={handleLogout}
                  >
                    <LogOut size={20} />
                    Cerrar Sesión
                  </Button>

                  <Button 
                    variant="destructive"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <Trash2 size={20} />
                    Eliminar Cuenta
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal para cambiar contraseña */}
      {showChangePasswordModal && (
        <div className="profile-modal-overlay">
          <div className="profile-modal">
            <div className="profile-modal-header">
              <h3>Cambiar Contraseña</h3>
              <button 
                className="profile-modal-close"
                onClick={() => setShowChangePasswordModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={passwordForm.handleSubmit(handleChangePassword)}>
              <div className="profile-modal-body">
                <div className="profile-form-group">
                  <label>Contraseña Actual</label>
                  <Input
                    type="password"
                    {...passwordForm.register('currentPassword')}
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="profile-error">{passwordForm.formState.errors.currentPassword.message}</p>
                  )}
                </div>
                <div className="profile-form-group">
                  <label>Nueva Contraseña</label>
                  <Input
                    type="password"
                    {...passwordForm.register('newPassword')}
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="profile-error">{passwordForm.formState.errors.newPassword.message}</p>
                  )}
                </div>
                <div className="profile-form-group">
                  <label>Confirmar Nueva Contraseña</label>
                  <Input
                    type="password"
                    {...passwordForm.register('confirmPassword')}
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="profile-error">{passwordForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
              <div className="profile-modal-footer">
                <Button type="button" variant="secondary" onClick={() => setShowChangePasswordModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                  {passwordForm.formState.isSubmitting ? 'Cambiando...' : 'Cambiar Contraseña'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para eliminar cuenta */}
      {showDeleteModal && (
        <div className="profile-modal-overlay">
          <div className="profile-modal">
            <div className="profile-modal-header">
              <h3>Eliminar Cuenta</h3>
              <button 
                className="profile-modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={deleteForm.handleSubmit(handleDeleteAccount)}>
              <div className="profile-modal-body">
                <div className="profile-warning">
                  <p><strong>¡Atención!</strong> Esta acción eliminará permanentemente tu cuenta y todos los datos asociados.</p>
                </div>
                <div className="profile-form-group">
                  <label>Confirma tu contraseña para continuar</label>
                  <Input
                    type="password"
                    {...deleteForm.register('password')}
                    placeholder="Ingresa tu contraseña"
                  />
                  {deleteForm.formState.errors.password && (
                    <p className="profile-error">{deleteForm.formState.errors.password.message}</p>
                  )}
                </div>
              </div>
              <div className="profile-modal-footer">
                <Button type="button" variant="secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="destructive" disabled={deleteForm.formState.isSubmitting}>
                  {deleteForm.formState.isSubmitting ? 'Eliminando...' : 'Eliminar Cuenta'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;