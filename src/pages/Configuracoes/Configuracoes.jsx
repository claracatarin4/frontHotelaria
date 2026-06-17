import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Configuracoes.module.css';

const TABS = [
  { id: 'perfil', label: 'Perfil' },
  { id: 'conta', label: 'Conta' },
  { id: 'preferencias', label: 'Preferências' },
];

export default function Configuracoes() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('perfil');

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className={styles.wrapper}>
      <div className={styles.orb} />
      <nav className={styles.nav}>
        <div className={styles.logo} onClick={() => navigate('/home')}>
          <span className={styles.logoIcon}>◆</span>
          <span className={styles.logoText}>HOTEL LUXE</span>
        </div>
        <div className={styles.navRight}>
          <button className={styles.navLink} onClick={() => navigate('/home')}>Quartos</button>
          <button className={styles.logoutBtn} onClick={handleLogout}>Sair</button>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Sua conta</p>
          <h1 className={styles.title}>Configurações</h1>
        </div>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.profileMini}>
              <div className={styles.avatar}>{user?.login?.[0]?.toUpperCase() || 'U'}</div>
              <div>
                <p className={styles.profileName}>{user?.login || 'Usuário'}</p>
                <span className={styles.roleBadge}>{user?.role || 'Cliente'}</span>
              </div>
            </div>
            <nav className={styles.tabs}>
              {TABS.map((t) => (
                <button
                  key={t.id}
                  className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </nav>
          </aside>

          <section className={styles.panel}>
            {tab === 'perfil' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Informações do perfil</h2>
                <p className={styles.sectionSub}>Dados visíveis na sua conta.</p>
                <div className={styles.field}>
                  <label className={styles.label}>Login</label>
                  <input className={styles.input} value={user?.login || ''} readOnly />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Tipo de conta</label>
                  <input className={styles.input} value={user?.role || 'Cliente'} readOnly />
                </div>
                <p className={styles.hint}>
                  Para alterar dados de perfil, em breve será possível editar diretamente por aqui.
                </p>
              </div>
            )}

            {tab === 'conta' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Segurança da conta</h2>
                <p className={styles.sectionSub}>Gerencie acesso e sessão.</p>
                <div className={styles.field}>
                  <label className={styles.label}>Senha</label>
                  <input className={styles.input} type="password" value="••••••••" readOnly />
                </div>
                <button className={styles.btnGhost} disabled>Alterar senha (em breve)</button>
                <div className={styles.divider} />
                <button className={styles.btnDanger} onClick={handleLogout}>
                  Encerrar sessão
                </button>
              </div>
            )}

            {tab === 'preferencias' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Preferências</h2>
                <p className={styles.sectionSub}>Personalize sua experiência.</p>
                <label className={styles.toggleRow}>
                  <span>Receber novidades por e-mail</span>
                  <input type="checkbox" className={styles.toggle} defaultChecked />
                </label>
                <label className={styles.toggleRow}>
                  <span>Alertas de promoções de quartos</span>
                  <input type="checkbox" className={styles.toggle} />
                </label>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
