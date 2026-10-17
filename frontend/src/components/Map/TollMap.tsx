import React, { useEffect, useRef, useState } from 'react';
import { CalculationResult, TollGate, RestArea } from '../../types/toll';
import { TOLL_GATES } from '../../data/tollRoads';
import { REST_AREAS } from '../../data/restAreas';
import L from 'leaflet';
import { 
  Maximize2, 
  RotateCcw, 
  Coffee, 
  MapPin, 
  Layers, 
  Zap, 
  Fuel, 
  Utensils 
} from 'lucide-react';

interface TollMapProps {
  calculationResult: CalculationResult | null;
  onSelectOrigin?: (gateId: string) => void;
  onSelectDestination?: (gateId: string) => void;
}

export const TollMap: React.FC<TollMapProps> = ({
  calculationResult,
  onSelectOrigin,
  onSelectDestination,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [showRestAreas, setShowRestAreas] = useState(true);
  const [showAllGates, setShowAllGates] = useState(true);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centered around Java Island by default
    const map = L.map(mapContainerRef.current, {
      center: [-6.9, 109.8],
      zoom: 7,
      zoomControl: false,
    });

    // 100% Free Esri World Street Map Public Tiles (Zero 403 blocks, No API Key required)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri, HERE, Garmin, OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Zoom control top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers, Route Polyline & Rest Areas
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Draw Route: Fetch driving route from OSRM API following actual highways
    let isCancelled = false;

    async function drawDrivingRoute() {
      if (!calculationResult || calculationResult.polylineCoords.length < 2) return;

      try {
        // Format coordinates as longitude,latitude;longitude,latitude... for OSRM
        const formattedCoords = calculationResult.polylineCoords
          .map(([lat, lng]) => `${lng},${lat}`)
          .join(';');

        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${formattedCoords}?overview=full&geometries=geojson`;
        const res = await fetch(osrmUrl);
        
        if (!res.ok) {
          throw new Error(`OSRM HTTP error: ${res.status}`);
        }

        const data = await res.json();
        if (data.code !== 'Ok' || !data.routes || !data.routes[0]) {
          throw new Error(`OSRM route calculation error: ${data.code || 'No route'}`);
        }

        if (isCancelled || !layerGroup || !map) return;

        const routeGeometry = data.routes[0].geometry;

        // Render glow backdrop GeoJSON layer
        L.geoJSON(routeGeometry, {
          style: {
            color: '#34d399',
            weight: 9,
            opacity: 0.25,
            lineCap: 'round',
          },
        }).addTo(layerGroup);

        // Render main driving route GeoJSON layer (smooth green road line)
        const geoJsonLayer = L.geoJSON(routeGeometry, {
          style: {
            color: '#10b981',
            weight: 5,
            opacity: 0.9,
            lineCap: 'round',
            lineJoin: 'round',
          },
        }).addTo(layerGroup);

        // Fit map viewport to the real highway path
        map.fitBounds(geoJsonLayer.getBounds(), { padding: [40, 40] });
        return;
      } catch (err) {
        console.error('OSRM routing request failed, falling back to straight polyline:', err);
      }

      // Fallback to straight polyline if OSRM is unreachable or rate-limited
      if (!isCancelled && layerGroup && map && calculationResult.polylineCoords.length > 0) {
        L.polyline(calculationResult.polylineCoords, {
          color: '#34d399',
          weight: 9,
          opacity: 0.25,
          lineCap: 'round',
        }).addTo(layerGroup);

        const fallbackLine = L.polyline(calculationResult.polylineCoords, {
          color: '#10b981',
          weight: 5,
          opacity: 0.85,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(layerGroup);

        map.fitBounds(fallbackLine.getBounds(), { padding: [40, 40] });
      }
    }

    drawDrivingRoute();

    // Custom Icon Creators
    const createCustomIcon = (bgColor: string, iconHtml: string, size = 28) => {
      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background: ${bgColor};
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #ffffff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.6);
            color: #ffffff;
          ">
            ${iconHtml}
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2],
      });
    };

    const originIcon = createCustomIcon('#10b981', '🚩', 32);
    const destIcon = createCustomIcon('#ef4444', '🏁', 32);
    const waypointIcon = createCustomIcon('#0284c7', '📍', 26);
    const gateIcon = createCustomIcon('#475569', '🏛️', 20);
    const restAreaIcon = createCustomIcon('#f59e0b', '☕', 24);

    // 2. Add All Gates (if enabled)
    if (showAllGates) {
      TOLL_GATES.forEach((gate) => {
        // Skip if it's origin or dest (we render them prominently below)
        if (
          calculationResult &&
          (gate.id === calculationResult.originGate.id ||
            gate.id === calculationResult.destinationGate.id ||
            calculationResult.waypoints.some((w) => w.id === gate.id))
        ) {
          return;
        }

        const marker = L.marker([gate.latitude, gate.longitude], { icon: gateIcon });
        marker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px;">
            <div style="font-weight: 700; color: #f1f5f9; font-size: 13px;">${gate.name}</div>
            <div style="color: #94a3b8; font-size: 11px; margin-bottom: 8px;">KM ${gate.kmMarker} • ${gate.city}</div>
            <div style="display: flex; gap: 4px; margin-top: 6px;">
              <button id="btn-orig-${gate.id}" style="background: #10b981; color: #fff; border: none; border-radius: 6px; padding: 4px 8px; font-size: 10px; font-weight: 600; cursor: pointer;">Jadikan Asal</button>
              <button id="btn-dest-${gate.id}" style="background: #ef4444; color: #fff; border: none; border-radius: 6px; padding: 4px 8px; font-size: 10px; font-weight: 600; cursor: pointer;">Jadikan Tujuan</button>
            </div>
          </div>
        `);

        marker.on('popupopen', () => {
          const btnOrig = document.getElementById(`btn-orig-${gate.id}`);
          const btnDest = document.getElementById(`btn-dest-${gate.id}`);
          if (btnOrig && onSelectOrigin) {
            btnOrig.onclick = () => onSelectOrigin(gate.id);
          }
          if (btnDest && onSelectDestination) {
            btnDest.onclick = () => onSelectDestination(gate.id);
          }
        });

        marker.addTo(layerGroup);
      });
    }

    // 3. Highlight Calculated Origin, Waypoints & Destination
    if (calculationResult) {
      // Origin Marker
      const origMarker = L.marker(
        [calculationResult.originGate.latitude, calculationResult.originGate.longitude],
        { icon: originIcon }
      ).addTo(layerGroup);
      origMarker.bindPopup(`
        <div style="font-size: 12px;">
          <div style="color: #34d399; font-weight: 800; text-transform: uppercase; font-size: 10px;">TITIK AWAL (ASAL)</div>
          <div style="font-weight: 700; color: #fff; font-size: 14px;">${calculationResult.originGate.name}</div>
          <div style="color: #94a3b8; font-size: 11px;">KM ${calculationResult.originGate.kmMarker} • ${calculationResult.originGate.city}</div>
        </div>
      `);

      // Waypoints
      calculationResult.waypoints.forEach((wp, idx) => {
        const wpMarker = L.marker([wp.latitude, wp.longitude], { icon: waypointIcon }).addTo(layerGroup);
        wpMarker.bindPopup(`
          <div style="font-size: 12px;">
            <div style="color: #38bdf8; font-weight: 800; text-transform: uppercase; font-size: 10px;">TITIK SINGGAH #${idx + 1}</div>
            <div style="font-weight: 700; color: #fff; font-size: 13px;">${wp.name}</div>
            <div style="color: #94a3b8; font-size: 11px;">KM ${wp.kmMarker} • ${wp.city}</div>
          </div>
        `);
      });

      // Destination Marker
      const destMarker = L.marker(
        [calculationResult.destinationGate.latitude, calculationResult.destinationGate.longitude],
        { icon: destIcon }
      ).addTo(layerGroup);
      destMarker.bindPopup(`
        <div style="font-size: 12px;">
          <div style="color: #f87171; font-weight: 800; text-transform: uppercase; font-size: 10px;">TITIK AKHIR (TUJUAN)</div>
          <div style="font-weight: 700; color: #fff; font-size: 14px;">${calculationResult.destinationGate.name}</div>
          <div style="color: #94a3b8; font-size: 11px;">KM ${calculationResult.destinationGate.kmMarker} • ${calculationResult.destinationGate.city}</div>
        </div>
      `);
    }

    // 4. Add Rest Area Markers
    if (showRestAreas) {
      REST_AREAS.forEach((ra) => {
        const marker = L.marker([ra.latitude, ra.longitude], { icon: restAreaIcon });
        const spkluBadge = ra.hasSpklu ? '<span style="background:#0284c7;color:#fff;padding:2px 5px;border-radius:4px;font-size:9px;font-weight:700;">⚡ SPKLU Fast</span>' : '';
        const spbuBadge = ra.hasSpbu ? '<span style="background:#10b981;color:#fff;padding:2px 5px;border-radius:4px;font-size:9px;font-weight:700;">⛽ SPBU</span>' : '';

        marker.bindPopup(`
          <div style="font-size: 12px; min-width: 180px;">
            <div style="color: #fbbf24; font-weight: 800; text-transform: uppercase; font-size: 10px;">${ra.type.replace('_', ' ')} (Arah ${ra.direction})</div>
            <div style="font-weight: 700; color: #fff; font-size: 13px; margin-bottom: 3px;">${ra.name}</div>
            <div style="display: flex; gap: 4px; margin-bottom: 6px; flex-wrap: wrap;">
              ${spkluBadge}
              ${spbuBadge}
            </div>
            <div style="color: #cbd5e1; font-size: 11px; border-top: 1px solid #334155; padding-top: 4px;">
              ${ra.popularTenants?.slice(0, 3).join(', ') || ra.notes || ''}
            </div>
          </div>
        `);
        marker.addTo(layerGroup);
      });
    }
  }, [calculationResult, showRestAreas, showAllGates, onSelectOrigin, onSelectDestination]);

  // Recenter Map
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    if (calculationResult && calculationResult.polylineCoords.length > 0) {
      const bounds = L.latLngBounds(calculationResult.polylineCoords);
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
    } else {
      mapInstanceRef.current.setView([-6.9, 109.8], 7);
    }
  };

  return (
    <div className="relative w-full h-[520px] sm:h-[620px] rounded-2xl overflow-hidden glass-panel border-slate-800 shadow-2xl">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Controls Overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="glass-panel p-2 rounded-xl flex items-center gap-1.5 shadow-lg bg-slate-950/80 backdrop-blur-md">
          <button
            onClick={() => setShowRestAreas(!showRestAreas)}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              showRestAreas
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Rest Area ({REST_AREAS.length})</span>
          </button>

          <button
            onClick={() => setShowAllGates(!showAllGates)}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              showAllGates
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Gerbang Tol ({TOLL_GATES.length})</span>
          </button>
        </div>
      </div>

      {/* Top Right Controls */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={handleRecenter}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 shadow-xl backdrop-blur-md transition"
          title="Pusatkan Peta ke Rute"
        >
          <RotateCcw className="w-3.5 h-3.5 text-brand-400" />
          <span>Pusatkan Rute</span>
        </button>
      </div>

      {/* Legend Badge */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-[11px] text-slate-300 shadow-lg">
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
          <span>Asal</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
          <span>Tujuan</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
          <span>Rest Area</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
          <span>SPKLU EV</span>
        </div>
      </div>
    </div>
  );
};
