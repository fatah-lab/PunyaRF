import React, { useState, useMemo } from 'react';
import { 
  TollGate, 
  VehicleClassId, 
  CalculationResult, 
  NetworkRegion 
} from '../../types/toll';
import { TOLL_GATES, TOLL_ROADS, TOLL_NETWORKS } from '../../data/tollRoads';
import { VehicleSelector } from './VehicleSelector';
import { 
  ArrowUpDown, 
  Plus, 
  Trash2, 
  MapPin, 
  Flag, 
  Sparkles, 
  Route, 
  Search,
  CheckCircle2,
  Navigation
} from 'lucide-react';

interface FareCalculatorProps {
  onCalculate: (originId: string, destId: string, waypointIds: string[], vehicleClass: VehicleClassId) => void;
  calculationResult: CalculationResult | null;
  onViewMap: () => void;
}

export const FareCalculator: React.FC<FareCalculatorProps> = ({
  onCalculate,
  onViewMap,
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkRegion | 'all'>('all');
  const [originId, setOriginId] = useState<string>('gt_halim');
  const [destId, setDestId] = useState<string>('gt_warugunung');
  const [waypoints, setWaypoints] = useState<string[]>([]);
  const [vehicleClass, setVehicleClass] = useState<VehicleClassId>('GOL_1');

  // Filter gates by network if selected
  const availableGates = useMemo(() => {
    if (selectedNetwork === 'all') return TOLL_GATES;
    const roadIdsInNetwork = TOLL_ROADS.filter((r) => r.networkId === selectedNetwork).map((r) => r.id);
    return TOLL_GATES.filter((g) => roadIdsInNetwork.includes(g.roadId));
  }, [selectedNetwork]);

  // Handle calculation
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!originId || !destId || originId === destId) return;
    onCalculate(originId, destId, waypoints, vehicleClass);
  };

  // Swap Origin and Destination
  const handleSwap = () => {
    const temp = originId;
    setOriginId(destId);
    setDestId(temp);
    setWaypoints([...waypoints].reverse());
    onCalculate(destId, temp, [...waypoints].reverse(), vehicleClass);
  };

  // Waypoints management
  const addWaypoint = () => {
    if (waypoints.length >= 3) return;
    // pick a middle gate as default
    const defaultWaypoint = TOLL_GATES.find((g) => g.id === 'gt_kalikangkung')?.id || availableGates[0].id;
    setWaypoints([...waypoints, defaultWaypoint]);
  };

  const updateWaypoint = (index: number, val: string) => {
    const updated = [...waypoints];
    updated[index] = val;
    setWaypoints(updated);
  };

  const removeWaypoint = (index: number) => {
    setWaypoints(waypoints.filter((_, i) => i !== index));
  };

  // Preset Routes
  const PRESET_ROUTES = [
    { label: 'Jakarta → Surabaya (Trans-Jawa)', origin: 'gt_halim', dest: 'gt_warugunung', waypoints: [] },
    { label: 'Jakarta → Bandung (Pasteur)', origin: 'gt_cikampek_utama', dest: 'gt_pasteur', waypoints: [] },
    { label: 'Jakarta → Semarang (Kalikangkung)', origin: 'gt_halim', dest: 'gt_kalikangkung', waypoints: [] },
    { label: 'Jakarta → Solo (Colomadu)', origin: 'gt_halim', dest: 'gt_colomadu', waypoints: [] },
    { label: 'Bakauheni → Palembang (Sumatera)', origin: 'gt_bakauheni_selatan', dest: 'gt_kramasan', waypoints: [] },
    { label: 'Nusa Dua → Benoa (Bali Mandara)', origin: 'gt_nusa_dua', dest: 'gt_benoa', waypoints: [] },
  ];

  const applyPreset = (preset: typeof PRESET_ROUTES[0]) => {
    setOriginId(preset.origin);
    setDestId(preset.dest);
    setWaypoints(preset.waypoints);
    onCalculate(preset.origin, preset.dest, preset.waypoints, vehicleClass);
  };

  return (
    <div className="space-y-6">
      {/* Network Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedNetwork('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
            selectedNetwork === 'all'
              ? 'bg-brand-500 text-white shadow-glow-emerald'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Semua Wilayah Tol
        </button>
        {TOLL_NETWORKS.map((net) => (
          <button
            key={net.id}
            type="button"
            onClick={() => setSelectedNetwork(net.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              selectedNetwork === net.id
                ? 'bg-brand-500 text-white shadow-glow-emerald'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {net.name}
          </button>
        ))}
      </div>

      {/* Calculator Card */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-brand-500/20 text-brand-400">
              <Route className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Rute Perjalanan & Gerbang Tol</h2>
              <p className="text-xs text-slate-400">Pilih titik asal dan tujuan untuk kalkulasi otomatis</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSwap}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700 transition"
            title="Tukar Gerbang Asal & Tujuan"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-brand-400" />
            <span className="hidden sm:inline">Tukar Arah</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Origin Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Gerbang Masuk Tol (Asal)</span>
            </label>
            <div className="relative">
              <select
                value={originId}
                onChange={(e) => {
                  setOriginId(e.target.value);
                  onCalculate(e.target.value, destId, waypoints, vehicleClass);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 font-medium focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition appearance-none cursor-pointer"
              >
                {availableGates.map((gate) => {
                  const road = TOLL_ROADS.find((r) => r.id === gate.roadId);
                  return (
                    <option key={`orig-${gate.id}`} value={gate.id} className="bg-slate-900 py-2">
                      {gate.name} ({gate.city}) — {road?.name || 'Tol'} [KM {gate.kmMarker}]
                    </option>
                  );
                })}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Waypoints (Intermediate Stops) */}
          {waypoints.map((wpId, idx) => (
            <div key={`wp-${idx}`} className="flex items-center gap-2 pl-4 border-l-2 border-brand-500/40">
              <div className="flex-1 space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-sky-400" />
                  <span>Titik Singgah {idx + 1}</span>
                </label>
                <select
                  value={wpId}
                  onChange={(e) => {
                    updateWaypoint(idx, e.target.value);
                  }}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                >
                  {availableGates.map((gate) => (
                    <option key={`wp-opt-${gate.id}`} value={gate.id}>
                      {gate.name} ({gate.city})
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => removeWaypoint(idx)}
                className="mt-4 p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 border border-rose-500/20"
                title="Hapus titik singgah"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Add Stop Button */}
          {waypoints.length < 3 && (
            <div className="flex justify-start">
              <button
                type="button"
                onClick={addWaypoint}
                className="flex items-center space-x-1.5 text-xs font-medium text-slate-400 hover:text-brand-400 hover:bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-dashed border-slate-700 transition"
              >
                <Plus className="w-3.5 h-3.5 text-brand-400" />
                <span>Tambah Titik Singgah (Via / Transit)</span>
              </button>
            </div>
          )}

          {/* Destination Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Flag className="w-4 h-4 text-rose-400" />
              <span>Gerbang Keluar Tol (Tujuan)</span>
            </label>
            <div className="relative">
              <select
                value={destId}
                onChange={(e) => {
                  setDestId(e.target.value);
                  onCalculate(originId, e.target.value, waypoints, vehicleClass);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 font-medium focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition appearance-none cursor-pointer"
              >
                {availableGates.map((gate) => {
                  const road = TOLL_ROADS.find((r) => r.id === gate.roadId);
                  return (
                    <option key={`dest-${gate.id}`} value={gate.id} className="bg-slate-900 py-2">
                      {gate.name} ({gate.city}) — {road?.name || 'Tol'} [KM {gate.kmMarker}]
                    </option>
                  );
                })}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Vehicle Class Selector Component */}
          <div className="pt-2">
            <VehicleSelector
              selectedClass={vehicleClass}
              onSelectClass={(vcId) => {
                setVehicleClass(vcId);
                onCalculate(originId, destId, waypoints, vcId);
              }}
            />
          </div>

          {/* Calculation Action Buttons */}
          <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-white shadow-glow-emerald transition duration-200"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Hitung Ulang Tarif</span>
            </button>

            <button
              type="button"
              onClick={onViewMap}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-brand-300 border border-slate-700 transition duration-200"
            >
              <MapPin className="w-4 h-4 text-brand-400" />
              <span>Buka di Peta Interaktif</span>
            </button>
          </div>
        </form>

        {/* Quick Route Presets */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Rute Populer Cepat:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_ROUTES.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p)}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-brand-500/20 hover:text-brand-300 text-slate-300 border border-slate-800 hover:border-brand-500/30 transition"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
