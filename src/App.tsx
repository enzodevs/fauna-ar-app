import { useState } from 'react';
import LandingPage from './components/LandingPage';
import ARScene from './components/ARScene';
import Natureza from './components/Natureza';
import Article from './components/Article';
import { Animal, NewsArticle } from './types';
import { ANIMALS_DATA } from './constants/animals';
import './index.css';

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
          animals={ANIMALS_DATA} 
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