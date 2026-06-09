import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';
import Toast from '../../../components/Toast/Toast';
import { buscarQuarto, STATUS_QUARTO, fotoPlaceholder, galeriPlaceholders } from '../services/QuartoService';
import { formatCurrencyShort } from '../../../utils/formatCurrency';
import styles from './ViewQuarto.module.css';

export default function ViewQuarto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quarto,   setQuarto]   = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [mainFoto, setMainFoto] = useState(0);
  const [isAdmin,  setIsAdmin]  = useState(false);
  const [toast,    setToast]    = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await buscarQuarto(id);
        setQuarto(data);
      } catch {
        setError('Quarto não encontrado.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return (
    <div className={styles.page}>
      <Navbar isAdmin={isAdmin} onAdminToggle={() => setIsAdmin(v=>!v)}/>
      <div className={styles.loadWrap}>
        <div className={styles.spinner}/>
        <p>Carregando quarto...</p>
      </div>
    </div>
  );

  if (error || !quarto) return (
    <div className={styles.page}>
      <Navbar isAdmin={isAdmin} onAdminToggle={() => setIsAdmin(v=>!v)}/>
      <div className={styles.errWrap}>
        <span>⚠</span>
        <p>{error || 'Quarto não encontrado.'}</p>
        <button onClick={() => navigate('/home')}>Voltar para quartos</button>
      </div>
    </div>
  );

  const st     = STATUS_QUARTO[quarto.status] || STATUS_QUARTO[1];
  const fotos  = galeriPlaceholders(quarto.id, 5);
  const taxas  = quarto.preco * 0.25;
  const total  = quarto.preco * 2 + taxas;

  return (
    <div className={styles.page}>
      <Navbar isAdmin={isAdmin} onAdminToggle={() => setIsAdmin(v=>!v)}/>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)}/>}

      {/* Back */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate('/home')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Voltar
        </button>
        {isAdmin && (
          <button className={styles.editBtn} onClick={() => navigate(`/quartos/${id}/editar`)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Editar Quarto
          </button>
        )}
      </div>

      <div className={styles.layout}>
        {/* Coluna esquerda — galeria + info */}
        <div className={styles.left}>
          {/* Galeria */}
          <div className={styles.gallery}>
            <div className={styles.mainImg}>
              <img src={fotos[mainFoto]} alt="Quarto principal"/>
            </div>
            <div className={styles.thumbRow}>
              {fotos.map((f, i) => (
                <div
                  key={i}
                  className={`${styles.thumb} ${mainFoto===i?styles.thumbActive:''}`}
                  onClick={() => setMainFoto(i)}
                >
                  <img src={f} alt={`foto ${i+1}`}/>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className={styles.info}>
            <div className={styles.infoHeader}>
              <div>
                <h2 className={styles.tipoNome}>{quarto.tipoQuarto?.descricao || 'Quarto'}</h2>
                <span className={styles.statusBadge} style={{color:st.color,background:st.bg,borderColor:st.border}}>
                  ✓ {st.label}
                </span>
              </div>
              <p className={styles.numQuarto}>Quarto {quarto.numero || quarto.id}</p>
            </div>

            <div className={styles.descBlock}>
              <p className={styles.descLabel}>Descrição</p>
              <p className={styles.descText}>
                Suite {quarto.tipoQuarto?.descricao} com decoração contemporânea, cama king size,
                vista privilegiada, banheiro de mármore, ar-condicionado e Wi-Fi de alta velocidade.
                Café da manhã incluso.
              </p>
            </div>

            <div className={styles.amenities}>
              {[
                {icon:'🛏','label':'Cama King Size'},
                {icon:'📶','label':'Wi-Fi incluso'},
                {icon:'🍳','label':'Café da manhã'},
                {icon:'❄️','label':'Ar condicionado'},
                {icon:'🚿','label':'Banheiro mármore'},
                {icon:'📺','label':'TV 4K 65"'},
              ].map(({icon,label})=>(
                <div key={label} className={styles.amenityItem}>
                  <span className={styles.amenityIcon}>{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna direita — resumo */}
        <div className={styles.right}>
          <div className={styles.resumoCard}>
            <p className={styles.resumoTitle}>Resumo</p>
            <h3 className={styles.resumoQuarto}>Quarto {quarto.numero || quarto.id}</h3>

            <div className={styles.resumoBox}>
              <p className={styles.resumoBoxLabel}>Hóspedes e Quartos</p>
              <p className={styles.resumoBoxVal}>2 hóspedes, 1 quarto</p>
              <div className={styles.resumoDates}>
                <div>
                  <p className={styles.dateLabel}>Check-in</p>
                  <p className={styles.dateVal}>08/04/2026</p>
                </div>
                <div>
                  <p className={styles.dateLabel}>Check-out</p>
                  <p className={styles.dateVal}>10/04/2026</p>
                </div>
              </div>
            </div>

            <div className={styles.compraBlock}>
              <p className={styles.compraTitle}>Sua compra</p>
              <div className={styles.compraRow}>
                <span>1 quarto × 2 diárias</span>
                <span>{formatCurrencyShort(quarto.preco * 2)}</span>
              </div>
              <div className={styles.compraRow}>
                <span>Taxas e impostos</span>
                <span>{formatCurrencyShort(taxas)}</span>
              </div>
              <div className={`${styles.compraRow} ${styles.compraTotal}`}>
                <span>Total</span>
                <span>{formatCurrencyShort(total)}</span>
              </div>
            </div>

            <button
              className={styles.btnReservar}
              disabled={quarto.status !== 1}
              title={quarto.status !== 1 ? 'Quarto indisponível' : 'Reservar'}
            >
              {quarto.status === 1 ? 'Reservar' : 'Indisponível'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
