import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Props {
  lat: number;
  lon: number;
}

interface RainViewerFrame {
  time: number;
  path: string;
}

interface RainViewerData {
  host: string;
  radar: { past: RainViewerFrame[]; nowcast?: RainViewerFrame[] };
}

export default function RadarScreen({ lat, lon }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<L.TileLayer[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const [frames, setFrames] = useState<{ path: string; time: number; host: string }[]>([]);
  const [frameIndex, setFrameIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [loaded, setLoaded] = useState(false);

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [lat, lon],
      zoom: 7,
      zoomControl: false,
      attributionControl: true,
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://openstreetmap.org">OSM</a> | © <a href="https://rainviewer.com">RainViewer</a>',
      maxZoom: 18,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Location marker
    L.circle([lat, lon], { radius: 5000, color: '#0060ac', fillColor: '#0060ac', fillOpacity: 0.25, weight: 2 }).addTo(map);
    L.circle([lat, lon], { radius: 1200, color: '#0060ac', fillColor: '#0060ac', fillOpacity: 0.9, weight: 0 }).addTo(map);

    // Fetch RainViewer frames
    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then(r => r.json())
      .then((data: RainViewerData) => {
        const allFrames = [
          ...(data.radar.past ?? []),
          ...(data.radar.nowcast ?? []),
        ].map(f => ({ path: f.path, time: f.time, host: data.host }));

        if (allFrames.length === 0) return;

        // Pre-create one tile layer per frame, all hidden
        const layers = allFrames.map(f =>
          L.tileLayer(`${f.host}${f.path}/256/{z}/{x}/{y}/2/1_1.png`, {
            opacity: 0,
            maxZoom: 18,
          }).addTo(map)
        );
        layersRef.current = layers;
        setFrames(allFrames);
        setFrameIndex(allFrames.length - 1);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      map.remove();
      mapRef.current = null;
      layersRef.current = [];
    };
  }, [lat, lon]);

  // Show only the active frame
  useEffect(() => {
    layersRef.current.forEach((layer, i) => {
      layer.setOpacity(i === frameIndex ? 0.55 : 0);
    });
  }, [frameIndex]);

  // Auto-play
  const advance = useCallback(() => {
    setFrameIndex(i => (i + 1) % Math.max(layersRef.current.length, 1));
  }, []);

  useEffect(() => {
    if (!playing || frames.length === 0) return;
    const id = setInterval(advance, 600);
    return () => clearInterval(id);
  }, [playing, frames.length, advance]);

  const currentFrame = frames[frameIndex];
  const frameDate = currentFrame ? new Date(currentFrame.time * 1000) : null;
  const dateLabel = frameDate
    ? frameDate.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' })
    : '';
  const timeLabel = frameDate
    ? frameDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
    : '';
  const isPast = currentFrame && currentFrame.time * 1000 < Date.now();

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Timestamp badge — always rendered once loaded, zIndex above Leaflet panes */}
      {loaded && frames.length > 0 && (
        <div style={{
          position: 'absolute',
          top: 'calc(env(safe-area-inset-top) + 16px)',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'rgba(11,28,48,0.80)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: 20,
          padding: '7px 16px',
          fontFamily: 'Inter',
          fontSize: 13,
          fontWeight: 500,
          color: '#fff',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: 7,
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 15, lineHeight: 1 }}>radar</span>
          {dateLabel && timeLabel ? (
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>
              {dateLabel} · {timeLabel} Uhr
            </span>
          ) : (
            <span>Wird geladen…</span>
          )}
          {!isPast && timeLabel && (
            <span style={{ fontSize: 11, opacity: 0.7, background: 'rgba(255,255,255,0.15)', borderRadius: 6, padding: '2px 6px' }}>
              Prognose
            </span>
          )}
        </div>
      )}

      {/* Play/Pause + scrubber */}
      {loaded && frames.length > 0 && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(env(safe-area-inset-bottom) + 80px)',
          left: 16,
          right: 16,
          zIndex: 1000,
          background: 'rgba(11,28,48,0.80)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: 16,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <button
            onClick={() => setPlaying(p => !p)}
            aria-label={playing ? 'Pause' : 'Abspielen'}
            style={{
              width: 36, height: 36, borderRadius: 18,
              background: 'rgba(255,255,255,0.15)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#fff' }}>
              {playing ? 'pause' : 'play_arrow'}
            </span>
          </button>

          {/* Frame dots */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 3, overflowX: 'hidden' }}>
            {frames.map((_, i) => (
              <button
                key={i}
                onClick={() => { setPlaying(false); setFrameIndex(i); }}
                aria-label={`Frame ${i + 1}`}
                style={{
                  flex: 1, height: i === frameIndex ? 6 : 3, borderRadius: 9999,
                  background: i === frameIndex ? '#fff' : 'rgba(255,255,255,0.35)',
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'height 0.15s, background 0.15s',
                  minWidth: 0,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {loaded && frames.length === 0 && (
        <div style={{
          position: 'absolute',
          top: 'calc(env(safe-area-inset-top) + 16px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: 12,
          padding: '8px 16px',
          fontFamily: 'Inter',
          fontSize: 13,
          color: '#717783',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}>
          Keine Radardaten verfügbar
        </div>
      )}
    </div>
  );
}
