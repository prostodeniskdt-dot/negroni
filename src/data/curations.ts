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
    description: 'Ярославский Негрони и «Парадокс» от Александры Таран: региональная классика и молочно-осветлённый твист на Negroni.',
    descriptionEn: 'Yaroslavl Negroni and Paradox by Alexandra Taran: a regional classic and a milk-clarified Negroni twist.',
    recipeIds: ['yaroslavl', 'paradox'],
    icon: '',
  },
];

export function getCurationById(id: string): Curation | undefined {
  return curations.find((c) => c.id === id);
}
