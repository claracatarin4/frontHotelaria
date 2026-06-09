import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';
import Toast from '../../../components/Toast/Toast';
import {
  criarQuarto, atualizarQuarto, buscarQuarto,
  listarTipos, criarFoto, excluirFoto,
} from '../services/QuartoService';
import { validateQuartoForm } from '../../../utils/validators';
import { formatCurrencyShort } from '../../../utils/formatCurrency';
import styles from './RegisterQuarto.module.css';

// Usado tanto para CRIAR quanto para EDITAR (isEdit=true)
export default function RegisterQuarto({ isEdit = false }) {
  const navigate  = useNavigate();
  const { id }    = useParams();

  const [form, setForm] = useState({ numero:'', preco:'', status:'1', tipoQuartoId:'' });
  const [tipos,   setTipos]   = useState([]);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState(null);
  const [isAdmin] = useState(true); // nessa página já é admin

  // Nova foto (campos)
  const [novaFotoNome, setNovaFotoNome] = useState('');
  const [novaFotoExt,  setNovaFotoExt]  = useState('jpg');
  const [fotos,        setFotos]        = useState([]);

  const showToast = (msg, type='success') => setToast({msg,type});

  // Carregar tipos
  useEffect(() => {
    (async () => {
      try {
        const data = await listarTipos();
        setTipos(data);
      } catch {
        showToast('Erro ao carregar tipos de quarto.','error');
      }
    })();
  }, []);

  // Carregar quarto se editar
  useEffect(() => {
    if (!isEdit || !id) return;
    (async () => {
      setLoading(true);
      try {
        const q = await buscarQuarto(id);
        setForm({
          numero:      q.numero   || '',
          preco:       q.preco    || '',
          status:      String(q.status) || '1',
          tipoQuartoId: String(q.tipoQuartoId) || '',
        });
        setFotos(q.fotos || []);
      } catch {
        showToast('Erro ao carregar quarto.','error');
      } finally {
        setLoading(false);
      }
    })();
  }, [isEdit, id]);

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
    setErrors({...errors, [e.target.name]: ''});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateQuartoForm(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      const payload = {
        numero:       form.numero,
        preco:        parseFloat(form.preco),
        status:       parseInt(form.status),
        tipoQuartoId: parseInt(form.tipoQuartoId),
      };

      if (isEdit) {
        await atualizarQuarto(id, payload);
        showToast('Quarto atualizado com sucesso!');
        setTimeout(() => navigate(`/quartos/${id}`), 1500);
      } else {
        const criado = await criarQuarto(payload);
        showToast('Quarto criado com sucesso!');
        setTimeout(() => navigate(`/quartos/${criado.id}`), 1500);
      }
    } catch (err) {
      const msg = err?.response?.data?.error || 'Erro ao salvar quarto.';
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddFoto = async () => {
    if (!novaFotoNome || !id) return;
    try {
      const foto = await criarFoto(id, {
        foto_nome: novaFotoNome,
        foto_extensao: novaFotoExt,
        foto_status: 1,
      });
      setFotos((prev) => [...prev, foto]);
      setNovaFotoNome('');
      showToast('Foto adicionada.');
    } catch {
      showToast('Erro ao adicionar foto.','error');
    }
  };

  const handleRemoveFoto = async (fotoId) => {
    try {
      await excluirFoto(fotoId);
      setFotos((prev) => prev.filter((f) => f.foto_id !== fotoId));
      showToast('Foto removida.');
    } catch {
      showToast('Erro ao remover foto.','error');
    }
  };

  return (
    <div className={styles.page}>
      <Navbar isAdmin={isAdmin}/>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)}/>}

      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate(isEdit ? `/quartos/${id}` : '/home')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Voltar
        </button>
        <div>
          <p className={styles.topEye}>{isEdit ? 'Editando quarto' : 'Novo quarto'}</p>
          <h1 className={styles.topTitle}>{isEdit ? `Quarto ${form.numero || id}` : 'Cadastrar Quarto'}</h1>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadWrap}><div className={styles.spinner}/><p>Carregando dados...</p></div>
      ) : (
        <div className={styles.layout}>
          <form onSubmit={handleSubmit} className={styles.formCard}>
            <p className={styles.sectionTitle}>Dados do Quarto</p>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Número do Quarto <span className={styles.req}>*</span></label>
                <input className={`${styles.input} ${errors.numero?styles.inputErr:''}`} name="numero" value={form.numero} onChange={handleChange} placeholder="Ex: 101, 544A"/>
                {errors.numero && <p className={styles.errMsg}>{errors.numero}</p>}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Preço por Noite (R$) <span className={styles.req}>*</span></label>
                <input className={`${styles.input} ${errors.preco?styles.inputErr:''}`} name="preco" type="number" min="0" step="0.01" value={form.preco} onChange={handleChange} placeholder="1600.00"/>
                {errors.preco && <p className={styles.errMsg}>{errors.preco}</p>}
                {form.preco > 0 && <p className={styles.precoHint}>{formatCurrencyShort(form.preco)} por noite</p>}
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Tipo de Quarto <span className={styles.req}>*</span></label>
                <select className={`${styles.select} ${errors.tipoQuartoId?styles.inputErr:''}`} name="tipoQuartoId" value={form.tipoQuartoId} onChange={handleChange}>
                  <option value="">Selecionar tipo</option>
                  {tipos.map((t) => (
                    <option key={t.id} value={t.id}>{t.descricao}</option>
                  ))}
                </select>
                {errors.tipoQuartoId && <p className={styles.errMsg}>{errors.tipoQuartoId}</p>}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Status <span className={styles.req}>*</span></label>
                <select className={`${styles.select} ${errors.status?styles.inputErr:''}`} name="status" value={form.status} onChange={handleChange}>
                  <option value="1">Disponível</option>
                  <option value="2">Ocupado</option>
                  <option value="3">Manutenção</option>
                </select>
                {errors.status && <p className={styles.errMsg}>{errors.status}</p>}
              </div>
            </div>

            <div className={styles.formFooter}>
              <button type="button" className={styles.btnCancelar} onClick={() => navigate(isEdit ? `/quartos/${id}` : '/home')}>
                Cancelar
              </button>
              <button type="submit" className={styles.btnSalvar} disabled={saving}>
                {saving ? <span className={styles.spinner}/> : (isEdit ? 'Salvar Alterações' : 'Criar Quarto')}
              </button>
            </div>
          </form>

          {/* Painel de fotos — só em modo editar (quarto já existe) */}
          {isEdit && (
            <div className={styles.fotosCard}>
              <p className={styles.sectionTitle}>Fotos do Quarto</p>

              {fotos.length === 0 ? (
                <p className={styles.semFotos}>Nenhuma foto cadastrada.</p>
              ) : (
                <div className={styles.fotosList}>
                  {fotos.map((f) => (
                    <div key={f.foto_id} className={styles.fotoItem}>
                      <div className={styles.fotoInfo}>
                        <span className={styles.fotoNome}>{f.foto_nome}.{f.foto_extensao}</span>
                        <span className={`${styles.fotoBadge} ${f.foto_status===1?styles.fotoBadgeOn:styles.fotoBadgeOff}`}>
                          {f.foto_status===1?'Ativa':'Inativa'}
                        </span>
                      </div>
                      <button className={styles.fotoRemover} onClick={() => handleRemoveFoto(f.foto_id)} title="Remover foto">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.addFotoRow}>
                <input className={styles.input} placeholder="Nome da foto (sem extensão)" value={novaFotoNome} onChange={(e) => setNovaFotoNome(e.target.value)}/>
                <select className={styles.selectSm} value={novaFotoExt} onChange={(e) => setNovaFotoExt(e.target.value)}>
                  <option value="jpg">JPG</option>
                  <option value="png">PNG</option>
                  <option value="webp">WEBP</option>
                </select>
                <button type="button" className={styles.btnAddFoto} onClick={handleAddFoto} disabled={!novaFotoNome}>
                  + Adicionar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
