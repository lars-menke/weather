import { useState, useRef, useEffect, useCallback } from 'react';
import type { GeoLocation } from '../types/weather';
import { searchCities } from '../api/weather';

interface SearchBarProps {
  onSelect: (location: GeoLocation) => void;
  onGPS: () => void;
  isLoadingGPS: boolean;
}

export function SearchBar({ onSelect, onGPS, isLoadingGPS }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setIsOpen(false); return; }
    setIsSearching(true);
    try {
      const cities = await searchCities(q);
      setResults(cities);
      setIsOpen(cities.length > 0);
      setActiveIndex(-1);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => doSearch(query), 350);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [query, doSearch]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSelect(loc: GeoLocation) {
    setQuery('');
    setIsOpen(false);
    setResults([]);
    onSelect(loc);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, -1)); }
    else if (e.key === 'Enter' && activeIndex >= 0) { e.preventDefault(); handleSelect(results[activeIndex]); }
    else if (e.key === 'Escape') setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex gap-2">
        {/* Search input */}
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">
            {isSearching ? (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            placeholder="Stadt suchen…"
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-white placeholder-white/40 text-sm font-medium focus:outline-none transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.18)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            }}
            onFocusCapture={e => {
              (e.target as HTMLInputElement).style.background = 'rgba(255,255,255,0.18)';
            }}
            onBlurCapture={e => {
              (e.target as HTMLInputElement).style.background = 'rgba(255,255,255,0.12)';
            }}
          />
        </div>

        {/* GPS button */}
        <button
          onClick={onGPS}
          disabled={isLoadingGPS}
          title="Aktuellen Standort"
          className="flex items-center justify-center w-12 h-12 rounded-2xl text-white/80 hover:text-white transition-all duration-200 disabled:opacity-40 flex-shrink-0"
          style={{
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.18)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          }}
        >
          {isLoadingGPS ? (
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
          )}
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && results.length > 0 && (
        <div
          className="absolute top-full left-0 right-14 mt-2 z-50 rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(20,20,40,0.75)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
          }}
        >
          {results.map((loc, idx) => (
            <button
              key={loc.id}
              onMouseDown={() => handleSelect(loc)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors duration-100"
              style={{
                background: idx === activeIndex ? 'rgba(255,255,255,0.12)' : 'transparent',
                borderBottom: idx < results.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = idx === activeIndex ? 'rgba(255,255,255,0.12)' : 'transparent'; }}
            >
              <svg className="w-3.5 h-3.5 text-white/40 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <div className="min-w-0">
                <div className="text-white/90 text-sm font-medium truncate">
                  {loc.name}{loc.admin1 ? `, ${loc.admin1}` : ''}
                </div>
                <div className="text-white/40 text-xs">{loc.country}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
