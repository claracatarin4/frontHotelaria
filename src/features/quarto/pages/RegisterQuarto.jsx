import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import {
  criarQuarto,
  atualizarQuarto,
  buscarQuarto,
  listarTiposQuarto,
} from '../services/QuartoService';
import styles from './RegisterQuarto.module.css';

const STATUS_OPTIONS = [
  { v: 1, l: 'Disponível' },
  { v: 2, l: 'Ocupado' },
  { v: 3, l: 'Manutenção' },
];

export default function RegisterQuarto() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, logout } = useAuth();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ numero: '', preco: '', status: 1, tipoQuartoId: '' });
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const tiposData = await listarTiposQuarto();
        setTipos(Array.isArray(tiposData) ? tiposData : []);
      } catch { /* tipos opcional */ }
    })();
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      setLoading(true);
      try {
        const q = await buscarQuarto(id);
        setForm({
          numero: q.numero ?? '',
          preco: q.preco ?? '',
          status: q.status ?? 1,
          tipoQuartoId: q.tipoQuartoId ?? q.tipoQuarto?.id ?? '',
        });
      } catch {
        setError('Não foi possível carregar o quarto para edição.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError(''); setSuccess('');
  };

  const validate = () => {
    if (form.preco === '' || Number(form.preco) <= 0) return 'Informe um preço válido.';
    if (!form.tipoQuartoId) return 'Selecione o tipo do quarto.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) { setError(v); return; }
    setSaving(true); setError('');
    const payload = {
      numero: form.numero || null,
      preco: Number(form.preco),
      status: Number(form.status),
      tipoQuartoId: Number(form.tipoQuartoId),
    };
    try {
      if (isEdit) {
        await atualizarQuarto(id, payload);
        setSuccess('Quarto atualizado com sucesso!');
      } else {
        await criarQuarto(payload);
        setSuccess('Quarto criado com sucesso!');
      }
      setTimeout(() => navigate('/admin/quartos'), 700);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.erro || 'Erro ao salvar o quarto.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className={styles.wrapper}>
      <div className={styles.orb} />
      <nav className={styles.nav}>
        <div className={styles.logo} onClick={() => navigate('/admin/quartos')}>
          <span className={styles.logoIcon}>◆</span>
          <span className={styles.logoText}>HOTEL LUXE</span>
          <span className={styles.adminTag}>ADMIN</span>
        </div>
        <div className={styles.navRight}>
          <span className={styles.userName}>{user?.login || 'Admin'}</span>
          <button className={styles.logoutBtn} onClick={handleLogout}>Sair</button>
        </div>
      </nav>

      <main className={styles.main}>
        <button className={styles.back} onClick={() => navigate('/admin/quartos')}>← Voltar</button>
        <div className={styles.header}>
          <p className={styles.eyebrow}>{isEdit ? 'Editar quarto' : 'Novo quarto'}</p>
          <h1 className={styles.title}>{isEdit ? 'Atualizar acomodação' : 'Cadastrar acomodação'}</h1>
        </div>

        {loading ? (
          <div className={styles.loadingCard}>Carregando dados do quarto…</div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.card}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Número do quarto</label>
                <input className={styles.input} name="numero" value={form.numero} onChange={handleChange} placeholder="Ex: 101" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Preço / noite <span className={styles.required}>*</span></label>
                <div className={styles.precoWrap}>
                  <span className={styles.precoPrefix}>R$</span>
                  <input className={styles.input} name="preco" type="number" min="0" step="0.01" value={form.preco} onChange={handleChange} placeholder="0,00" />
                </div>
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Tipo de quarto <span className={styles.required}>*</span></label>
                {tipos.length > 0 ? (
                  <select className={styles.input} name="tipoQuartoId" value={form.tipoQuartoId} onChange={handleChange}>
                    <option value="">Selecione…</option>
                    {tipos.map((t) => (<option key={t.id} value={t.id}>{t.descricao}</option>))}
                  </select>
                ) : (
                  <>
                    <input className={styles.input} name="tipoQuartoId" type="number" value={form.tipoQuartoId} onChange={handleChange} placeholder="ID do tipo de quarto" />
                    <span className={styles.hint}>Nenhum tipo carregado — informe o ID manualmente.</span>
                  </>
                )}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Status</label>
                <div className={styles.statusChips}>
                  {STATUS_OPTIONS.map(({ v, l }) => (
                    <button type="button" key={v} className={`${styles.chip} ${Number(form.status) === v ? styles.chipActive : ''}`} onClick={() => setForm((f) => ({ ...f, status: v }))}>{l}</button>
                  ))}
                </div>
              </div>
            </div>

            {error && <div className={styles.errorMsg}>⚠ {error}</div>}
            {success && <div className={styles.successMsg}>✓ {success}</div>}

            <div className={styles.actions}>
              <button type="button" className={styles.btnGhost} onClick={() => navigate('/admin/quartos')}>Cancelar</button>
              <button type="submit" className={styles.btnPrimary} disabled={saving}>
                {saving ? 'Salvando…' : isEdit ? 'Salvar alterações' : 'Cadastrar quarto'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
