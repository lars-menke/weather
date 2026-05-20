import { useState, useRef, useEffect, useCallback } from 'react';
import type { GeoLocation, Favorite } from '../types/weather';
import { searchCities } from '../api/weather';

interface SearchBarProps {
  onSelect: (location: GeoLocation) => void;
  onGPS: () => void;
  isLoadingGPS: boolean;
  favorites: Favorite[];
  onSelectFavorite: (fav: Favorite) => void;
  onRemoveFavorite: (fav: Favorite) => void;
  isDark?: boolean;
}

export function SearchBar({ onSelect, onGPS, isLoadingGPS, favorites, onSelectFavorite, onRemoveFavorite, isDark = false }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setIsFetching(true);
    try {
      const cities = await searchCities(q);
      setResults(cities);
      setActiveIndex(-1);
    } catch {
      setResults([]);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => doSearch(query), 350);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [query, doSearch]);

  useEffect(() => {
    function handlePointer(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) close();
    }
    document.addEventListener('pointerdown', handlePointer);
    return () => document.removeEventListener('pointerdown', handlePointer);
  }, []);

  function open() {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function close() {
    setIsOpen(false);
    setQuery('');
    setResults([]);
  }

  function handleSelect(loc: GeoLocation) {
    close();
    onSelect(loc);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { close(); return; }
    if (!results.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, -1)); }
    else if (e.key === 'Enter' && activeIndex >= 0) { e.preventDefault(); handleSelect(results[activeIndex]); }
  }

  const showFavorites = isOpen && !query && favorites.length > 0;
  const showHint = isOpen && !query && favorites.length === 0;

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {isOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(248,249,255,0.96)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          padding: 'env(safe-area-inset-top) 0 0',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Search input row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(0,0,0,0.06)', borderRadius: 12, padding: '10px 14px',
            }}>
              {isFetching ? (
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 18, color: '#717783' }}>autorenew</span>
              ) : (
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#717783' }}>search</span>
              )}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Stadt suchen…"
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  fontSize: 16, fontFamily: 'Inter', color: '#0b1c30',
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  aria-label="Suche löschen"
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 32, minHeight: 32, background: 'none', border: 'none', borderRadius: 6 }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#717783' }}>close</span>
                </button>
              )}
            </div>
            <button
              onClick={close}
              aria-label="Suche abbrechen"
              style={{ fontSize: 15, fontFamily: 'Inter', fontWeight: 500, color: '#0060ac', whiteSpace: 'nowrap', cursor: 'pointer', background: 'none', border: 'none', padding: '10px 0', minHeight: 44 }}
            >
              Abbrechen
            </button>
          </div>

          {/* Favorites list */}
          {showFavorites && (
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <p style={{ padding: '8px 16px 4px', fontFamily: 'Inter', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#717783' }}>
                Favoriten
              </p>
              {favorites.map((fav, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '4px 16px', borderBottom: '1px solid rgba(0,0,0,0.05)',
                  }}
                >
                  <button
                    onPointerDown={() => { close(); onSelectFavorite(fav); }}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 0', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
                    }}
                  >
                    <span className="material-symbols-outlined mat-fill" style={{ fontSize: 18, color: '#f59e0b', flexShrink: 0 }}>star</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontFamily: 'Inter', fontWeight: 500, color: '#0b1c30' }}>
                        {fav.city}
                      </div>
                      <div style={{ fontSize: 13, fontFamily: 'Inter', color: '#717783' }}>{fav.country}</div>
                    </div>
                  </button>
                  <button
                    onClick={() => onRemoveFavorite(fav)}
                    aria-label={`${fav.city} aus Favoriten entfernen`}
                    style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(0,0,0,0.05)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#717783' }}>delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Empty hint */}
          {showHint && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, opacity: 0.5, paddingBottom: 80 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#717783' }}>search</span>
              <p style={{ fontFamily: 'Inter', fontSize: 14, color: '#717783' }}>Stadt eingeben um zu suchen</p>
            </div>
          )}

          {/* Search results */}
          {query && (
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {results.map((loc, idx) => (
                <button
                  key={loc.id}
                  onMouseDown={() => handleSelect(loc)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 16px', textAlign: 'left',
                    background: idx === activeIndex ? 'rgba(0,96,172,0.06)' : 'transparent',
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#0060ac', flexShrink: 0 }}>
                    location_on
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontFamily: 'Inter', fontWeight: 500, color: '#0b1c30' }}>
                      {loc.name}{loc.admin1 ? `, ${loc.admin1}` : ''}
                    </div>
                    <div style={{ fontSize: 13, fontFamily: 'Inter', color: '#717783' }}>{loc.country}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Trigger buttons */}
      <div style={{ display: 'flex', gap: 4 }}>
        <button
          onClick={open}
          aria-label="Stadt suchen"
          style={{
            width: 44, height: 44, borderRadius: 22, border: 'none',
            background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: isDark ? 'rgba(255,255,255,0.9)' : '#414751' }}>search</span>
        </button>
        <button
          onClick={onGPS}
          disabled={isLoadingGPS}
          aria-label={isLoadingGPS ? 'Standort wird ermittelt' : 'Aktuellen Standort verwenden'}
          style={{
            width: 44, height: 44, borderRadius: 22, border: 'none',
            background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', opacity: isLoadingGPS ? 0.4 : 1,
          }}
        >
          {isLoadingGPS
            ? <span className="material-symbols-outlined animate-spin" style={{ fontSize: 18, color: isDark ? 'rgba(255,255,255,0.9)' : '#414751' }}>autorenew</span>
            : <span className="material-symbols-outlined" style={{ fontSize: 20, color: isDark ? 'rgba(255,255,255,0.9)' : '#414751' }}>my_location</span>
          }
        </button>
      </div>
    </div>
  );
}
