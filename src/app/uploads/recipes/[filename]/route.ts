import { readFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const contentTypes: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
};

export async function GET(_req: Request, ctx: { params: Promise<{ filename: string }> }) {
  const { filename } = await ctx.params;
  const safeName = path.basename(filename);
  if (safeName !== filename) {
    return NextResponse.json({ error: 'INVALID_FILENAME' }, { status: 400 });
  }

  const extension = safeName.split('.').pop()?.toLowerCase() ?? '';
  const contentType = contentTypes[extension];
  if (!contentType) {
    return NextResponse.json({ error: 'UNSUPPORTED_FILE_TYPE' }, { status: 400 });
  }

  try {
    const file = await readFile(path.join(process.cwd(), 'public', 'uploads', 'recipes', safeName));
    return new Response(new Uint8Array(file), {
      headers: {
        'content-type': contentType,
        'cache-control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
  }
}
