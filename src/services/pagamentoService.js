import { pagamentoApi } from './api';

// O token do usuário logado é injetado automaticamente pelo interceptor do api.js.
// (Antes havia um token fixo; com o JWT_SECRET unificado, usamos o token do login.)

export const criarPagamento = async (payload) => {
  const { data } = await pagamentoApi.post('/pagamentos', payload);
  return data;
};

export const criarCartao = async (payload) => {
  const { data } = await pagamentoApi.post('/cartoes', payload);
  return data;
};

export const criarBoleto = async (payload) => {
  const { data } = await pagamentoApi.post('/boletos', payload);
  return data;
};

export const criarDeposito = async (payload) => {
  const { data } = await pagamentoApi.post('/depositos', payload);
  return data;
};

export const criarTipoPagamento = async (payload) => {
  const { data } = await pagamentoApi.post('/tipo-pagamento', payload);
  return data;
};

// Dispara o processamento assíncrono (gateway simulado). Responde com { aprovado, motivo, estimativa_ms }.
export const processarPagamento = async (payload) => {
  const { data } = await pagamentoApi.post('/pagamentos/processar', payload);
  return data;
};
