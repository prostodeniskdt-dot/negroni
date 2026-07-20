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
      'Региональные и барные твисты: от Ярославля и Перми до Москвы, Санкт-Петербурга, Владивостока, Воронежа, Казани, Краснодара, Красноярска, Ижевска, Новороссийска, Тюмени, Сочи и Набережных Челнов.',
    descriptionEn:
      'Regional and bar twists from Yaroslavl and Perm to Moscow, St. Petersburg, Vladivostok, Voronezh, Kazan, Krasnodar, Krasnoyarsk, Izhevsk, Novorossiysk, Tyumen, Sochi and Naberezhnye Chelny.',
    recipeIds: [
      'yaroslavl',
      'paradox',
      'manryu',
      'dorian-gray',
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
      'agony-charm',
      'seng',
      'spirit-of-ecstasy',
      'enzo',
      'afrodita-negroni',
      'sloe-negroni',
      'tom-cherry-negroni',
      'baroque',
      'vitruvian-negroni',
      'june-strong',
      'twin-negroni',
      'dandelion-negroni',
      'pommac-grace',
      'picardia-negroni',
      'ragnars-negroni',
      'banano-torino',
      'grape-x-3-enzoni',
      'midnight-negroni',
      'kimchi-ttalgi',
      'twist-me-gently',
      'the-real-answer',
      'g-negroni',
      'peanut-negroni',
      'laura-biagiotti',
      'hotei',
      'marina-tsvetaeva',
      'the-carlton',
      'grays-dream',
      'love-death-robots',
      'kamaishi',
      'negroni-grecha',
      'the-freemasons',
      'rogue',
      'fireplace',
      'rye-bread-negroni',
      'dante-dark-negroni',
      'enzoni',
      'apollo-wrath-of-helios',
      'nikitich',
      'daichi-harada',
      'wax-negroni',
    ],
    icon: '',
  },
];

export function getCurationById(id: string): Curation | undefined {
  return curations.find((c) => c.id === id);
}
