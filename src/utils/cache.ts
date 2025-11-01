const CACHE_DATE_KEY = 'animal_dia_date';
const CACHE_DATA_KEY = 'animal_dia_data';
const CACHE_IMAGE_KEY = 'animal_dia_image';

export const getCachedAnimalData = (today: string): string | null => {
  const savedDate = localStorage.getItem(CACHE_DATE_KEY);
  const savedData = localStorage.getItem(CACHE_DATA_KEY);
  
  return savedDate === today && savedData ? savedData : null;
};

export const setCachedAnimalData = (today: string, data: string): void => {
  localStorage.setItem(CACHE_DATE_KEY, today);
  localStorage.setItem(CACHE_DATA_KEY, data);
};

export const getCachedAnimalImage = (today: string): string | null => {
  const savedDate = localStorage.getItem(CACHE_DATE_KEY);
  const savedImage = localStorage.getItem(CACHE_IMAGE_KEY);
  
  return savedDate === today && savedImage ? savedImage : null;
};

export const setCachedAnimalImage = (today: string, imageUrl: string): void => {
  localStorage.setItem(CACHE_IMAGE_KEY, imageUrl);
};

export const getTodayString = (): string => {
  return new Date().toLocaleDateString('pt-BR');
};
