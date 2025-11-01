import { useEffect, useState } from 'react';
import { AnimalData } from '../types';
import { ANIMAL_TRANSLATIONS, FEATURED_ANIMALS_POOL } from '../constants/animals';
import { fetchAnimalData, fetchAnimalImage } from '../services/animalService';
import { getCachedAnimalData, setCachedAnimalData, getTodayString } from '../utils/cache';

const DestaqueDoDia = () => {
  const [animal, setAnimal] = useState<AnimalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [animalImage, setAnimalImage] = useState<string>('');

  useEffect(() => {
    const today = getTodayString();
    const cachedData = getCachedAnimalData(today);

    // Se já tem dados salvos de hoje, usar do cache
    if (cachedData) {
      setAnimal(JSON.parse(cachedData));
      setLoading(false);
      return;
    }

    // Seleciona animal aleatório
    const randomAnimal = FEATURED_ANIMALS_POOL[
      Math.floor(Math.random() * FEATURED_ANIMALS_POOL.length)
    ];

    fetchAnimalData(randomAnimal)
      .then((data) => {
        if (data) {
          setAnimal(data);
          setCachedAnimalData(today, JSON.stringify(data));
          fetchAnimalImage(data.name).then(setAnimalImage);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar animal:', err);
        setLoading(false);
      });
  }, []);

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

  const displayName = ANIMAL_TRANSLATIONS[animal.name.toLowerCase()] || animal.name;

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
