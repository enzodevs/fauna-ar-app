import { Animal } from '../App';

interface LandingPageProps {
  animals: Animal[];
  onAnimalSelect: (animal: Animal) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ animals, onAnimalSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-jungle-900 via-jungle-800 to-black">
      {/* Header */}
      <header className="pt-8 pb-4 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white text-center mb-2 animate-fade-in">
            Fauna AR
          </h1>
          <p className="text-xl md:text-2xl text-jungle-200 text-center animate-slide-up">
            Explore a vida selvagem brasileira em realidade aumentada
          </p>
        </div>
      </header>
      {/* Animal Cards */}
      <main className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {animals.map((animal, index) => (
              <div
                key={animal.id}
                className={`relative group cursor-pointer transform transition-all duration-500 hover:scale-105 animate-slide-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => onAnimalSelect(animal)}
              >
                <div className={`relative bg-gradient-to-br ${
                  animal.isAvailable 
                    ? 'from-jungle-700 to-jungle-900' 
                    : 'from-gray-700 to-gray-900'
                } rounded-2xl overflow-hidden shadow-2xl`}>
                  {/* Card Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Icon Placeholder */}
                  <div className="p-8 pb-4">
                    <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <span className="text-6xl">
                        {animal.id === 'jaguar' ? '🐆' : animal.id === 'toucan' ? '🦜' : '🦥'}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="px-8 pb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {animal.name}
                    </h3>
                    <p className="text-jungle-300 italic mb-3">
                      {animal.scientificName}
                    </p>
                    <p className="text-gray-300 text-sm mb-4">
                      {animal.description}
                    </p>
                    {/* Status Badge */}
                    {animal.isAvailable ? (
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-jungle-500/20 border border-jungle-500">
                        <span className="w-2 h-2 bg-jungle-400 rounded-full mr-2 animate-pulse"></span>
                        <span className="text-jungle-300 text-sm font-medium">Disponível</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-500/20 border border-gray-500">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                        <span className="text-gray-300 text-sm font-medium">Em breve</span>
                      </div>
                    )}
                  </div>

                  {/* Hover Overlay */}
                  {animal.isAvailable && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60">
                      <button className="px-6 py-3 bg-jungle-500 text-white font-bold rounded-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                        Explorar em AR
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 text-center text-gray-400">
        <p>Aponte sua câmera para o marcador Hiro para visualizar os animais</p>
        <p className="mt-2 text-sm">Desenvolvido com React + Three.js + AR.js</p>
      </footer>
    </div>
  );
};

export default LandingPage;