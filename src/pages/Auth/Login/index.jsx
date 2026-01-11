import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import './style.css';

export function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar errores al escribir
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setLoginError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'El correo electrónico es obligatorio';
    if (!formData.password) newErrors.password = 'La contraseña es obligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- LÓGICA REAL DE LOGIN ---
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setLoginError('');

    try {
      // 1. Petición al Backend (Render)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      // 2. Verificar si hubo error (ej: contraseña mal)
      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      // 3. Obtener datos reales
      const data = await response.json();

      // 4. Guardar en localStorage para que el Header lo vea
      // Guardamos el token
      localStorage.setItem('jwt_token', data.token);
      
      // Guardamos el usuario con el formato que espera tu Header
      const userToSave = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        // Si el backend no devuelve iniciales, las creamos aquí
        initials: data.initials || (data.firstName[0] + data.lastName[0]).toUpperCase(),
        role: data.role
      };
      
      localStorage.setItem('user', JSON.stringify(userToSave));

      // 5. Redirigir
      setLoading(false);
      navigate('/');
      window.location.reload(); // Recargar para actualizar el Header

    } catch (error) {
      console.error("Error login:", error);
      setLoading(false);
      setLoginError('Correo electrónico o contraseña incorrectos.');
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
              <Lock size={32} />
            </div>
            <h2 className="auth-title">Iniciar sesión</h2>
            <p className="auth-subtitle">Bienvenido de vuelta a WaveHeaven</p>
          </div>

          {loginError && (
            <div className="auth-alert auth-alert-error" style={{display: 'flex', gap: '10px', color: '#ef4444', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '6px', marginBottom: '1rem'}}>
              <AlertCircle size={20} />
              <p>{loginError}</p>
            </div>
          )}

          <div className="auth-form">
            <div className="auth-form-group">
              <label className="auth-label">Correo electrónico</label>
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
              <label className="auth-label">Contraseña</label>
              <div className="auth-input-wrapper">
                <Lock size={20} className="auth-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`auth-input ${errors.password ? 'auth-input-error' : ''}`}
                  placeholder="Tu contraseña"
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

            <button
              type="button"
              className="auth-submit-btn"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>

            <p className="auth-switch-text">
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                className="auth-switch-link"
                onClick={() => navigate('/register')}
              >
                Crear cuenta
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}