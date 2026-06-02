import { NextResponse } from 'next/server';
import { z } from 'zod';
import { pdf } from '@react-pdf/renderer';
import React from 'react';
import { readFile } from 'fs/promises';
import path from 'path';
import { getRecipeById } from '@/data/recipes';
import { normalizeRecipeEntry } from '@/lib/public-recipes';
import { RecipesPdf, type PdfRecipe } from '@/lib/pdf/RecipesPdf';

export const runtime = 'nodejs';

const QuerySchema = z.object({
  id: z.string().optional(),
  lang: z.string().optional(),
});

const imageContentTypes: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
};

async function normalizeImageForPdf(image?: string | null) {
  if (!image) return null;
  if (!image.startsWith('/uploads/recipes/')) return image;

  const filename = path.basename(image);
  const extension = filename.split('.').pop()?.toLowerCase() ?? '';
  const contentType = imageContentTypes[extension];
  if (!contentType) return null;

  try {
    const file = await readFile(path.join(process.cwd(), 'public', 'uploads', 'recipes', filename));
    return `data:${contentType};base64,${file.toString('base64')}`;
  } catch {
    return null;
  }
}

async function normalizeRecipes(list: any[]): Promise<PdfRecipe[]> {
  return Promise.all(list.map(async (r) => ({
    slug: r.slug,
    name: r.name,
    region: r.region,
    intro: r.intro,
    image: await normalizeImageForPdf(r.image),
    method: r.method,
    glass: r.glass,
    garnish: r.garnish,
    ice: r.ice,
    ingredients: r.ingredients ?? [],
    steps: r.steps ?? [],
  })));
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = Object.fromEntries(url.searchParams.entries());
  const parsed = QuerySchema.safeParse(q);
  if (!parsed.success) return NextResponse.json({ error: 'INVALID_QUERY' }, { status: 400 });

  const { id } = parsed.data;

  if (!id) return NextResponse.json({ error: 'ID_REQUIRED' }, { status: 400 });
  const entry = getRecipeById(id);
  if (!entry) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
  const normalized = normalizeRecipeEntry(entry);
  const title = normalized.recipe.name;
  const recipes = [{
    slug: normalized.id,
    name: normalized.recipe.name,
    region: normalized.recipe.region,
    intro: normalized.recipe.intro,
    image: normalized.recipe.image,
    method: normalized.recipe.method,
    glass: normalized.recipe.glass,
    garnish: normalized.recipe.garnish,
    ice: normalized.recipe.ice,
    ingredients: normalized.recipe.ingredients,
    steps: normalized.recipe.steps,
  }];

  const doc = React.createElement(RecipesPdf, { title, recipes: await normalizeRecipes(recipes) });
  // @react-pdf/renderer provides Node helpers; `toBuffer()` is the most compatible for Response.
  const buf: Buffer = await (pdf(doc) as any).toBuffer();
  const body = new Uint8Array(buf);

  return new Response(body, {
    status: 200,
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': `attachment; filename="${encodeURIComponent(title)}.pdf"`,
      'cache-control': 'no-store',
    },
  });
}

