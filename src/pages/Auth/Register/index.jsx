import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import './style.css';

export function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState(''); // Nuevo estado para errores del servidor

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es obligatorio';
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es obligatorio';
    
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) { // Ajustado a 6 según tu backend
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  // --- LÓGICA REAL DE REGISTRO ---
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setServerError('');

    try {
      // 1. Petición al Backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        })
      });

      // 2. Manejo de errores (ej: Email ya existe)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Si el backend envía un mensaje, úsalo, si no, pon uno genérico
        throw new Error(errorData.message || 'Error al registrar el usuario');
      }

      // 3. Éxito
      setLoading(false);
      setSuccess(true);
      
      // Opcional: Podrías hacer login automático aquí porque el backend devuelve el token
      // Pero para mantenerlo simple, redirigimos al login
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error("Error registro:", error);
      setLoading(false);
      setServerError(error.message); // Muestra el mensaje real del backend
    }
  };

  return (
    <div className="auth-page">
      <button className="auth-back-btn" onClick={() => navigate('/')}>
        <ArrowLeft size={20} />
        Volver al inicio
      </button>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon-wrapper">
              <User size={32} />
            </div>
            <h2 className="auth-title">Crear cuenta</h2>
            <p className="auth-subtitle">Únete a WaveHeaven y comienza tu aventura</p>
          </div>

          {/* Mensaje de Éxito */}
          {success && (
            <div className="auth-alert auth-alert-success">
              <CheckCircle size={20} />
              <div>
                <p className="auth-alert-title">¡Cuenta creada exitosamente!</p>
                <p className="auth-alert-message">Redirigiendo al inicio de sesión...</p>
              </div>
            </div>
          )}

          {/* Mensaje de Error del Servidor */}
          {serverError && (
            <div className="auth-alert auth-alert-error" style={{marginBottom: '1rem', color: '#ef4444', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '6px', display: 'flex', gap: '10px'}}>
              <AlertCircle size={20} />
              <p>{serverError}</p>
            </div>
          )}

          <div className="auth-form">
            <div className="auth-form-group">
              <label className="auth-label">Nombre *</label>
              <div className="auth-input-wrapper">
                <User size={20} className="auth-input-icon" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`auth-input ${errors.firstName ? 'auth-input-error' : ''}`}
                  placeholder="Tu nombre"
                />
              </div>
              {errors.firstName && <p className="auth-error-message">{errors.firstName}</p>}
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Apellido *</label>
              <div className="auth-input-wrapper">
                <User size={20} className="auth-input-icon" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`auth-input ${errors.lastName ? 'auth-input-error' : ''}`}
                  placeholder="Tu apellido"
                />
              </div>
              {errors.lastName && <p className="auth-error-message">{errors.lastName}</p>}
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Correo electrónico *</label>
              <div className="auth-input-wrapper">
                <Mail size={20} className="auth-input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
                  placeholder="tu@email.com"
                />
              </div>
              {errors.email && <p className="auth-error-message">{errors.email}</p>}
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Contraseña *</label>
              <div className="auth-input-wrapper">
                <Lock size={20} className="auth-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`auth-input ${errors.password ? 'auth-input-error' : ''}`}
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  className="auth-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="auth-error-message">{errors.password}</p>}
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Confirmar contraseña *</label>
              <div className="auth-input-wrapper">
                <Lock size={20} className="auth-input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`auth-input ${errors.confirmPassword ? 'auth-input-error' : ''}`}
                  placeholder="Repite tu contraseña"
                />
                <button
                  type="button"
                  className="auth-toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="auth-error-message">{errors.confirmPassword}</p>}
            </div>

            <button
              type="button"
              className="auth-submit-btn"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  <span className="auth-spinner"></span>
                  Creando cuenta...
                </>
              ) : (
                'Crear cuenta'
              )}
            </button>

            <p className="auth-switch-text">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                className="auth-switch-link"
                onClick={() => navigate('/login')}
              >
                Inicia sesión
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}