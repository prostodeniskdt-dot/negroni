import { existsSync } from 'fs';
import path from 'path';
import React from 'react';
import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

function resolveFontDir() {
  const candidates = [
    path.join(process.cwd(), 'fonts'),
    path.join(process.cwd(), 'src/lib/pdf/fonts'),
  ];
  return candidates.find((dir) => existsSync(path.join(dir, 'CormorantGaramond-Regular.ttf'))) ?? candidates[0];
}

const fontDir = resolveFontDir();

Font.register({
  family: 'Cormorant',
  fonts: [
    { src: path.join(fontDir, 'CormorantGaramond-Regular.ttf'), fontWeight: 400 },
    { src: path.join(fontDir, 'CormorantGaramond-Medium.ttf'), fontWeight: 500 },
    { src: path.join(fontDir, 'CormorantGaramond-SemiBold.ttf'), fontWeight: 600 },
    { src: path.join(fontDir, 'CormorantGaramond-Bold.ttf'), fontWeight: 700 },
    { src: path.join(fontDir, 'CormorantGaramond-Italic.ttf'), fontWeight: 400, fontStyle: 'italic' },
  ],
});

Font.registerHyphenationCallback((word) => [word]);

export type PdfPrebatch = {
  name: string;
  ingredients: string[];
  steps: string[];
};

export type PdfRecipe = {
  slug: string;
  name: string;
  region: string;
  city: string;
  author: string;
  bar: string;
  barCity: string;
  intro: string;
  story: string;
  image: { src: string; width: number; height: number } | null;
  authorImage: string | null;
  method: string;
  glass: string;
  garnish: string;
  ice: string;
  difficulty: string;
  category: string;
  ingredients: string[];
  steps: string[];
  prebatchNote: string;
  prebatches: PdfPrebatch[];
  flavor: { label: string; value: number }[];
};

const paper = '#f6f1e8';
const ink = '#24181a';
const wine = '#7a1f33';
const wineDeep = '#3d1018';
const gold = '#9a7844';
const muted = '#6d5c56';
const line = '#e3d5c6';

const styles = StyleSheet.create({
  page: {
    backgroundColor: paper,
    paddingTop: 58,
    paddingBottom: 46,
    paddingHorizontal: 36,
    fontFamily: 'Cormorant',
    color: ink,
    fontSize: 12,
  },
  band: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 42,
    backgroundColor: wineDeep,
    paddingHorizontal: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    color: '#f6f1e8',
    fontSize: 11,
    letterSpacing: 2.4,
    fontWeight: 600,
  },
  bandMeta: {
    color: '#e7c98a',
    fontSize: 10,
    letterSpacing: 1.2,
  },
  footer: {
    position: 'absolute',
    bottom: 16,
    left: 36,
    right: 36,
    borderTopWidth: 0.6,
    borderTopColor: line,
    paddingTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    color: muted,
    fontSize: 9,
    letterSpacing: 0.6,
  },
  kicker: {
    color: gold,
    fontSize: 10,
    letterSpacing: 1.8,
    fontWeight: 600,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 600,
    color: wineDeep,
    lineHeight: 1.05,
  },
  intro: {
    marginTop: 8,
    fontSize: 12.5,
    lineHeight: 1.35,
    color: '#3a2c2e',
    fontStyle: 'italic',
  },
  meta: {
    marginTop: 6,
    color: muted,
    fontSize: 11,
  },
  heroWrap: {
    marginTop: 14,
    alignItems: 'center',
  },
  hero: {
    objectFit: 'contain',
  },
  specs: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 8,
  },
  spec: {
    flexGrow: 1,
    flexBasis: 0,
    backgroundColor: '#fffaf4',
    borderWidth: 0.6,
    borderColor: line,
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  specLabel: {
    color: gold,
    fontSize: 8,
    letterSpacing: 1.1,
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  specValue: {
    marginTop: 2,
    fontSize: 11,
    color: ink,
  },
  section: {
    marginTop: 16,
  },
  h3: {
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 1.4,
    color: wine,
    textTransform: 'uppercase',
    marginBottom: 7,
  },
  columns: {
    flexDirection: 'row',
    gap: 18,
  },
  column: {
    flexGrow: 1,
    flexBasis: 0,
  },
  ingredient: {
    fontSize: 12,
    lineHeight: 1.55,
    marginBottom: 4,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  stepNo: {
    width: 22,
    color: wine,
    fontWeight: 600,
    fontSize: 12,
    lineHeight: 1.55,
  },
  stepText: {
    flexGrow: 1,
    flexBasis: 0,
    fontSize: 12,
    lineHeight: 1.55,
  },
  batchLine: {
    fontSize: 12,
    lineHeight: 1.55,
    marginBottom: 4,
  },
  story: {
    fontSize: 12,
    lineHeight: 1.55,
    color: '#3a2c2e',
  },
  batch: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fffaf4',
    borderWidth: 0.6,
    borderColor: line,
  },
  batchName: {
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 4,
    color: wineDeep,
  },
  flavorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  flavorLabel: {
    width: 78,
    fontSize: 11,
    color: muted,
  },
  flavorTrack: {
    flex: 1,
    height: 5,
    backgroundColor: '#eadfd3',
  },
  flavorFill: {
    height: 5,
    backgroundColor: wine,
  },
  authorRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  authorImage: {
    width: 46,
    height: 46,
    objectFit: 'cover',
  },
  cover: {
    backgroundColor: wineDeep,
    padding: 48,
    fontFamily: 'Cormorant',
    color: '#f6f1e8',
  },
  coverRule: {
    width: 64,
    height: 1,
    backgroundColor: '#e7c98a',
    marginTop: 14,
    marginBottom: 14,
  },
  coverTitle: {
    fontSize: 42,
    fontWeight: 600,
    letterSpacing: 1.5,
  },
  coverSub: {
    fontSize: 16,
    color: '#e7c98a',
    letterSpacing: 2,
  },
  coverCount: {
    marginTop: 8,
    fontSize: 13,
    color: '#f0d7c8',
  },
  indexItem: {
    fontSize: 12,
    marginBottom: 3,
    color: '#f6f1e8',
  },
  indexWrap: {
    marginTop: 22,
    flexDirection: 'row',
    gap: 24,
  },
  indexCol: {
    flexGrow: 1,
    flexBasis: 0,
  },
});

const PAGE_CONTENT_WIDTH = 523;
const HERO_MAX_HEIGHT = 320;

function heroSize(width: number, height: number) {
  const safeWidth = width > 0 ? width : PAGE_CONTENT_WIDTH;
  const safeHeight = height > 0 ? height : Math.round(PAGE_CONTENT_WIDTH * 0.66);
  const ratio = safeHeight / safeWidth;
  let drawWidth = PAGE_CONTENT_WIDTH;
  let drawHeight = Math.round(drawWidth * ratio);
  if (drawHeight > HERO_MAX_HEIGHT) {
    drawHeight = HERO_MAX_HEIGHT;
    drawWidth = Math.round(drawHeight / ratio);
  }
  return { width: drawWidth, height: drawHeight };
}

function Spec({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <View style={styles.spec}>
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={styles.specValue}>{value}</Text>
    </View>
  );
}

function RecipePage({ recipe, index, total }: { recipe: PdfRecipe; index: number; total: number }) {
  const place = [recipe.author, recipe.bar, recipe.barCity || recipe.city].filter(Boolean).join('  ·  ');
  const half = Math.ceil(recipe.ingredients.length / 1);

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.band} fixed>
        <Text style={styles.brand}>МУЗЕЙ НЕГРОНИ</Text>
        <Text style={styles.bandMeta}>
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </Text>
      </View>

      <Text style={styles.kicker}>{[recipe.category, recipe.difficulty, recipe.region].filter(Boolean).join('   ·   ')}</Text>
      <Text style={styles.title}>{recipe.name}</Text>
      {place ? <Text style={styles.meta}>{place}</Text> : null}
      {recipe.intro ? <Text style={styles.intro}>{recipe.intro}</Text> : null}
      {recipe.image ? (
        <View style={styles.heroWrap}>
          <Image
            style={[styles.hero, heroSize(recipe.image.width, recipe.image.height)]}
            src={recipe.image.src}
          />
        </View>
      ) : null}

      <View style={styles.specs}>
        <Spec label="Метод" value={recipe.method} />
        <Spec label="Бокал" value={recipe.glass} />
        <Spec label="Гарнир" value={recipe.garnish} />
        <Spec label="Лёд" value={recipe.ice} />
      </View>

      <View style={styles.section}>
        <Text style={styles.h3}>Состав</Text>
        {recipe.ingredients.length ? (
          recipe.ingredients.slice(0, half).map((item, i) => (
            <Text key={i} style={styles.ingredient}>·  {item}</Text>
          ))
        ) : (
          <Text style={styles.meta}>Состав не указан</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.h3}>Приготовление</Text>
        {recipe.steps.map((step, i) => (
          <View key={i} style={styles.stepRow}>
            <Text style={styles.stepNo}>{i + 1}</Text>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>

      {(recipe.prebatches.length > 0 || recipe.prebatchNote) && (
        <View style={styles.section}>
          <Text style={styles.h3}>Заготовки</Text>
          {recipe.prebatchNote ? <Text style={styles.story}>{recipe.prebatchNote}</Text> : null}
          {recipe.prebatches.map((batch, batchIndex) => (
            <View key={batchIndex} style={styles.batch}>
              <Text style={styles.batchName}>{batch.name}</Text>
              {batch.ingredients.map((item, i) => (
                <Text key={`ing-${i}`} style={styles.batchLine}>·  {item}</Text>
              ))}
              {batch.steps.map((step, i) => (
                <Text key={`step-${i}`} style={styles.batchLine}>{i + 1}. {step}</Text>
              ))}
            </View>
          ))}
        </View>
      )}

      {recipe.story ? (
        <View style={styles.section}>
          <Text style={styles.h3}>История</Text>
          {recipe.story.split('\n\n').map((paragraph, i) => (
            <Text key={i} style={[styles.story, { marginBottom: 6 }]}>{paragraph}</Text>
          ))}
        </View>
      ) : null}

      <View style={styles.section} wrap={false}>
        <Text style={styles.h3}>Вкус</Text>
        {recipe.flavor.map((item) => (
          <View key={item.label} style={styles.flavorRow}>
            <Text style={styles.flavorLabel}>{item.label}</Text>
            <View style={styles.flavorTrack}>
              <View style={[styles.flavorFill, { width: `${item.value * 10}%` }]} />
            </View>
          </View>
        ))}
      </View>

      {(recipe.author || recipe.authorImage) && (
        <View style={styles.authorRow} wrap={false}>
          {recipe.authorImage ? <Image style={styles.authorImage} src={recipe.authorImage} /> : null}
          <View>
            {recipe.author ? <Text style={{ fontSize: 13, fontWeight: 600 }}>{recipe.author}</Text> : null}
            {recipe.bar ? <Text style={styles.meta}>{recipe.bar}</Text> : null}
          </View>
        </View>
      )}

      <View style={styles.footer} fixed>
        <Text style={styles.footerText}>museynegroni.ru</Text>
        <Text style={styles.footerText}>{recipe.name}</Text>
      </View>
    </Page>
  );
}

function Cover({ recipes }: { recipes: PdfRecipe[] }) {
  const midpoint = Math.ceil(recipes.length / 2);
  const columns = [recipes.slice(0, midpoint), recipes.slice(midpoint)];
  const date = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <Page size="A4" style={styles.cover}>
      <Text style={styles.coverSub}>BAR BOSS ONLINE</Text>
      <Text style={styles.coverTitle}>Музей{'\n'}Негрони</Text>
      <View style={styles.coverRule} />
      <Text style={{ fontSize: 18 }}>Барная карта</Text>
      <Text style={styles.coverCount}>{recipes.length} рецептов  ·  {date}</Text>
      <View style={styles.indexWrap}>
        {columns.map((column, columnIndex) => (
          <View key={columnIndex} style={styles.indexCol}>
            {column.map((recipe, i) => (
              <Text key={recipe.slug} style={styles.indexItem}>
                {String(columnIndex === 0 ? i + 1 : midpoint + i + 1).padStart(2, '0')}   {recipe.name}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </Page>
  );
}

export function RecipesPdf({ title, recipes }: { title: string; recipes: PdfRecipe[] }) {
  return (
    <Document title={title} author="Музей Негрони">
      {recipes.length > 1 ? <Cover recipes={recipes} /> : null}
      {recipes.map((recipe, index) => (
        <RecipePage key={recipe.slug} recipe={recipe} index={index} total={recipes.length} />
      ))}
    </Document>
  );
}
