import React from 'react';
import { VehicleClassId } from '../../types/toll';
import { VEHICLE_CLASSES } from '../../data/tollRoads';
import { Car, Truck, Bike, Info } from 'lucide-react';

interface VehicleSelectorProps {
  selectedClass: VehicleClassId;
  onSelectClass: (id: VehicleClassId) => void;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  selectedClass,
  onSelectClass,
}) => {
  const getIcon = (id: VehicleClassId) => {
    switch (id) {
      case 'GOL_1':
        return <Car className="w-5 h-5" />;
      case 'GOL_6':
        return <Bike className="w-5 h-5" />;
      default:
        return <Truck className="w-5 h-5" />;
    }
  };

  const currentClassInfo = VEHICLE_CLASSES.find((v) => v.id === selectedClass);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <span>Golongan Kendaraan</span>
          <span className="text-brand-400 font-normal text-[11px]">(Sesuai Kepmen PUPR)</span>
        </label>
        <span className="text-xs font-semibold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
          {currentClassInfo?.name}
        </span>
      </div>

      {/* Class Chips */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {VEHICLE_CLASSES.map((vc) => {
          const isSelected = selectedClass === vc.id;
          return (
            <button
              key={vc.id}
              type="button"
              onClick={() => onSelectClass(vc.id)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-b from-brand-500/25 to-brand-600/10 border-brand-500 text-brand-300 shadow-glow-emerald ring-1 ring-brand-500/40'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className={`p-1.5 rounded-lg mb-1 ${isSelected ? 'text-brand-400 bg-brand-500/20' : 'text-slate-500 bg-slate-800/80'}`}>
                {getIcon(vc.id)}
              </div>
              <span className="text-xs font-bold">{vc.name.replace('Golongan ', 'Gol ')}</span>
              <span className="text-[10px] text-slate-400 mt-0.5 font-medium truncate max-w-full">
                {vc.axles ? `${vc.axles} As` : ''}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Class Details Banner */}
      {currentClassInfo && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300">
          <Info className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-slate-200">
              {currentClassInfo.category}
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <span className="text-slate-300 font-medium">Contoh:</span> {currentClassInfo.examples.join(', ')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
