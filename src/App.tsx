import { useState } from 'react';
import LandingPage from './components/LandingPage';
import ARScene from './components/ARScene';
import './index.css';

export type Animal = {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  habitat: string;
  conservationStatus: string;
  modelPath: string;
  isAvailable: boolean;
};


const animals: Animal[] = [
  {
    id: 'jaguar',
    name: 'Onça-pintada',
    scientificName: 'Panthera onca',
    description: 'O maior felino das Américas, símbolo da fauna brasileira.',
    habitat: 'Florestas tropicais, cerrado e pantanal',
    conservationStatus: 'Quase ameaçada',
    modelPath: '/models/jaguar.glb',
    isAvailable: true
  },
  {
    id: 'parrot',
    name: 'Arara-azul',
    scientificName: 'Anodorhynchus hyacinthinus',
    description: 'A maior arara do mundo, símbolo da fauna brasileira.',
    habitat: 'Pantanal, cerrado e florestas',
    conservationStatus: 'Vulnerável',
    modelPath: '/models/parrot.glb',
    isAvailable: true
  },
  {
    id: 'capivara',
    name: 'Capivara',
    scientificName: 'Hydrochoerus hydrochaeris',
    description: 'O maior roedor do mundo, muito sociável e semi-aquático.',
    habitat: 'Margens de rios e lagos',
    conservationStatus: 'Pouco preocupante',
    modelPath: '/models/capivara.glb',
    isAvailable: true
  }
];

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'ar'>('landing');
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);

  const handleAnimalSelect = (animal: Animal) => {
    if (animal.isAvailable) {
      setSelectedAnimal(animal);
      setCurrentView('ar');
    }
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setSelectedAnimal(null);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-jungle-900 to-jungle-800">
      {currentView === 'landing' ? (
        <LandingPage animals={animals} onAnimalSelect={handleAnimalSelect} />
      ) : (
        <ARScene animal={selectedAnimal!} onBack={handleBackToLanding} />
      )}
    </div>
  );
}

export default App;