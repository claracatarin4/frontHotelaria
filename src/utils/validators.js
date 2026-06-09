export const isRequired = (val) => val !== null && val !== undefined && String(val).trim() !== '';

export const isPositiveNumber = (val) => !isNaN(val) && Number(val) > 0;

export const validateQuartoForm = ({ preco, numero, status, tipoQuartoId }) => {
  const errors = {};
  if (!isRequired(numero)) errors.numero = 'Número do quarto é obrigatório.';
  if (!isPositiveNumber(preco)) errors.preco = 'Preço deve ser um valor positivo.';
  if (!isRequired(status)) errors.status = 'Status é obrigatório.';
  if (!isRequired(tipoQuartoId)) errors.tipoQuartoId = 'Tipo de quarto é obrigatório.';
  return errors;
};
