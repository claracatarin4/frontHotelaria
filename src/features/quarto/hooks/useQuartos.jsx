import { useState, useEffect, useCallback } from 'react';
import { listarQuartos, excluirQuarto } from '../services/QuartoService';

export function useQuartos() {
  const [quartos, setQuartos]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listarQuartos();
      setQuartos(data);
    } catch (e) {
      setError(e?.response?.data?.error || 'Erro ao carregar quartos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const remover = async (id) => {
    await excluirQuarto(id);
    setQuartos((prev) => prev.filter((q) => q.id !== id));
  };

  return { quartos, loading, error, refetch: fetch, remover, setQuartos };
}
