// Domain Types
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

export type AnimalData = {
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
};

// API Response Types
export type PixabayResponse = {
  hits: Array<{
    webformatURL: string;
    largeImageURL: string;
  }>;
};

export type WikipediaResponse = {
  thumbnail?: {
    source: string;
  };
};
