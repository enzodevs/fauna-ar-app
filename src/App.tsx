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
    id: 'toucan',
    name: 'Tucano-toco',
    scientificName: 'Ramphastos toco',
    description: 'Ave símbolo do Brasil, conhecido pelo seu bico colorido.',
    habitat: 'Florestas tropicais e cerrado',
    conservationStatus: 'Pouco preocupante',
    modelPath: '/models/toucan.glb',
    isAvailable: false
  },
  {
    id: 'sloth',
    name: 'Preguiça-de-três-dedos',
    scientificName: 'Bradypus variegatus',
    description: 'Mamífero arborícola conhecido por seus movimentos lentos.',
    habitat: 'Florestas tropicais',
    conservationStatus: 'Pouco preocupante',
    modelPath: '/models/sloth.glb',
    isAvailable: false
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