import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Menu.module.css';

export default function Menu() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className={styles.wrapper}>
      {/* Ambient background */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <nav className={styles.nav}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>◆</span>
          <span className={styles.logoText}>HOTEL LUXE</span>
        </div>
        <div className={styles.navLinks}>
          {isAuthenticated ? (
            <button className={styles.btnPrimary} onClick={() => navigate('/home')}>
              Ver Quartos
            </button>
          ) : (
            <>
              <button className={styles.btnGhost} onClick={() => navigate('/login')}>
                Entrar
              </button>
              <button className={styles.btnPrimary} onClick={() => navigate('/cadastro')}>
                Cadastrar
              </button>
            </>
          )}
        </div>
      </nav>

      <main className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Experiência de Luxo</p>
          <h1 className={styles.title}>
            Onde cada estadia<br />
            <em>torna-se memória</em>
          </h1>
          <p className={styles.subtitle}>
            Quartos exclusivos, serviço impecável e conforto além do esperado.
            Reserve agora e viva o extraordinário.
          </p>
          <div className={styles.cta}>
            <button
              className={styles.btnHero}
              onClick={() => navigate(isAuthenticated ? '/home' : '/cadastro')}
            >
              {isAuthenticated ? 'Ver Disponibilidade' : 'Fazer Reserva'}
            </button>
            {!isAuthenticated && (
              <button className={styles.btnHeroGhost} onClick={() => navigate('/login')}>
                Já tenho conta
              </button>
            )}
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.roomCard}>
            <div className={styles.roomImg}>
              <div className={styles.roomImgOverlay} />
              <img
                src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80"
                alt="Suite de Luxo"
                className={styles.roomPhoto}
              />
            </div>
            <div className={styles.roomInfo}>
              <div>
                <p className={styles.roomType}>Suite Executive</p>
                <p className={styles.roomDesc}>Vista panorâmica • King Size • 68m²</p>
              </div>
              <div className={styles.roomPrice}>
                <span className={styles.priceLabel}>A partir de</span>
                <span className={styles.priceValue}>R$ 1.600</span>
                <span className={styles.priceUnit}>/noite</span>
              </div>
            </div>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statNum}>48</span>
              <span className={styles.statLabel}>Quartos</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>4.9★</span>
              <span className={styles.statLabel}>Avaliação</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>12</span>
              <span className={styles.statLabel}>Anos</span>
            </div>
          </div>
        </div>
      </main>

      <section className={styles.features}>
        {[
          { icon: '🛎', title: 'Check-in 24h', desc: 'Recepção disponível a qualquer hora' },
          { icon: '🍳', title: 'Café incluso', desc: 'Café da manhã premium para todos os hóspedes' },
          { icon: '💳', title: 'Parcelamento', desc: 'Parcele em até 12x sem juros' },
          { icon: '🔒', title: 'Segurança total', desc: 'Câmeras e acesso controlado 24h' },
        ].map((f, i) => (
          <div className={styles.featureCard} key={i} style={{ animationDelay: `${i * 0.1}s` }}>
            <span className={styles.featureIcon}>{f.icon}</span>
            <h3 className={styles.featureTitle}>{f.title}</h3>
            <p className={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
