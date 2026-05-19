import { useEffect, useRef, useState } from 'react';
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
  radar: { past: RainViewerFrame[] };
}

export default function RadarScreen({ lat, lon }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [radarTime, setRadarTime] = useState('');
  const [noRadar, setNoRadar] = useState(false);

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
      attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Current location pulse
    L.circle([lat, lon], {
      radius: 6000,
      color: '#0060ac',
      fillColor: '#0060ac',
      fillOpacity: 0.25,
      weight: 2,
    }).addTo(map);
    L.circle([lat, lon], {
      radius: 1500,
      color: '#0060ac',
      fillColor: '#0060ac',
      fillOpacity: 0.8,
      weight: 0,
    }).addTo(map);

    // RainViewer radar overlay
    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then(r => r.json())
      .then((data: RainViewerData) => {
        const frames = data.radar?.past ?? [];
        if (frames.length === 0) { setNoRadar(true); return; }
        const latest = frames[frames.length - 1];
        const tileUrl = `${data.host}${latest.path}/256/{z}/{x}/{y}/2/1_1.png`;
        L.tileLayer(tileUrl, {
          opacity: 0.55,
          maxZoom: 18,
          attribution: '© <a href="https://rainviewer.com">RainViewer</a>',
        }).addTo(map);
        const ts = new Date(latest.time * 1000);
        setRadarTime(ts.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));
      })
      .catch(() => setNoRadar(true));

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [lat, lon]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Radar timestamp badge */}
      {radarTime && (
        <div style={{
          position: 'absolute',
          top: 'calc(env(safe-area-inset-top) + 16px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(11,28,48,0.72)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: 20,
          padding: '6px 16px',
          fontFamily: 'Inter',
          fontSize: 13,
          fontWeight: 500,
          color: '#fff',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle', marginRight: 6 }}>radar</span>
          Radar · {radarTime} Uhr
        </div>
      )}

      {noRadar && (
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
