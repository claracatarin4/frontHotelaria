import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usuarioApi } from '../../services/api';
import styles from './Login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ usuario_login: '', usuario_senha: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.usuario_login || !form.usuario_senha) {
      setError('Preencha todos os campos.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await usuarioApi.post('/usuario/login', form);
      login(data.token, { id: data.usuario_id, login: form.usuario_login });
      navigate('/home');
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao realizar login.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.orb} />

      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>◆</span>
          <span className={styles.logoText}>HOTEL LUXE</span>
        </Link>
      </nav>

      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <p className={styles.eyebrow}>Bem-vindo de volta</p>
            <h1 className={styles.title}>Entrar</h1>
            <p className={styles.subtitle}>Acesse sua conta para gerenciar reservas</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>
                Email / Login <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="usuario_login"
                value={form.usuario_login}
                onChange={handleChange}
                placeholder="seu@email.com"
                className={styles.input}
                autoComplete="username"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Senha <span className={styles.required}>*</span>
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPass ? 'text' : 'password'}
                  name="usuario_senha"
                  value={form.usuario_senha}
                  onChange={handleChange}
                  placeholder="••••••••••"
                  className={styles.input}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className={styles.error}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <button type="submit" className={styles.btnSubmit} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : 'Entrar'}
            </button>
          </form>

          <p className={styles.footer}>
            Não tem conta?{' '}
            <Link to="/cadastro" className={styles.link}>
              Cadastre-se grátis
            </Link>
          </p>
        </div>

        <div className={styles.aside}>
          <img
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80"
            alt="Hotel"
            className={styles.asideImg}
          />
          <div className={styles.asideOverlay}>
            <blockquote className={styles.quote}>
              "Uma experiência que transcende o simples ato de se hospedar."
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}
