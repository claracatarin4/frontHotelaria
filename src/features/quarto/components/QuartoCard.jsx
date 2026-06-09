import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STATUS_QUARTO, fotoPlaceholder } from '../services/QuartoService';
import { formatCurrencyShort } from '../../../utils/formatCurrency';
import styles from './QuartoCard.module.css';

export default function QuartoCard({ quarto, isAdmin, onDelete }) {
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const [deleting,   setDeleting]   = useState(false);

  const st = STATUS_QUARTO[quarto.status] || STATUS_QUARTO[1];
  const foto = fotoPlaceholder(quarto.id);

  const handleDelete = async (e) => {
    e.stopPropagation();
    setDeleting(true);
    try {
      await onDelete(quarto.id);
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <div className={styles.card}>
      {/* Imagem */}
      <div className={styles.imgWrap} onClick={() => navigate(`/quartos/${quarto.id}`)}>
        <img src={foto} alt={quarto.tipoQuarto?.descricao} loading="lazy" className={styles.img} />
        <div className={styles.overlay}/>
        <span className={styles.badge} style={{ color:st.color, background:st.bg, borderColor:st.border }}>
          {st.label}
        </span>
        {quarto.numero && <span className={styles.num}>Nº {quarto.numero}</span>}
      </div>

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.row}>
          <div>
            <p className={styles.tipo}>{quarto.tipoQuarto?.descricao || 'Quarto'}</p>
            <p className={styles.sub}>{quarto.fotos?.length || 0} foto(s)</p>
          </div>
          <div className={styles.priceBlock}>
            <span className={styles.priceLabel}>por noite</span>
            <span className={styles.price}>{formatCurrencyShort(quarto.preco)}</span>
          </div>
        </div>

        {/* Ações */}
        <div className={styles.actions}>
          <button className={styles.btnView} onClick={() => navigate(`/quartos/${quarto.id}`)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Ver detalhes
          </button>

          {isAdmin && (
            <>
              <button className={styles.btnEdit} onClick={() => navigate(`/quartos/${quarto.id}/editar`)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Editar
              </button>

              {!confirming ? (
                <button className={styles.btnDel} onClick={(e) => { e.stopPropagation(); setConfirming(true); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                </button>
              ) : (
                <div className={styles.confirmRow} onClick={(e) => e.stopPropagation()}>
                  <span className={styles.confirmTxt}>Excluir?</span>
                  <button className={styles.btnYes} onClick={handleDelete} disabled={deleting}>
                    {deleting ? '...' : 'Sim'}
                  </button>
                  <button className={styles.btnNo} onClick={() => setConfirming(false)}>Não</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
