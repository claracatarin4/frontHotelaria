import axios from 'axios';

export const usuarioApi = axios.create({
  baseURL: import.meta.env.VITE_USUARIO_API || 'http://academico3.rj.senac.br/20261prj5/hotel/cliente',
});

export const quartoApi = axios.create({
  baseURL: import.meta.env.VITE_QUARTO_API || 'http://academico3.rj.senac.br/20261prj5/hotel/quarto',
});

export const reservaApi = axios.create({
  baseURL: import.meta.env.VITE_RESERVA_API || 'http://academico3.rj.senac.br/20261prj5/hotel/reserva',
});

export const pagamentoApi = axios.create({
  baseURL: import.meta.env.VITE_PAGAMENTO_API || 'http://academico3.rj.senac.br/20261prj5/hotel/pagamento',
});

// Inject JWT token into all requests
const addAuthInterceptor = (instance) => {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};

[usuarioApi, quartoApi, reservaApi, pagamentoApi].forEach(addAuthInterceptor);
