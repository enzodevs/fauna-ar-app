const CACHE_DATE_KEY = 'animal_dia_date';
const CACHE_DATA_KEY = 'animal_dia_data';

// Cache desabilitado - sempre retorna null para forçar nova busca
export const getCachedAnimalData = (today: string): string | null => {
  return null; // Cache desabilitado
  
  // Código original do cache (desabilitado):
  // const savedDate = localStorage.getItem(CACHE_DATE_KEY);
  // const savedData = localStorage.getItem(CACHE_DATA_KEY);
  // return savedDate === today && savedData ? savedData : null;
};

export const setCachedAnimalData = (today: string, data: string): void => {
  // Cache desabilitado - não salva nada
  return;
  
  // Código original do cache (desabilitado):
  // localStorage.setItem(CACHE_DATE_KEY, today);
  // localStorage.setItem(CACHE_DATA_KEY, data);
};

export const getTodayString = (): string => {
  return new Date().toLocaleDateString('pt-BR');
};
