import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc4.woff',
      fontWeight: 700,
    },
  ],
});

export type PdfRecipe = {
  slug: string;
  name: string;
  region: string;
  intro: string;
  image?: string | null;
  method: string;
  glass: string;
  garnish: string;
  ice: string;
  ingredients: string[];
  steps: string[];
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 34,
    paddingBottom: 34,
    paddingHorizontal: 36,
    fontSize: 11,
    fontFamily: 'Roboto',
    color: '#1c1c1c',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e6d8d8',
    paddingBottom: 12,
  },
  title: { fontSize: 22, fontWeight: 700, textTransform: 'uppercase', color: '#5c0a20' },
  region: { marginTop: 5, color: '#7a6268', fontSize: 11 },
  intro: { marginTop: 10, lineHeight: 1.45, color: '#333', fontSize: 11 },
  heroRow: { flexDirection: 'row', marginTop: 12 },
  heroImage: { width: 160, height: 120, objectFit: 'cover' },
  tech: {
    flexGrow: 1,
    marginLeft: 14,
    borderWidth: 1,
    borderColor: '#eadddd',
    padding: 10,
  },
  techLabel: { fontSize: 8, color: '#8b1538', textTransform: 'uppercase', fontWeight: 700 },
  techValue: { marginTop: 2, marginBottom: 7, fontSize: 10, color: '#222' },
  section: { marginTop: 14 },
  h3: { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 7, color: '#5c0a20' },
  li: { marginBottom: 4, lineHeight: 1.35, fontSize: 10.5 },
  footer: { marginTop: 18, borderTopWidth: 1, borderTopColor: '#eadddd', paddingTop: 8, color: '#7a6268', fontSize: 8 },
  recipeSeparator: { marginTop: 10, marginBottom: 0 },
  empty: { color: '#777', fontSize: 10 },
});

function TechBlock({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text style={styles.techLabel}>{label}</Text>
      <Text style={styles.techValue}>{value || '—'}</Text>
    </View>
  );
}

export function RecipesPdf({
  title,
  recipes,
}: {
  title: string;
  recipes: PdfRecipe[];
}) {
  return (
    <Document title={title}>
      {recipes.map((r, idx) => (
        <Page key={r.slug} size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>{r.name}</Text>
            <Text style={styles.region}>{r.region}</Text>
            <Text style={styles.intro}>{r.intro}</Text>
          </View>

          <View style={styles.heroRow} wrap={false}>
            {r.image ? <Image style={styles.heroImage} src={r.image} /> : null}
            <View style={styles.tech}>
              <TechBlock label="Метод" value={r.method} />
              <TechBlock label="Бокал" value={r.glass} />
              <TechBlock label="Гарнир" value={r.garnish} />
              <TechBlock label="Лёд" value={r.ice} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.h3}>Ингредиенты</Text>
            {r.ingredients.length ? (
              r.ingredients.map((x, i) => (
                <Text key={i} style={styles.li}>- {x}</Text>
              ))
            ) : (
              <Text style={styles.empty}>Ингредиенты не указаны</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.h3}>Шаги</Text>
            {r.steps.length ? (
              r.steps.map((x, i) => (
                <Text key={i} style={styles.li}>{i + 1}. {x}</Text>
              ))
            ) : (
              <Text style={styles.empty}>Шаги не указаны</Text>
            )}
          </View>

          <View style={styles.footer}>
            <Text>negroni · {new Date().toLocaleDateString('ru-RU')}</Text>
            <Text>recipe: /recipe/{r.slug}</Text>
          </View>

          {idx < recipes.length - 1 ? <View style={styles.recipeSeparator} /> : null}
        </Page>
      ))}
    </Document>
  );
}

