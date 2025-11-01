import { useEffect, useState } from 'react';

interface AnimalData {
  name: string;
  taxonomy: {
    scientific_name: string;
  };
  characteristics: {
    slogan: string;
    habitat: string;
    biggest_threat: string;
    estimated_population_size: string;
    diet: string;
  };
}

const DestaqueDoDia = () => {
  const [animal, setAnimal] = useState<AnimalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [animalImage, setAnimalImage] = useState<string>('');

  useEffect(() => {
    const today = new Date().toLocaleDateString('pt-BR');
    const savedDate = localStorage.getItem('animal_dia_date');
    const savedData = localStorage.getItem('animal_dia_data');

    // Se já tem dados salvos de hoje, usar do cache
    if (savedDate === today && savedData) {
      setAnimal(JSON.parse(savedData));
      setLoading(false);
      return;
    }

    // Lista de animais interessantes para alternar
    const animals = ['cheetah', 'lion', 'elephant', 'giraffe', 'tiger', 'panda', 'leopard', 'gorilla'];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];

    const apiKey = import.meta.env.VITE_API_NINJAS_KEY;

    if (!apiKey || apiKey === 'SUA_API_KEY_AQUI') {
      console.warn('API Key não configurada');
      setLoading(false);
      return;
    }

    fetch(`https://api.api-ninjas.com/v1/animals?name=${randomAnimal}`, {
      headers: { 'X-Api-Key': apiKey },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          const picked = data[0];
          setAnimal(picked);
          localStorage.setItem('animal_dia_date', today);
          localStorage.setItem('animal_dia_data', JSON.stringify(picked));
          
          // Buscar imagem da Wikipedia
          fetchWikipediaImage(picked.name);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar animal:', err);
        setLoading(false);
      });
  }, []);

  // Função para buscar imagem da Wikipedia
  const fetchWikipediaImage = async (animalName: string) => {
    const pixabayKey = import.meta.env.VITE_PIXABAY_API_KEY;
    const apiNinjasKey = import.meta.env.VITE_API_NINJAS_KEY;
    
    // 1ª tentativa: Pixabay - busca específica pelo nome do animal
    try {
      const searchQuery = encodeURIComponent(animalName);
      const pixabayResponse = await fetch(
        `https://pixabay.com/api/?key=${pixabayKey}&q=${searchQuery}&image_type=photo&category=animals&safesearch=true&per_page=3`
      );
      
      if (pixabayResponse.ok) {
        const data = await pixabayResponse.json();
        if (data.hits && data.hits.length > 0) {
          // Pega uma imagem aleatória dos resultados
          const randomHit = data.hits[Math.floor(Math.random() * data.hits.length)];
          setAnimalImage(randomHit.webformatURL);
          return;
        }
      }
    } catch (err) {
      console.warn('Pixabay failed, trying API Ninjas:', err);
    }

    // 2ª tentativa: API Ninjas random wildlife image
    try {
      const randomImageResponse = await fetch(
        'https://api.api-ninjas.com/v1/randomimage?category=wildlife',
        { 
          headers: { 'X-Api-Key': apiNinjasKey },
        }
      );
      
      if (randomImageResponse.ok) {
        const blob = await randomImageResponse.blob();
        const imageUrl = URL.createObjectURL(blob);
        setAnimalImage(imageUrl);
        return;
      }
    } catch (err) {
      console.warn('API Ninjas image failed, trying Wikipedia:', err);
    }

    // 3ª tentativa: Wikipedia fallback
    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(animalName)}`
      );
      const data = await response.json();
      
      if (data.thumbnail?.source) {
        setAnimalImage(data.thumbnail.source);
      } else {
        // Fallback final: imagem genérica
        setAnimalImage('https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&h=600&fit=crop&q=80');
      }
    } catch (err) {
      console.error('Erro ao buscar imagem:', err);
      setAnimalImage('https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&h=600&fit=crop&q=80');
    }
  };

  if (loading) {
    return (
      <section className="px-6 py-16 bg-gradient-to-b from-transparent to-jungle-900/30">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-jungle-500 border-t-transparent mx-auto"></div>
        </div>
      </section>
    );
  }

  if (!animal) return null;

  // Traduzir o nome do animal (básico)
  const animalNames: Record<string, string> = {
    cheetah: 'Guepardo',
    lion: 'Leão',
    elephant: 'Elefante',
    giraffe: 'Girafa',
    tiger: 'Tigre',
    panda: 'Panda',
    leopard: 'Leopardo',
    gorilla: 'Gorila',
  };

  const displayName = animalNames[animal.name.toLowerCase()] || animal.name;

  return (
    <section className="px-6 py-16 bg-gradient-to-b from-transparent to-jungle-900/30">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center animate-fade-in">
          🐾 Espécie em Destaque do Dia
        </h2>
        <p className="text-jungle-300 text-center mb-8">
          Conheça mais sobre a vida selvagem ao redor do mundo
        </p>

        <div className="bg-gradient-to-br from-jungle-800/40 to-jungle-900/40 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-2xl border border-jungle-700/50 animate-slide-up">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Imagem */}
            <div className="order-1">
              <img
                src={animalImage || 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&h=600&fit=crop&q=80'}
                alt={displayName}
                className="rounded-xl w-full h-64 md:h-full object-cover shadow-lg"
              />
            </div>

            {/* Informações */}
            <div className="order-2 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {displayName}
              </h3>
              <p className="italic text-jungle-300 text-sm md:text-base mb-6">
                {animal.taxonomy.scientific_name}
              </p>

              <div className="space-y-3 text-sm md:text-base">
                <div className="flex items-start gap-3">
                  <span className="text-jungle-400 text-xl">🏞️</span>
                  <div>
                    <strong className="text-jungle-200">Habitat:</strong>
                    <p className="text-gray-300">{animal.characteristics.habitat}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-jungle-400 text-xl">⚠️</span>
                  <div>
                    <strong className="text-jungle-200">Principal ameaça:</strong>
                    <p className="text-gray-300">{animal.characteristics.biggest_threat}</p>
                  </div>
                </div>

                {animal.characteristics.estimated_population_size && (
                  <div className="flex items-start gap-3">
                    <span className="text-jungle-400 text-xl">📊</span>
                    <div>
                      <strong className="text-jungle-200">População estimada:</strong>
                      <p className="text-gray-300">{animal.characteristics.estimated_population_size}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <span className="text-jungle-400 text-xl">🍽️</span>
                  <div>
                    <strong className="text-jungle-200">Dieta:</strong>
                    <p className="text-gray-300">{animal.characteristics.diet}</p>
                  </div>
                </div>
              </div>

              {animal.characteristics.slogan && (
                <div className="mt-6 pt-6 border-t border-jungle-700">
                  <p className="text-jungle-300 italic text-base md:text-lg">
                    💬 "{animal.characteristics.slogan}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DestaqueDoDia;
