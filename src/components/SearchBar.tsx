import { useState, useRef, useEffect, useCallback } from 'react';
import type { GeoLocation } from '../types/weather';
import { searchCities } from '../api/weather';

interface SearchBarProps {
  cityName: string;
  onSelect: (location: GeoLocation) => void;
  onGPS: () => void;
  isLoadingGPS: boolean;
}

export function SearchBar({ cityName, onSelect, onGPS, isLoadingGPS }: SearchBarProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setIsOpen(false); return; }
    setIsFetching(true);
    try {
      const cities = await searchCities(q);
      setResults(cities);
      setIsOpen(cities.length > 0);
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
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeSearch();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function openSearch() {
    setIsSearching(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function closeSearch() {
    setIsSearching(false);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  }

  function handleSelect(loc: GeoLocation) {
    closeSearch();
    onSelect(loc);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { closeSearch(); return; }
    if (!isOpen) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, -1)); }
    else if (e.key === 'Enter' && activeIndex >= 0) { e.preventDefault(); handleSelect(results[activeIndex]); }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {isSearching ? (
        /* Search mode */
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 rounded-full px-4 py-2.5" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)' }}>
            {isFetching ? (
              <span className="material-symbols-outlined text-[18px] animate-spin" style={{ color: '#717783' }}>autorenew</span>
            ) : (
              <span className="material-symbols-outlined text-[18px]" style={{ color: '#717783' }}>search</span>
            )}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Stadt suchen…"
              className="flex-1 bg-transparent outline-none text-sm font-['Inter']"
              style={{ color: '#0b1c30' }}
            />
          </div>
          <button
            onClick={closeSearch}
            className="text-sm font-['Inter'] font-medium px-3 py-2 rounded-full transition-colors hover:bg-white/30"
            style={{ color: '#0060ac' }}
          >
            Abbrechen
          </button>
        </div>
      ) : (
        /* Normal header mode */
        <div className="flex items-center justify-between">
          <button
            onClick={openSearch}
            className="flex items-center justify-center w-10 h-10 rounded-full transition-colors hover:bg-white/30 active:scale-95"
            style={{ color: '#0060ac' }}
          >
            <span className="material-symbols-outlined">search</span>
          </button>

          <h1 className="text-xl font-['Outfit'] font-medium" style={{ color: '#0b1c30' }}>
            {cityName}
          </h1>

          <button
            onClick={onGPS}
            disabled={isLoadingGPS}
            className="flex items-center justify-center w-10 h-10 rounded-full transition-all hover:bg-white/30 active:scale-95 disabled:opacity-40"
            style={{ color: '#0060ac' }}
          >
            {isLoadingGPS ? (
              <span className="material-symbols-outlined animate-spin text-[20px]">autorenew</span>
            ) : (
              <span className="material-symbols-outlined">location_on</span>
            )}
          </button>
        </div>
      )}

      {/* Dropdown */}
      {isOpen && results.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(248,249,255,0.92)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.8)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}
        >
          {results.map((loc, idx) => (
            <button
              key={loc.id}
              onMouseDown={() => handleSelect(loc)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors"
              style={{
                background: idx === activeIndex ? 'rgba(0,96,172,0.07)' : 'transparent',
                borderBottom: idx < results.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,96,172,0.05)')}
              onMouseLeave={e => (e.currentTarget.style.background = idx === activeIndex ? 'rgba(0,96,172,0.07)' : 'transparent')}
            >
              <span className="material-symbols-outlined text-[18px] flex-shrink-0" style={{ color: '#0060ac' }}>
                location_on
              </span>
              <div className="min-w-0">
                <div className="text-sm font-['Inter'] font-medium truncate" style={{ color: '#0b1c30' }}>
                  {loc.name}{loc.admin1 ? `, ${loc.admin1}` : ''}
                </div>
                <div className="text-xs font-['Inter']" style={{ color: '#414751', opacity: 0.65 }}>
                  {loc.country}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
