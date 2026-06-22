export interface Curation {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  recipeIds: string[];
  icon: string;
}

export const curations: Curation[] = [
  {
    id: 'classic-serve',
    title: 'Классика Негрони',
    titleEn: 'Classic Negroni',
    description: 'Каноническая формула 1:1:1: джин, Кампари и сладкий красный вермут.',
    descriptionEn: 'The canonical 1:1:1 formula: gin, Campari and sweet red vermouth.',
    recipeIds: ['classic'],
    icon: '',
  },
  {
    id: 'signature-serve',
    title: 'Авторская подача',
    titleEn: 'Signature Serve',
    description: 'Ярославский Негрони от Александры Таран: локальный джин, сливянка, ромашковый кордиал и биттер.',
    descriptionEn: 'Yaroslavl Negroni by Alexandra Taran: local gin, prune liqueur, chamomile cordial and bitter.',
    recipeIds: ['yaroslavl'],
    icon: '',
  },
];

export function getCurationById(id: string): Curation | undefined {
  return curations.find((c) => c.id === id);
}
