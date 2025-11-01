import { AnimalData, PixabayResponse, WikipediaResponse } from '../types';

const API_NINJAS_KEY = import.meta.env.VITE_API_NINJAS_KEY;
const PIXABAY_KEY = import.meta.env.VITE_PIXABAY_API_KEY;

export const fetchAnimalData = async (animalName: string): Promise<AnimalData | null> => {
  if (!API_NINJAS_KEY || API_NINJAS_KEY === 'SUA_API_KEY_AQUI') {
    console.warn('API Key não configurada');
    return null;
  }

  try {
    const response = await fetch(
      `https://api.api-ninjas.com/v1/animals?name=${animalName}`,
      { headers: { 'X-Api-Key': API_NINJAS_KEY } }
    );
    const data = await response.json();
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Erro ao buscar animal:', error);
    return null;
  }
};

export const fetchPixabayImage = async (query: string): Promise<string | null> => {
  if (!PIXABAY_KEY) return null;

  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(query)}&image_type=photo&category=animals&safesearch=true&per_page=3`
    );
    
    if (response.ok) {
      const data: PixabayResponse = await response.json();
      if (data.hits && data.hits.length > 0) {
        const randomHit = data.hits[Math.floor(Math.random() * data.hits.length)];
        return randomHit.webformatURL;
      }
    }
  } catch (error) {
    console.warn('Pixabay failed:', error);
  }
  
  return null;
};

export const fetchApiNinjasImage = async (): Promise<string | null> => {
  if (!API_NINJAS_KEY) return null;

  try {
    const response = await fetch(
      'https://api.api-ninjas.com/v1/randomimage?category=wildlife',
      { headers: { 'X-Api-Key': API_NINJAS_KEY } }
    );
    
    if (response.ok) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
  } catch (error) {
    console.warn('API Ninjas image failed:', error);
  }
  
  return null;
};

export const fetchWikipediaImage = async (animalName: string): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(animalName)}`
    );
    const data: WikipediaResponse = await response.json();
    return data.thumbnail?.source || null;
  } catch (error) {
    console.error('Erro ao buscar imagem da Wikipedia:', error);
    return null;
  }
};

export const fetchAnimalImage = async (animalName: string): Promise<string> => {
  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&h=600&fit=crop&q=80';
  
  // Estratégia de fallback em cadeia
  const pixabayImage = await fetchPixabayImage(animalName);
  if (pixabayImage) return pixabayImage;
  
  const apiNinjasImage = await fetchApiNinjasImage();
  if (apiNinjasImage) return apiNinjasImage;
  
  const wikipediaImage = await fetchWikipediaImage(animalName);
  if (wikipediaImage) return wikipediaImage;
  
  return FALLBACK_IMAGE;
};
