import { usuarioApi } from './api';

// MS Cliente expõe os clientes na raiz do gateway (/cliente -> GET /)
export const listarClientes = async () => {
  const { data } = await usuarioApi.get('/');
  return Array.isArray(data) ? data : [];
};

export const buscarCliente = async (id) => {
  const { data } = await usuarioApi.get(`/${id}`);
  return data;
};
