'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Search, X } from 'lucide-react';
import type { RecipeEntry } from '@/data/recipes';
import {
  groupTagsByCategory,
  getPopularTagsFrom,
  type TagGroup,
} from '@/lib/recipe-tags';

interface RecipeTagsFilterProps {
  recipes: RecipeEntry[];
  tags: string[];
  activeTags: string[];
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
}

function tagPillClass(isActive: boolean) {
  return `rounded-full px-3 py-1.5 text-sm transition-all ${
    isActive
      ? 'bg-[var(--color-campari)] text-[var(--color-on-campari)] shadow-[0_0_18px_rgba(187,10,48,0.25)]'
      : 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:border-[var(--color-campari)] hover:text-[var(--color-text-primary)]'
  }`;
}

function TagPill({
  tag,
  isActive,
  onClick,
}: {
  tag: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className={tagPillClass(isActive)}>
      {tag}
    </button>
  );
}

function TagsGroupPanel({
  group,
  activeTags,
  onToggleTag,
}: {
  group: TagGroup;
  activeTags: string[];
  onToggleTag: (tag: string) => void;
}) {
  const selectedCount = group.tags.filter((tag) => activeTags.includes(tag)).length;

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)]/70 p-4">
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{group.title}</h3>
          {selectedCount > 0 && (
            <span className="rounded-full bg-[var(--color-campari)]/15 px-2 py-0.5 text-[0.65rem] text-[var(--color-campari)]">
              {selectedCount}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{group.description}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {group.tags.map((tag) => (
          <TagPill
            key={tag}
            tag={tag}
            isActive={activeTags.includes(tag)}
            onClick={() => onToggleTag(tag)}
          />
        ))}
      </div>
    </div>
  );
}

function TagsModal({
  groupedTags,
  activeTags,
  onToggleTag,
  onClearTags,
  onClose,
}: {
  groupedTags: TagGroup[];
  activeTags: string[];
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
  onClose: () => void;
}) {
  const [modalTagSearch, setModalTagSearch] = useState('');

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  const filteredGroups = useMemo(() => {
    const query = modalTagSearch.trim().toLowerCase();
    if (!query) return groupedTags;

    return groupedTags
      .map((group) => ({
        ...group,
        tags: group.tags.filter((tag) => tag.toLowerCase().includes(query)),
      }))
      .filter((group) => group.tags.length > 0);
  }, [groupedTags, modalTagSearch]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tags-modal-title"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div
        className="relative w-full sm:max-w-3xl max-h-[92vh] sm:max-h-[85vh] flex flex-col bg-[var(--color-bg)] border border-[var(--color-border)] rounded-t-[var(--radius-lg)] sm:rounded-[var(--radius-lg)] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] px-5 py-4 shrink-0">
          <div>
            <h2
              id="tags-modal-title"
              className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-text-primary)]"
            >
              Все теги по группам
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              {activeTags.length > 0
                ? `Выбрано: ${activeTags.length}`
                : 'Выбирайте один или несколько тегов'}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {activeTags.length > 0 && (
              <button
                type="button"
                onClick={onClearTags}
                className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs uppercase tracking-wider text-[var(--color-text-muted)] hover:border-[var(--color-campari)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                Сбросить
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-[var(--color-surface)] hover:bg-[var(--color-surface-solid)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              aria-label="Закрыть"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="px-5 py-3 border-b border-[var(--color-border)] shrink-0 relative">
          <Search
            size={16}
            className="absolute left-8 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
          />
          <input
            type="text"
            value={modalTagSearch}
            onChange={(e) => setModalTagSearch(e.target.value)}
            placeholder="Поиск по тегам..."
            className="w-full pl-9 pr-4 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-campari)] transition-colors text-sm"
            autoFocus
          />
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4">
          {filteredGroups.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
              Теги не найдены
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredGroups.map((group) => (
                <TagsGroupPanel
                  key={group.id}
                  group={group}
                  activeTags={activeTags}
                  onToggleTag={onToggleTag}
                />
              ))}
            </div>
          )}
          {modalTagSearch.trim() && filteredGroups.length > 0 && (
            <p className="mt-4 text-xs text-[var(--color-text-muted)] text-center">
              Показаны теги, содержащие «{modalTagSearch.trim()}»
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RecipeTagsFilter({
  recipes,
  tags,
  activeTags,
  onToggleTag,
  onClearTags,
}: RecipeTagsFilterProps) {
  const [tagSearch, setTagSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const popularTags = useMemo(() => getPopularTagsFrom(recipes, 10), [recipes]);
  const groupedTags = useMemo(() => groupTagsByCategory(tags), [tags]);

  const searchSuggestions = useMemo(() => {
    const query = tagSearch.trim().toLowerCase();
    if (!query) return [];
    return tags
      .filter((tag) => tag.toLowerCase().includes(query) && !activeTags.includes(tag))
      .slice(0, 8);
  }, [tagSearch, tags, activeTags]);

  const selectTagFromSearch = useCallback(
    (tag: string) => {
      onToggleTag(tag);
      setTagSearch('');
      setSuggestionsOpen(false);
    },
    [onToggleTag]
  );

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchSuggestions.length > 0) {
      e.preventDefault();
      selectTagFromSearch(searchSuggestions[0]);
    }
    if (e.key === 'Escape') {
      setSuggestionsOpen(false);
      setTagSearch('');
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-text-primary)]">
          Теги рецептов
        </p>
        <p className="text-sm text-[var(--color-text-muted)]">
          Поиск, популярные теги или полный список по группам.
        </p>
      </div>

      <div ref={searchRef} className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
        />
        <input
          type="text"
          value={tagSearch}
          onChange={(e) => {
            setTagSearch(e.target.value);
            setSuggestionsOpen(true);
          }}
          onFocus={() => setSuggestionsOpen(true)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Найти тег..."
          className="w-full pl-9 pr-4 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-campari)] transition-colors"
        />
        {suggestionsOpen && searchSuggestions.length > 0 && (
          <ul className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-solid)] shadow-lg">
            {searchSuggestions.map((tag) => (
              <li key={tag}>
                <button
                  type="button"
                  onClick={() => selectTagFromSearch(tag)}
                  className="w-full px-4 py-2 text-left text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-campari)]/10 transition-colors"
                >
                  {tag}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {popularTags.length > 0 && (
        <div>
          <p className="mb-2 text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
            Популярные
          </p>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <TagPill
                key={tag}
                tag={tag}
                isActive={activeTags.includes(tag)}
                onClick={() => onToggleTag(tag)}
              />
            ))}
          </div>
        </div>
      )}

      {activeTags.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
              Выбрано ({activeTags.length})
            </p>
            <button
              type="button"
              onClick={onClearTags}
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-campari)] transition-colors"
            >
              Сбросить все
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onToggleTag(tag)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-campari)] px-3 py-1.5 text-sm text-[var(--color-on-campari)] shadow-[0_0_18px_rgba(187,10,48,0.25)]"
              >
                {tag}
                <X size={14} />
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="w-full sm:w-auto px-4 py-2.5 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] hover:border-[var(--color-campari)] transition-all"
      >
        Все теги по группам →
      </button>

      {modalOpen && (
        <TagsModal
          groupedTags={groupedTags}
          activeTags={activeTags}
          onToggleTag={onToggleTag}
          onClearTags={onClearTags}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
