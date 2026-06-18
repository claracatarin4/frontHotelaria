import { pagamentoApi } from './api';

// Gera JWT HS256 no browser via Web Crypto API (sem pacote externo)
const signJWT = async (payload, secret) => {
  const enc = new TextEncoder();
  const b64url = (buf) =>
    btoa(String.fromCharCode(...new Uint8Array(buf)))
      .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const header = b64url(enc.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const body   = b64url(enc.encode(JSON.stringify(payload)));
  const signing = `${header}.${body}`;

  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(signing));
  return `${signing}.${b64url(sig)}`;
};

const getPaymentToken = async () => {
  const secret = import.meta.env.VITE_PAGAMENTO_JWT_SECRET || 'hotel_pagamento_secret';
  const exp = Math.floor(Date.now() / 1000) + 8 * 3600;
  return signJWT({ usuario: 'hotel_front', exp }, secret);
};

const authHeader = async () => {
  const token = await getPaymentToken();
  return { Authorization: `Bearer ${token}` };
};

export const criarPagamento = async (payload) => {
  const { data } = await pagamentoApi.post('/pagamentos', payload, {
    headers: await authHeader(),
  });
  return data;
};

export const criarCartao = async (payload) => {
  const { data } = await pagamentoApi.post('/cartoes', payload, {
    headers: await authHeader(),
  });
  return data;
};

export const criarBoleto = async (payload) => {
  const { data } = await pagamentoApi.post('/boletos', payload, {
    headers: await authHeader(),
  });
  return data;
};

export const criarDeposito = async (payload) => {
  const { data } = await pagamentoApi.post('/depositos', payload, {
    headers: await authHeader(),
  });
  return data;
};

export const criarTipoPagamento = async (payload) => {
  const { data } = await pagamentoApi.post('/tipo-pagamento', payload, {
    headers: await authHeader(),
  });
  return data;
};
