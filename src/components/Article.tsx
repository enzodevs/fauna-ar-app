interface ArticleProps {
  title: string;
  thumbnail: string;
  description: string;
  pubDate: string;
  author: string;
  link: string;
  onBack: () => void;
}

const Article: React.FC<ArticleProps> = ({ 
  title, 
  thumbnail, 
  description, 
  pubDate, 
  author, 
  link, 
  onBack 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-jungle-900 via-jungle-800 to-black text-white">
      {/* Header com botão voltar */}
      <header className="sticky top-0 z-40 bg-jungle-900/95 backdrop-blur-sm border-b border-jungle-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="bg-jungle-600/90 hover:bg-jungle-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>
        </div>
      </header>

      {/* Conteúdo do artigo */}
      <article className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        {/* Imagem destaque */}
        {thumbnail && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={thumbnail} 
              alt={title} 
              className="w-full h-64 md:h-96 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo.webp';
              }}
            />
          </div>
        )}

        {/* Título */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
          {title}
        </h1>

        {/* Meta informações */}
        <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-jungle-300 mb-8 pb-6 border-b border-jungle-700">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>
              {new Date(pubDate).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <span>{author}</span>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="prose prose-lg prose-invert max-w-none">
          {description?.replace(/<[^>]*>/g, '').split('\n').map((paragraph, i) => (
            paragraph.trim() && (
              <p key={i} className="text-gray-200 text-base md:text-lg leading-relaxed mb-6">
                {paragraph}
              </p>
            )
          ))}
        </div>

        {/* Botão para ver matéria completa */}
        <div className="mt-12 pt-8 border-t border-jungle-700">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-jungle-600 hover:bg-jungle-700 text-white font-bold px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Ler matéria completa no G1
          </a>
        </div>
      </article>

      {/* Espaçamento inferior */}
      <div className="h-16"></div>
    </div>
  );
};

export default Article;
