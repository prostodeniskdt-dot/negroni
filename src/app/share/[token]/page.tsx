import Link from 'next/link';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const share = await prisma.shareLink.findUnique({
    where: { token },
    select: {
      kind: true,
      lang: true,
      collectionId: true,
      recipeId: true,
      userId: true,
      collection: {
        select: {
          name: true,
          items: { orderBy: { position: 'asc' }, select: { recipe: { select: { slug: true, name: true, region: true, intro: true, image: true } } } },
        },
      },
    },
  });

  if (!share) {
    return (
      <main className="min-h-screen px-6 py-10 max-w-[1100px] mx-auto">
        <div className="text-sm text-[var(--color-text-muted)]">Ссылка не найдена.</div>
      </main>
    );
  }

  let title = 'Подборка';
  let recipes: { slug: string; name: string; region: string; intro: string; image: string }[] = [];

  if (share.kind === 'collection' && share.collection) {
    title = share.collection.name;
    recipes = share.collection.items.map((x) => x.recipe);
  } else if (share.kind === 'favorites') {
    title = 'Избранное';
    const fav = await prisma.favorite.findMany({
      where: { userId: share.userId },
      orderBy: { createdAt: 'desc' },
      select: { recipe: { select: { slug: true, name: true, region: true, intro: true, image: true } } },
    });
    recipes = fav.map((x) => x.recipe);
  } else if (share.kind === 'recipe' && share.recipeId) {
    title = 'Рецепт';
    const r = await prisma.recipe.findUnique({
      where: { id: share.recipeId },
      select: { slug: true, name: true, region: true, intro: true, image: true },
    });
    if (r) recipes = [r];
  }

  return (
    <main className="min-h-screen px-6 py-10 max-w-[1200px] mx-auto">
      <div className="flex items-start justify-between gap-6 mb-8">
        <div>
          <h1 className="font-[var(--font-display)] text-3xl font-bold uppercase tracking-wide">
            {title}
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {recipes.length} рецептов
          </p>
        </div>
        <Link href="/collection" className="px-4 py-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:border-[var(--color-campari)] transition-colors">
          В коллекцию
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div className="text-sm text-[var(--color-text-muted)]">Пусто.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((r) => (
            <Link
              key={r.slug}
              href={`/recipe/${r.slug}`}
              className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-[var(--transition-base)] hover:border-[var(--color-campari)] group"
            >
              <div
                className="relative aspect-[4/3] bg-cover bg-center"
                style={{ backgroundImage: `url(${r.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-campari-darker)] via-transparent to-transparent opacity-60" />
              </div>
              <div className="relative p-5">
                <span className="inline-block text-[0.7rem] text-[var(--color-on-campari)] bg-[var(--color-campari)] px-2 py-0.5 rounded-full uppercase tracking-wide mb-2">
                  {r.region}
                </span>
                <h3 className="font-[var(--font-display)] text-lg font-bold uppercase tracking-wide mb-1.5 group-hover:text-[var(--color-campari-light)] transition-colors">
                  {r.name}
                </h3>
                <p className="text-[0.9rem] text-[var(--color-text-muted)] leading-snug line-clamp-2">
                  {r.intro}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

