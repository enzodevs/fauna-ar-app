import { useEffect, useState } from 'react';
import { NewsArticle } from '../types';

interface NaturezaProps {
  onBack: () => void;
  onArticleClick: (article: NewsArticle) => void;
}

const Natureza: React.FC<NaturezaProps> = ({ onBack, onArticleClick }) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://api.rss2json.com/v1/api.json?rss_url=https://g1.globo.com/rss/g1/natureza/')
      .then(res => res.json())
      .then(data => {
        setNews(data.items || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao carregar notícias:', err);
        setError('Não foi possível carregar as notícias.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-jungle-900 via-jungle-800 to-black text-white">
      {/* Header */}
      <header className="pt-8 pb-4 px-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className="mb-6 bg-jungle-600/90 hover:bg-jungle-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center animate-fade-in">
            🌿 Notícias da Natureza
          </h1>
          <p className="text-xl text-jungle-200 text-center animate-slide-up">
            Fique por dentro do que está acontecendo no mundo da vida selvagem
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-jungle-500 border-t-transparent"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-white p-6 rounded-lg text-center">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item, index) => (
                <div
                  key={item.link}
                  onClick={() => onArticleClick(item)}
                  className="cursor-pointer bg-jungle-700/30 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item.thumbnail && (
                    <img 
                      src={item.thumbnail} 
                      alt={item.title} 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/logo.webp';
                      }}
                    />
                  )}
                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-2 line-clamp-2">{item.title}</h2>
                    <p className="text-gray-300 text-sm line-clamp-3 mb-3">
                      {item.description?.replace(/<[^>]*>/g, '')}
                    </p>
                    <div className="flex items-center justify-between text-xs text-jungle-300">
                      <span>{new Date(item.pubDate).toLocaleDateString('pt-BR')}</span>
                      <span className="flex items-center gap-1">
                        Ler mais
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Natureza;
