import React, { useState, useMemo } from 'react';
import { RestArea, RestAreaType } from '../../types/toll';
import { REST_AREAS } from '../../data/restAreas';
import { 
  Coffee, 
  Zap, 
  Fuel, 
  Search, 
  Filter, 
  MapPin, 
  Check, 
  Utensils, 
  Sparkles,
  Building2,
  Wrench,
  Compass
} from 'lucide-react';

interface RestAreaListProps {
  routeRestAreas?: RestArea[];
  onViewOnMap?: (ra: RestArea) => void;
}

export const RestAreaList: React.FC<RestAreaListProps> = ({
  routeRestAreas = [],
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [filterSpkluOnly, setFilterSpkluOnly] = useState(false);
  const [filterSpbuOnly, setFilterSpbuOnly] = useState(false);
  const [filterRouteOnly, setFilterRouteOnly] = useState(false);

  const filteredRestAreas = useMemo(() => {
    let list = filterRouteOnly && routeRestAreas.length > 0 ? routeRestAreas : REST_AREAS;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (ra) =>
          ra.name.toLowerCase().includes(q) ||
          ra.roadName.toLowerCase().includes(q) ||
          ra.popularTenants?.some((t) => t.toLowerCase().includes(q)) ||
          ra.kmMarker.toString().includes(q)
      );
    }

    if (selectedType !== 'ALL') {
      list = list.filter((ra) => ra.type === selectedType);
    }

    if (filterSpkluOnly) {
      list = list.filter((ra) => ra.hasSpklu);
    }

    if (filterSpbuOnly) {
      list = list.filter((ra) => ra.hasSpbu);
    }

    return list;
  }, [searchTerm, selectedType, filterSpkluOnly, filterSpbuOnly, filterRouteOnly, routeRestAreas]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Coffee className="w-5 h-5 text-amber-400" />
              <span>Direktori Rest Area & SPKLU Jalan Tol</span>
            </h2>
            <p className="text-xs text-slate-400">
              Temukan tempat istirahat, SPBU, pengisian mobil listrik (SPKLU), dan kuliner
            </p>
          </div>

          {routeRestAreas.length > 0 && (
            <button
              onClick={() => setFilterRouteOnly(!filterRouteOnly)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterRouteOnly
                  ? 'bg-brand-500 text-white shadow-glow-emerald'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Rest Area Sepanjang Rute ({routeRestAreas.length})</span>
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari rest area (contoh: KM 57, Cipali, SPKLU, Starbucks, Brebes)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        </div>

        {/* Filters Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Type Filter */}
          <button
            onClick={() => setSelectedType('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              selectedType === 'ALL'
                ? 'bg-slate-200 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Semua Tipe
          </button>
          <button
            onClick={() => setSelectedType('TYPE_A')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              selectedType === 'TYPE_A'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Tipe A (Lengkap / SPBU / SPKLU)
          </button>
          <button
            onClick={() => setSelectedType('TYPE_B')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              selectedType === 'TYPE_B'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Tipe B (Sedang)
          </button>

          {/* SPKLU EV Toggle */}
          <button
            onClick={() => setFilterSpkluOnly(!filterSpkluOnly)}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              filterSpkluOnly
                ? 'bg-sky-500 text-white font-bold shadow-glow-blue'
                : 'bg-slate-900 text-sky-400 border border-slate-800 hover:border-sky-500/40'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Hanya SPKLU (EV)</span>
          </button>

          {/* SPBU Gas Station Toggle */}
          <button
            onClick={() => setFilterSpbuOnly(!filterSpbuOnly)}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              filterSpbuOnly
                ? 'bg-emerald-500 text-white font-bold shadow-glow-emerald'
                : 'bg-slate-900 text-emerald-400 border border-slate-800 hover:border-emerald-500/40'
            }`}
          >
            <Fuel className="w-3.5 h-3.5" />
            <span>Hanya SPBU</span>
          </button>
        </div>
      </div>

      {/* Rest Area Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRestAreas.map((ra) => {
          const isOnCurrentRoute = routeRestAreas.some((r) => r.id === ra.id);

          return (
            <div
              key={ra.id}
              className={`glass-panel p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between hover:border-slate-600 ${
                isOnCurrentRoute ? 'border-brand-500/50 bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950/20' : 'border-slate-800/80'
              }`}
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {ra.type.replace('_', ' ')} • Arah {ra.direction}
                  </span>
                  {isOnCurrentRoute && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                      Di Rute Anda
                    </span>
                  )}
                </div>

                {/* Name & Location */}
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white leading-snug">{ra.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{ra.roadName} • KM {ra.kmMarker}</span>
                  </p>
                </div>

                {/* Facility Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {ra.hasSpklu && (
                    <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      <Zap className="w-3 h-3 text-sky-400" />
                      <span>SPKLU EV Fast</span>
                    </span>
                  )}
                  {ra.hasSpbu && (
                    <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <Fuel className="w-3 h-3 text-emerald-400" />
                      <span>SPBU 24 Jam</span>
                    </span>
                  )}
                  {ra.hasMasjid && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                      🕌 Masjid
                    </span>
                  )}
                  {ra.hasFoodCourt && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                      🍴 Food Court
                    </span>
                  )}
                  {ra.hasAtm && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                      🏧 ATM Center
                    </span>
                  )}
                  {ra.hasWorkshop && (
                    <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                      <Wrench className="w-3 h-3 text-amber-400" />
                      <span>Bengkel</span>
                    </span>
                  )}
                </div>

                {/* Tenants & Notes */}
                {ra.popularTenants && ra.popularTenants.length > 0 && (
                  <div className="text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
                    <span className="text-slate-300 font-semibold text-[11px]">Tenan Populer: </span>
                    <span className="text-[11px]">{ra.popularTenants.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Fuel types info */}
              {ra.fuelTypes && (
                <div className="mt-3 pt-2.5 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>BBM: {ra.fuelTypes.slice(0, 3).join(', ')}</span>
                  <span className="text-brand-400 font-semibold">Buka 24 Jam</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
