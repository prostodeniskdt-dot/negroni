'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function RegisterClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = useMemo(() => searchParams.get('next') || '/cabinet', [searchParams]);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    barName: '',
    city: '',
    email: '',
    password: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          username: form.username.trim(),
          barName: form.barName.trim() || undefined,
          city: form.city.trim() || undefined,
          email: form.email.trim(),
          password: form.password,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j?.error || 'REGISTER_FAILED');
        return;
      }
      router.replace(nextPath);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  const input = 'w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-campari)]';
  const label = 'block text-xs text-[var(--color-text-secondary)] uppercase tracking-wider mb-1';

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] p-6">
        <h1 className="font-[var(--font-display)] text-2xl font-bold uppercase tracking-wide mb-2">
          Регистрация
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mb-6">
          Создайте кабинет, чтобы сохранять избранные рецепты и подборки.
        </p>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={label}>Имя</label>
              <input className={input} value={form.firstName} onChange={(e) => onChange('firstName', e.target.value)} required />
            </div>
            <div>
              <label className={label}>Фамилия</label>
              <input className={input} value={form.lastName} onChange={(e) => onChange('lastName', e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={label}>Логин (username)</label>
              <input className={input} value={form.username} onChange={(e) => onChange('username', e.target.value)} placeholder="например: negroni.fan" required />
              <div className="mt-1 text-xs text-[var(--color-text-muted)]">Допустимо: латиница, цифры, точка, подчёркивание, дефис.</div>
            </div>
            <div>
              <label className={label}>Город</label>
              <input className={input} value={form.city} onChange={(e) => onChange('city', e.target.value)} placeholder="необязательно" />
            </div>
          </div>

          <div>
            <label className={label}>Бар</label>
            <input className={input} value={form.barName} onChange={(e) => onChange('barName', e.target.value)} placeholder="необязательно" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={label}>Email</label>
              <input className={input} type="email" value={form.email} onChange={(e) => onChange('email', e.target.value)} required />
            </div>
            <div>
              <label className={label}>Пароль</label>
              <input className={input} type="password" value={form.password} onChange={(e) => onChange('password', e.target.value)} required minLength={8} />
              <div className="mt-1 text-xs text-[var(--color-text-muted)]">Минимум 8 символов.</div>
            </div>
          </div>

          {error && <div className="text-sm text-[var(--color-campari)]">{error}</div>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[var(--color-campari)] text-[var(--color-on-campari)] font-semibold rounded-[var(--radius-md)] hover:bg-[var(--color-campari-light)] transition-colors disabled:opacity-60"
          >
            {submitting ? 'Создаём…' : 'Создать аккаунт'}
          </button>
        </form>

        <div className="mt-4 text-sm text-[var(--color-text-muted)]">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="text-[var(--color-campari)] hover:text-[var(--color-campari-light)]">
            Войти
          </Link>
        </div>
      </div>
    </main>
  );
}

