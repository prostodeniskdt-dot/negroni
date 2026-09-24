import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import { z } from 'zod';
import { RecipesPdf } from '@/lib/pdf/RecipesPdf';
import { allRecipeIds, loadPdfRecipes } from '@/lib/pdf/load-recipes';

export const runtime = 'nodejs';
export const maxDuration = 60;

const QuerySchema = z.object({
  id: z.string().optional(),
  ids: z.string().optional(),
  all: z.string().optional(),
});

function asciiFallback(name: string) {
  const safe = name
    .normalize('NFKD')
    .replace(/[^\w.\- ]+/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return safe || 'negroni';
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse(Object.fromEntries(url.searchParams.entries()));
  if (!parsed.success) return NextResponse.json({ error: 'INVALID_QUERY' }, { status: 400 });

  const { id, ids, all } = parsed.data;
  let selected: string[] = [];

  if (all === '1' || all === 'true') selected = allRecipeIds();
  else if (ids) selected = ids.split(',').map((item) => item.trim()).filter(Boolean);
  else if (id) selected = [id];

  if (selected.length === 0) {
    return NextResponse.json({ error: 'ID_REQUIRED' }, { status: 400 });
  }
  if (selected.length > 120) {
    return NextResponse.json({ error: 'TOO_MANY' }, { status: 400 });
  }

  try {
    const recipes = await loadPdfRecipes(selected);
    if (recipes.length === 0) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });

    const title = recipes.length === 1 ? recipes[0].name : `Музей Негрони — ${recipes.length} рецептов`;
    const filename = recipes.length === 1 ? recipes[0].name : `negroni-${recipes.length}`;
    const doc = React.createElement(RecipesPdf, { title, recipes });
    const buffer = await renderToBuffer(doc);

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'content-type': 'application/pdf',
        'content-disposition': `attachment; filename="${asciiFallback(filename)}.pdf"; filename*=UTF-8''${encodeURIComponent(filename)}.pdf`,
        'cache-control': 'no-store',
      },
    });
  } catch (error) {
    console.error('PDF export failed', error);
    return NextResponse.json({ error: 'PDF_FAILED' }, { status: 500 });
  }
}
