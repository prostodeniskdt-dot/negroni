'use client';

import { useState } from 'react';

export default function AdminImportPage() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const runSeed = async () => {
    setRunning(true);
    setResult(null);
    try {
      const res = await fetch('/api/admin/import/seed', { method: 'POST' });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setResult(`Error: ${j?.error || res.status}`);
        return;
      }
      setResult('Импорт выполнен.');
    } finally {
      setRunning(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-10 max-w-[900px] mx-auto">
      <h1 className="font-[var(--font-display)] text-2xl font-bold uppercase tracking-wide mb-2">
        Импорт данных
      </h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">
        Переносит текущие данные из `src/data/recipes.ts` и `src/data/partners.ts` в PostgreSQL.
      </p>

      <div className="p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] space-y-4">
        <button
          disabled={running}
          onClick={runSeed}
          className="px-5 py-3 rounded-[var(--radius-md)] bg-[var(--color-campari)] text-[var(--color-on-campari)] font-semibold hover:bg-[var(--color-campari-light)] transition-colors disabled:opacity-60"
        >
          {running ? 'Импортируем…' : 'Запустить импорт'}
        </button>
        {result && <div className="text-sm text-[var(--color-text-primary)]">{result}</div>}
        <div className="text-sm text-[var(--color-text-muted)]">
          Для первого админа используйте `npm run db:seed` с `ADMIN_EMAIL/ADMIN_PASSWORD` в окружении.
        </div>
      </div>
    </main>
  );
}

