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
    title: 'Классика и предки',
    titleEn: 'Classics & Precursors',
    description:
      'Milano-Torino, Americano и классический Негрони — итальянская линия, из которой вырос современный эталон.',
    descriptionEn:
      'Milano-Torino, Americano and the classic Negroni — the Italian lineage behind the modern benchmark.',
    recipeIds: ['milano-torino', 'americano', 'classic', 'tasty-negroni'],
    icon: '',
  },
  {
    id: 'signature-serve',
    title: 'Авторские подачи России',
    titleEn: 'Signature Serves from Russia',
    description:
      'Региональные и барные твисты: от Ярославля и Перми до Москвы, Владивостока, Воронежа и Набережных Челнов.',
    descriptionEn:
      'Regional and bar twists from Yaroslavl and Perm to Moscow, Vladivostok, Voronezh and Naberezhnye Chelny.',
    recipeIds: [
      'yaroslavl',
      'paradox',
      'opponent',
      'santi-negroni',
      'athletes',
      'rat-pack-negroni',
      'infinity',
      'bacio-russo',
      'lao',
      'coco-negroni',
      'o-kuninushi',
      'onyx',
      'count-p-kobyakov',
      'pistachio-negroni',
      'bloodberry-negroni',
      'general',
      'spirit-of-ecstasy',
    ],
    icon: '',
  },
];

export function getCurationById(id: string): Curation | undefined {
  return curations.find((c) => c.id === id);
}
