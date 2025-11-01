import { useState } from 'react';
import LandingPage from './components/LandingPage';
import ARScene from './components/ARScene';
import Natureza from './components/Natureza';
import Article from './components/Article';
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

export type NewsArticle = {
  title: string;
  link: string;
  pubDate: string;
  thumbnail: string;
  description: string;
  author: string;
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
    name: 'Arara Comum',
    scientificName: 'Ara macao',
    description: 'Colorida arara com plumagem vermelha, amarela e azul, conhecida por sua beleza e inteligência.',
    habitat: 'Florestas tropicais e cerrado',
    conservationStatus: 'Pouco preocupante',
    modelPath: '/models/parrot.glb',
    isAvailable: true
  },
  {
    id: 'aligator',
    name: 'Jacaré',
    scientificName: 'Caiman yacare',
    description: 'Réptil semi-aquático predador, importante para o ecossistema das águas brasileiras.',
    habitat: 'Rios, lagos e pântanos',
    conservationStatus: 'Pouco preocupante',
    modelPath: '/models/aligator.glb',
    isAvailable: true
  },
  {
    id: 'bear',
    name: 'Urso',
    scientificName: 'Tremarctos ornatus',
    description: 'Único urso da América do Sul, identificável pelas marcas brancas em volta dos olhos.',
    habitat: 'Florestas montanhosas e neblinas dos Andes',
    conservationStatus: 'Vulnerável',
    modelPath: '/models/bear.glb',
    isAvailable: true
  }
];

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'ar' | 'news' | 'article'>('landing');
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const handleAnimalSelect = (animal: Animal) => {
    if (animal.isAvailable) {
      setSelectedAnimal(animal);
      setCurrentView('ar');
    }
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setSelectedAnimal(null);
    setSelectedArticle(null);
  };

  const handleNewsClick = () => {
    setCurrentView('news');
  };

  const handleArticleClick = (article: NewsArticle) => {
    setSelectedArticle(article);
    setCurrentView('article');
  };

  const handleBackToNews = () => {
    setCurrentView('news');
    setSelectedArticle(null);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-jungle-900 to-jungle-800">
      {currentView === 'landing' ? (
        <LandingPage 
          animals={animals} 
          onAnimalSelect={handleAnimalSelect}
          onNewsClick={handleNewsClick}
        />
      ) : currentView === 'news' ? (
        <Natureza 
          onBack={handleBackToLanding}
          onArticleClick={handleArticleClick}
        />
      ) : currentView === 'article' && selectedArticle ? (
        <Article 
          title={selectedArticle.title}
          thumbnail={selectedArticle.thumbnail}
          description={selectedArticle.description}
          pubDate={selectedArticle.pubDate}
          author={selectedArticle.author}
          link={selectedArticle.link}
          onBack={handleBackToNews}
        />
      ) : (
        <ARScene animal={selectedAnimal!} onBack={handleBackToLanding} />
      )}
    </div>
  );
}

export default App;