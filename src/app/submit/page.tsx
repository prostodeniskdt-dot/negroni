'use client';

import { useState } from 'react';
import { useI18n } from '@/hooks/useI18n';
import Reveal from '@/components/Reveal';
import Link from 'next/link';

export default function SubmitRecipePage() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    recipeName: '',
    city: '',
    authorName: '',
    barName: '',
    ingredients: '',
    steps: '',
    intro: '',
    method: 'Stir',
    glass: 'Rocks',
    garnish: '',
    tags: '',
    email: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.recipeName.trim()) newErrors.recipeName = t('submit.errName');
    if (!formData.city.trim()) newErrors.city = t('submit.errCity');
    if (!formData.authorName.trim()) newErrors.authorName = t('submit.errAuthor');
    if (!formData.ingredients.trim()) newErrors.ingredients = t('submit.errIngredients');
    if (!formData.steps.trim()) newErrors.steps = t('submit.errSteps');
    if (!formData.intro.trim()) newErrors.intro = t('submit.errIntro');
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = t('submit.errEmail');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Recipe submission:', formData);
    setSending(false);
    setSubmitted(true);
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 bg-[var(--color-bg)] border ${
      errors[field] ? 'border-[var(--color-campari)]' : 'border-[var(--color-border)]'
    } rounded-[var(--radius-sm)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-campari)] transition-colors`;

  if (submitted) {
    return (
      <section className="mt-[60px] min-h-[60vh] flex flex-col items-center justify-center px-8 py-16 text-center">
        <div className="max-w-md">
          <span className="text-6xl mb-6 block">✅</span>
          <h1 className="font-[var(--font-display)] text-2xl font-bold uppercase tracking-wide mb-4">
            {t('submit.title')}
          </h1>
          <p className="text-[var(--color-text-muted)] font-[var(--font-serif)] mb-6">
            {t('submit.success')}
          </p>
          <Link
            href="/collection"
            className="inline-block px-6 py-3 bg-[var(--color-campari)] text-[var(--color-on-campari)] rounded-[var(--radius-md)] font-semibold hover:bg-[var(--color-campari-light)] transition-colors"
          >
            {t('recipe.backToCollection')}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="mt-[60px] min-h-[25vh] flex flex-col justify-center px-8 py-10 relative overflow-hidden noise-overlay">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[40%] bg-[radial-gradient(ellipse_at_center,rgba(187,10,48,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative z-10 max-w-[700px]">
          <h1 className="font-[var(--font-display)] text-[clamp(2rem,5vw,3rem)] font-bold uppercase tracking-wide leading-[0.95] mb-3">
            {t('submit.heroTitle')}
          </h1>
          <p className="font-[var(--font-serif)] text-[var(--color-text-muted)] max-w-[55ch] leading-relaxed">
            {t('submit.heroDesc')}
          </p>
        </div>
      </section>

      {/* Form */}
      <Reveal as="section" className="px-6 py-10 max-w-[700px] mx-auto">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]"
          noValidate
        >
          {/* Recipe name */}
          <div>
            <input
              type="text"
              placeholder={t('submit.recipeName')}
              value={formData.recipeName}
              onChange={(e) => updateField('recipeName', e.target.value)}
              className={inputClass('recipeName')}
            />
            {errors.recipeName && <p className="text-xs text-[var(--color-campari)] mt-1">{errors.recipeName}</p>}
          </div>

          {/* City + Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder={t('submit.city')}
                value={formData.city}
                onChange={(e) => updateField('city', e.target.value)}
                className={inputClass('city')}
              />
              {errors.city && <p className="text-xs text-[var(--color-campari)] mt-1">{errors.city}</p>}
            </div>
            <div>
              <input
                type="text"
                placeholder={t('submit.authorName')}
                value={formData.authorName}
                onChange={(e) => updateField('authorName', e.target.value)}
                className={inputClass('authorName')}
              />
              {errors.authorName && <p className="text-xs text-[var(--color-campari)] mt-1">{errors.authorName}</p>}
            </div>
          </div>

          {/* Bar name */}
          <input
            type="text"
            placeholder={t('submit.barName')}
            value={formData.barName}
            onChange={(e) => updateField('barName', e.target.value)}
            className={inputClass('barName')}
          />

          {/* Intro */}
          <div>
            <textarea
              placeholder={t('submit.intro')}
              value={formData.intro}
              onChange={(e) => updateField('intro', e.target.value)}
              rows={3}
              className={`${inputClass('intro')} resize-y`}
            />
            {errors.intro && <p className="text-xs text-[var(--color-campari)] mt-1">{errors.intro}</p>}
          </div>

          {/* Ingredients */}
          <div>
            <textarea
              placeholder={t('submit.ingredients')}
              value={formData.ingredients}
              onChange={(e) => updateField('ingredients', e.target.value)}
              rows={5}
              className={`${inputClass('ingredients')} resize-y`}
            />
            {errors.ingredients && <p className="text-xs text-[var(--color-campari)] mt-1">{errors.ingredients}</p>}
          </div>

          {/* Steps */}
          <div>
            <textarea
              placeholder={t('submit.steps')}
              value={formData.steps}
              onChange={(e) => updateField('steps', e.target.value)}
              rows={5}
              className={`${inputClass('steps')} resize-y`}
            />
            {errors.steps && <p className="text-xs text-[var(--color-campari)] mt-1">{errors.steps}</p>}
          </div>

          {/* Method + Glass */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">
                {t('submit.method')}
              </label>
              <select
                value={formData.method}
                onChange={(e) => updateField('method', e.target.value)}
                className={inputClass('method')}
              >
                <option value="Stir">Stir</option>
                <option value="Build">Build</option>
                <option value="Shake">Shake</option>
                <option value="Throw">Throw</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">
                {t('submit.glass')}
              </label>
              <select
                value={formData.glass}
                onChange={(e) => updateField('glass', e.target.value)}
                className={inputClass('glass')}
              >
                <option value="Rocks">Rocks</option>
                <option value="Coupe">Coupe</option>
                <option value="Nick & Nora">Nick & Nora</option>
                <option value="Highball">Highball</option>
              </select>
            </div>
          </div>

          {/* Garnish + Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder={t('submit.garnish')}
              value={formData.garnish}
              onChange={(e) => updateField('garnish', e.target.value)}
              className={inputClass('garnish')}
            />
            <input
              type="text"
              placeholder={t('submit.tags')}
              value={formData.tags}
              onChange={(e) => updateField('tags', e.target.value)}
              className={inputClass('tags')}
            />
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder={t('submit.email')}
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className={inputClass('email')}
            />
            {errors.email && <p className="text-xs text-[var(--color-campari)] mt-1">{errors.email}</p>}
          </div>

          {/* Notes */}
          <textarea
            placeholder={t('submit.notes')}
            value={formData.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            rows={3}
            className={`${inputClass('notes')} resize-y`}
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={sending}
            className="w-full py-4 bg-[var(--color-campari)] text-[var(--color-on-campari)] font-semibold rounded-[var(--radius-md)] hover:bg-[var(--color-campari-light)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {sending ? t('submit.sending') : t('submit.send')}
          </button>
        </form>
      </Reveal>
    </>
  );
}
