import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';
import Toast from '../../../components/Toast/Toast';
import QuartoCard from '../components/QuartoCard';
import { useQuartos } from '../hooks/useQuartos';
import { STATUS_QUARTO } from '../services/QuartoService';
import styles from './Quartos.module.css';

export default function Quartos() {
  const navigate = useNavigate();
  const { quartos, loading, error, refetch, remover } = useQuartos();
  const [isAdmin,      setIsAdmin]      = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroTipo,   setFiltroTipo]   = useState('');
  const [toast,        setToast]        = useState(null);

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  const handleDelete = async (id) => {
    try {
      await remover(id);
      showToast('Quarto excluído com sucesso.');
    } catch {
      showToast('Erro ao excluir quarto.', 'error');
    }
  };

  const tiposUnicos = [...new Set(quartos.map((q) => q.tipoQuarto?.descricao).filter(Boolean))];

  const filtrados = quartos.filter((q) => {
    const okS = filtroStatus === '' || String(q.status) === filtroStatus;
    const okT = filtroTipo   === '' || q.tipoQuarto?.descricao === filtroTipo;
    return okS && okT;
  });

  const disponiveis = quartos.filter((q) => q.status === 1).length;

  return (
    <div className={styles.page}>
      <Navbar isAdmin={isAdmin} onAdminToggle={() => setIsAdmin((v) => !v)} />

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Hero */}
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Disponibilidade em tempo real</p>
          <h1 className={styles.heroTitle}>Nossos <em>Quartos</em></h1>
          <p className={styles.heroSub}>
            {loading ? 'Carregando...' : `${disponiveis} de ${quartos.length} disponíveis`}
          </p>
        </div>
        {isAdmin && (
          <button className={styles.btnNovo} onClick={() => navigate('/quartos/novo')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Novo Quarto
          </button>
        )}
        <div className={styles.orb}/>
      </header>

      {/* Filtros */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Status</span>
          <div className={styles.chips}>
            {[{v:'',l:'Todos'}, ...Object.entries(STATUS_QUARTO).map(([v,s]) => ({v,l:s.label}))].map(({v,l}) => (
              <button key={v} className={`${styles.chip} ${filtroStatus===v?styles.chipOn:''}`} onClick={() => setFiltroStatus(v)}>{l}</button>
            ))}
          </div>
        </div>
        {tiposUnicos.length > 0 && (
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Tipo</span>
            <div className={styles.chips}>
              <button className={`${styles.chip} ${filtroTipo===''?styles.chipOn:''}`} onClick={() => setFiltroTipo('')}>Todos</button>
              {tiposUnicos.map((t) => (
                <button key={t} className={`${styles.chip} ${filtroTipo===t?styles.chipOn:''}`} onClick={() => setFiltroTipo(t)}>{t}</button>
              ))}
            </div>
          </div>
        )}
        <button className={styles.refreshBtn} onClick={refetch} title="Atualizar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
            <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
          </svg>
        </button>
      </div>

      {/* Conteúdo */}
      <main className={styles.main}>
        {loading && (
          <div className={styles.skeletons}>
            {[...Array(6)].map((_,i) => <div key={i} className={styles.skeleton}/>)}
          </div>
        )}

        {!loading && error && (
          <div className={styles.state}>
            <span className={styles.stateIcon}>⚠</span>
            <h3 className={styles.stateTitle}>Erro de conexão</h3>
            <p className={styles.stateMsg}>{error}</p>
            <button className={styles.btnRetry} onClick={refetch}>Tentar novamente</button>
          </div>
        )}

        {!loading && !error && filtrados.length === 0 && (
          <div className={styles.state}>
            <span className={styles.stateIcon}>◈</span>
            <h3 className={styles.stateTitle}>Nenhum quarto encontrado</h3>
            <p className={styles.stateMsg}>Ajuste os filtros ou adicione um novo quarto.</p>
          </div>
        )}

        {!loading && !error && filtrados.length > 0 && (
          <div className={styles.grid}>
            {filtrados.map((q) => (
              <QuartoCard key={q.id} quarto={q} isAdmin={isAdmin} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>© 2026 Hotel Luxe — Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
