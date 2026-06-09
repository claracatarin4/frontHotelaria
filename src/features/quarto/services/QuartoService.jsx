import { quartoApi } from '../../../services/api';

// ─── QUARTOS ─────────────────────────────────────────────────────
export const listarQuartos = async () => {
  const { data } = await quartoApi.get('/api/quartos');
  return data;
};

export const buscarQuarto = async (id) => {
  const { data } = await quartoApi.get(`/api/quartos/${id}`);
  return data;
};

export const buscarQuartosPorPreco = async (minPreco, maxPreco) => {
  const { data } = await quartoApi.get('/api/quartos/preco', {
    params: { minPreco, maxPreco },
  });
  return data;
};

export const criarQuarto = async (payload) => {
  const { data } = await quartoApi.post('/api/quartos', payload);
  return data;
};

export const atualizarQuarto = async (id, payload) => {
  const { data } = await quartoApi.put(`/api/quartos/${id}`, payload);
  return data;
};

export const patchQuarto = async (id, payload) => {
  const { data } = await quartoApi.patch(`/api/quartos/${id}`, payload);
  return data;
};

export const excluirQuarto = async (id) => {
  const { data } = await quartoApi.delete(`/api/quartos/${id}`);
  return data;
};

// ─── TIPOS DE QUARTO ─────────────────────────────────────────────
export const listarTipos = async () => {
  const { data } = await quartoApi.get('/api/tipos-quarto');
  return data;
};

export const criarTipo = async (payload) => {
  const { data } = await quartoApi.post('/api/tipos-quarto', payload);
  return data;
};

export const atualizarTipo = async (id, payload) => {
  const { data } = await quartoApi.put(`/api/tipos-quarto/${id}`, payload);
  return data;
};

export const excluirTipo = async (id) => {
  const { data } = await quartoApi.delete(`/api/tipos-quarto/${id}`);
  return data;
};

// ─── FOTOS ───────────────────────────────────────────────────────
export const listarFotos = async (quartoId) => {
  const { data } = await quartoApi.get(`/api/quartos/${quartoId}/fotos`);
  return data;
};

export const criarFoto = async (quartoId, payload) => {
  const { data } = await quartoApi.post(`/api/quartos/${quartoId}/fotos`, payload);
  return data;
};

export const excluirFoto = async (fotoId) => {
  const { data } = await quartoApi.delete(`/api/fotos/${fotoId}`);
  return data;
};

// ─── HELPERS ─────────────────────────────────────────────────────
export const STATUS_QUARTO = {
  1: { label: 'Disponível', color: '#00c864', bg: 'rgba(0,200,100,0.12)', border: 'rgba(0,200,100,0.3)' },
  2: { label: 'Ocupado',    color: '#ff6b6b', bg: 'rgba(255,80,80,0.12)',  border: 'rgba(255,80,80,0.3)'  },
  3: { label: 'Manutenção', color: '#f0a500', bg: 'rgba(240,165,0,0.12)',  border: 'rgba(240,165,0,0.3)'  },
};

const UNSPLASH = [
  '1631049307264-da0ec9d70304',
  '1618773928121-c32242e63f39',
  '1582719478250-c89cae4dc85b',
  '1544161515-4ab6ce6db874',
  '1560185893-a55b6c5e2d2f',
  '1566073771259-470a8cd9f5e1',
];

export const fotoPlaceholder = (id, size = 800) => {
  const idx = (id || 0) % UNSPLASH.length;
  return `https://images.unsplash.com/photo-${UNSPLASH[idx]}?w=${size}&q=80`;
};

export const galeriPlaceholders = (quartoId, count = 5) =>
  Array.from({ length: count }, (_, i) => fotoPlaceholder((quartoId || 0) + i + 1, 600));
