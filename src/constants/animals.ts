import { Animal } from '../types';

export const ANIMALS_DATA: Animal[] = [
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

export const ANIMAL_EMOJIS: Record<string, string> = {
  jaguar: '🐆',
  parrot: '🦜',
  aligator: '🐊',
  bear: '🐻'
};

export const ANIMAL_TRANSLATIONS: Record<string, string> = {
  cheetah: 'Guepardo',
  lion: 'Leão',
  elephant: 'Elefante',
  giraffe: 'Girafa',
  tiger: 'Tigre',
  panda: 'Panda',
  leopard: 'Leopardo',
  gorilla: 'Gorila',
};

export const FEATURED_ANIMALS_POOL = [
  'cheetah',
  'lion',
  'elephant',
  'giraffe',
  'tiger',
  'panda',
  'leopard',
  'gorilla'
];
