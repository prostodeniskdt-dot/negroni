import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

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
    padding: 32,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#111',
  },
  header: {
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  title: { fontSize: 20, fontWeight: 700, textTransform: 'uppercase' },
  region: { marginTop: 4, color: '#666', fontSize: 12 },
  intro: { marginTop: 10, lineHeight: 1.4, color: '#333' },
  heroRow: { flexDirection: 'row', gap: 14, marginTop: 14 },
  heroImage: { width: 180, height: 135, objectFit: 'cover', borderRadius: 6 },
  tech: {
    flexGrow: 1,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 6,
    padding: 10,
  },
  techLabel: { fontSize: 9, color: '#777', textTransform: 'uppercase' },
  techValue: { marginTop: 2, marginBottom: 8, fontSize: 11 },
  section: { marginTop: 16 },
  h3: { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 },
  li: { marginBottom: 3, lineHeight: 1.35 },
  footer: { marginTop: 18, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 8, color: '#777', fontSize: 9 },
  recipeSeparator: { marginTop: 10, marginBottom: 0 },
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

          <View style={styles.heroRow}>
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
            {r.ingredients.map((x, i) => (
              <Text key={i} style={styles.li}>• {x}</Text>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.h3}>Шаги</Text>
            {r.steps.map((x, i) => (
              <Text key={i} style={styles.li}>{i + 1}. {x}</Text>
            ))}
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

