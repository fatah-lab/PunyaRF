import React, { useState } from 'react';
import { CalculationResult } from '../../types/toll';
import { formatRupiah, formatDuration } from '../../services/tollCalculator';
import { 
  Banknote, 
  Clock, 
  Fuel, 
  Milestone, 
  ReceiptText, 
  Share2, 
  Check, 
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Building2
} from 'lucide-react';

interface FareBreakdownProps {
  result: CalculationResult;
  onOpenReceipt: () => void;
}

export const FareBreakdown: React.FC<FareBreakdownProps> = ({
  result,
  onOpenReceipt,
}) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const handleCopySummary = () => {
    const text = `🚗 *Toll Helper ID - Rincian Tarif Tol*\n📍 Rute: ${result.originGate.name} ➔ ${result.destinationGate.name}\n💰 Total Tarif Tol: ${formatRupiah(result.totalFare)}\n📏 Total Jarak: ${result.totalDistanceKm} KM\n⏱️ Estimasi Waktu: ${formatDuration(result.totalDurationMins)}\n⛽ Estimasi BBM: ±${result.estimatedFuelLiters} Liter\n\nHitung rute tol resmi di Toll Helper!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const costPerKm = result.totalDistanceKm > 0 ? Math.round(result.totalFare / result.totalDistanceKm) : 0;

  return (
    <div className="space-y-4">
      {/* Main Tariff Total Card */}
      <div className="glass-panel rounded-2xl p-6 border-brand-500/30 shadow-glow-emerald relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/90 to-brand-950/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Total Tarif Tol Resmi</span>
            </div>
            <div className="mt-1 flex items-baseline space-x-2">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
                {formatRupiah(result.totalFare)}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Rata-rata biaya: <span className="text-brand-300 font-semibold">{formatRupiah(costPerKm)}/KM</span> ({result.vehicleClass.replace('_', ' ')})
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Salin Rincian ke Clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-slate-300" />}
              <span>{copied ? 'Tersalin!' : 'Bagikan'}</span>
            </button>

            <button
              onClick={onOpenReceipt}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition shadow-sm"
              title="Lihat & Cetak Struk Tol Digital"
            >
              <ReceiptText className="w-4 h-4 text-amber-400" />
              <span>Struk Tol</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-800">
          <div className="flex flex-col items-center sm:items-start p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <div className="flex items-center space-x-1.5 text-xs text-slate-400">
              <Milestone className="w-3.5 h-3.5 text-sky-400" />
              <span>Total Jarak</span>
            </div>
            <span className="text-sm sm:text-base font-bold text-white mt-1 font-mono">
              {result.totalDistanceKm} <span className="text-xs font-normal text-slate-400">KM</span>
            </span>
          </div>

          <div className="flex flex-col items-center sm:items-start p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <div className="flex items-center space-x-1.5 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Estimasi Waktu</span>
            </div>
            <span className="text-sm sm:text-base font-bold text-white mt-1">
              {formatDuration(result.totalDurationMins)}
            </span>
          </div>

          <div className="flex flex-col items-center sm:items-start p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <div className="flex items-center space-x-1.5 text-xs text-slate-400">
              <Fuel className="w-3.5 h-3.5 text-emerald-400" />
              <span>Estimasi BBM</span>
            </div>
            <span className="text-sm sm:text-base font-bold text-white mt-1 font-mono">
              ±{result.estimatedFuelLiters} <span className="text-xs font-normal text-slate-400">Liter</span>
            </span>
          </div>
        </div>
      </div>

      {/* Itemized Segments Breakdown */}
      <div className="glass-panel rounded-2xl p-5 border-slate-800 shadow-lg">
        <div 
          className="flex items-center justify-between cursor-pointer select-none"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center space-x-2">
            <Banknote className="w-4 h-4 text-brand-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Rincian Tarif Tiap Ruas Tol ({result.legs.length} Ruas)
            </h3>
          </div>
          <button className="text-slate-400 hover:text-white p-1 rounded-lg">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {expanded && (
          <div className="mt-4 space-y-2.5">
            {result.legs.map((leg) => (
              <div
                key={`leg-${leg.sequence}`}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-brand-500/10 text-brand-400 font-bold flex items-center justify-center text-[11px] flex-shrink-0 border border-brand-500/20">
                    {leg.sequence}
                  </div>
                  <div>
                    <p className="font-bold text-slate-200">{leg.roadName}</p>
                    <div className="flex items-center space-x-2 mt-0.5 text-[11px] text-slate-400">
                      <span>{leg.originGate.name} ➔ {leg.destinationGate.name}</span>
                      <span>•</span>
                      <span>{leg.distanceKm} KM</span>
                    </div>
                    <div className="flex items-center space-x-1.5 mt-1 text-[10px] text-slate-400">
                      <Building2 className="w-3 h-3 text-slate-500" />
                      <span>{leg.operator}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-white font-mono text-sm">
                    {formatRupiah(leg.fare)}
                  </div>
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    {leg.systemType === 'OPEN' ? 'Terbuka' : 'Tertutup'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
