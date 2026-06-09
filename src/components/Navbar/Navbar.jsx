import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar({ isAdmin, onAdminToggle }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const active = (path) => location.pathname === path;

  return (
    <nav className={styles.nav}>
      <div className={styles.logo} onClick={() => navigate('/home')}>
        <span className={styles.gem}>◆</span>
        <span className={styles.name}>HOTEL LUXE</span>
      </div>

      <div className={styles.links}>
        <button className={`${styles.link} ${active('/home') ? styles.linkActive : ''}`} onClick={() => navigate('/home')}>Quartos</button>
        <button className={styles.link}>Reservas</button>
        <button className={styles.link}>Serviços</button>
      </div>

      <div className={styles.right}>
        {onAdminToggle && (
          <button
            className={`${styles.adminBtn} ${isAdmin ? styles.adminOn : ''}`}
            onClick={onAdminToggle}
            title={isAdmin ? 'Sair do modo Admin' : 'Entrar no modo Admin'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Admin
          </button>
        )}

        <div className={styles.userWrap}>
          <button className={styles.userBtn} onClick={() => setOpen((v) => !v)}>
            <div className={styles.avatar}>{user?.login?.[0]?.toUpperCase() || 'U'}</div>
            <span className={styles.uname}>{user?.login || 'Usuário'}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>

          {open && (
            <div className={styles.drop}>
              <div className={styles.dropHead}>
                <p className={styles.dropName}>{user?.login}</p>
                <p className={styles.dropRole}>{isAdmin ? 'Administrador' : 'Cliente'}</p>
              </div>
              <div className={styles.divider}/>
              <button className={styles.dropItem}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Meu perfil
              </button>
              <button className={styles.dropItem}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Minhas reservas
              </button>
              <div className={styles.divider}/>
              <button className={styles.dropItem} style={{color:'#ff6b6b'}} onClick={() => { logout(); navigate('/'); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
