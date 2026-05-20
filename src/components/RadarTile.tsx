import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface RainViewerFrame { time: number; path: string; }

interface Props {
  lat: number;
  lon: number;
  isDark?: boolean;
  onExpand: () => void;
}

export default function RadarTile({ lat, lon, isDark = false, onExpand }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<L.TileLayer[]>([]);
  const [frames, setFrames] = useState<{ path: string; time: number; host: string }[]>([]);
  const [frameIndex, setFrameIndex] = useState(0);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [lat, lon],
      zoom: 7,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      keyboard: false,
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);
    L.circle([lat, lon], { radius: 1500, color: '#0060ac', fillColor: '#0060ac', fillOpacity: 0.9, weight: 0 }).addTo(map);

    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then(r => r.json())
      .then((data: { host: string; radar: { past: RainViewerFrame[]; nowcast?: RainViewerFrame[] } }) => {
        const allFrames = (data.radar.past ?? []).slice(-8).map(f => ({ path: f.path, time: f.time, host: data.host }));
        if (allFrames.length === 0) { setStatus('error'); return; }
        const layers = allFrames.map(f =>
          L.tileLayer(`${f.host}${f.path}/256/{z}/{x}/{y}/2/1_1.png`, { opacity: 0, maxZoom: 18 }).addTo(map)
        );
        layersRef.current = layers;
        setFrames(allFrames);
        setFrameIndex(allFrames.length - 1);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));

    return () => { map.remove(); mapRef.current = null; layersRef.current = []; };
  }, [lat, lon]);

  useEffect(() => {
    layersRef.current.forEach((layer, i) => layer.setOpacity(i === frameIndex ? 0.55 : 0));
  }, [frameIndex]);

  const advance = useCallback(() => setFrameIndex(i => (i + 1) % Math.max(layersRef.current.length, 1)), []);

  useEffect(() => {
    if (!playing || frames.length === 0) return;
    const id = setInterval(advance, 700);
    return () => clearInterval(id);
  }, [playing, frames.length, advance]);

  const currentFrame = frames[frameIndex];
  const timeStr = currentFrame
    ? new Date(currentFrame.time * 1000).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
    : '';

  const badgeBg = 'rgba(11,28,48,0.78)';

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 16, height: 220 }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Header: label + expand */}
      <div style={{ position: 'absolute', top: 10, left: 12, right: 12, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'space-between', pointerEvents: 'none' }}>
        <div style={{ background: badgeBg, backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderRadius: 12, padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#fff', lineHeight: 1 }}>radar</span>
          <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: '#fff', letterSpacing: '0.02em' }}>
            Radar{timeStr ? ` · ${timeStr} Uhr` : ''}
          </span>
        </div>
        <button
          onClick={onExpand}
          aria-label="Radar vergrößern"
          style={{ pointerEvents: 'auto', background: badgeBg, backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: 'none', borderRadius: 12, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 17, color: '#fff' }}>open_in_full</span>
        </button>
      </div>

      {/* Play / Pause */}
      {status === 'ready' && (
        <button
          onClick={() => setPlaying(p => !p)}
          aria-label={playing ? 'Pause' : 'Abspielen'}
          style={{ position: 'absolute', bottom: 10, right: 12, zIndex: 1000, background: badgeBg, backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: 'none', borderRadius: 20, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#fff' }}>{playing ? 'pause' : 'play_arrow'}</span>
        </button>
      )}

      {/* Loading / error */}
      {status !== 'ready' && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? 'rgba(11,28,48,0.35)' : 'rgba(255,255,255,0.3)' }}>
          <span style={{ fontFamily: 'Inter', fontSize: 13, color: isDark ? 'rgba(255,255,255,0.8)' : '#0b1c30' }}>
            {status === 'loading' ? 'Wird geladen…' : 'Keine Radardaten'}
          </span>
        </div>
      )}
    </div>
  );
}
