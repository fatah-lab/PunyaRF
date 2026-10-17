import React, { useState, useRef } from 'react';
import { CalculationResult } from '../../types/toll';
import { VEHICLE_CLASSES } from '../../data/tollRoads';
import { formatRupiah, formatDuration } from '../../services/tollCalculator';
import { 
  X, 
  Printer, 
  Download, 
  Share2, 
  Check, 
  ReceiptText, 
  QrCode, 
  ShieldCheck 
} from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CalculationResult | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const [driverName, setDriverName] = useState('Pengemudi Operasional');
  const [plateNumber, setPlateNumber] = useState('B 1234 XYZ');
  const [paymentMethod, setPaymentMethod] = useState('Mandiri e-Money');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !result) return null;

  const vehicleClassInfo = VEHICLE_CLASSES.find((v) => v.id === result.vehicleClass);
  const now = new Date();
  const receiptNo = `TOLL-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(100000 + Math.random() * 900000)}`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = `🧾 STRUK TOL RESMI INDONESIA\nNo: ${receiptNo}\nTanggal: ${now.toLocaleDateString('id-ID')} ${now.toLocaleTimeString('id-ID')}\nKendaraan: ${plateNumber} (${vehicleClassInfo?.name})\nRute: ${result.originGate.name} ➔ ${result.destinationGate.name}\nTotal Tarif: ${formatRupiah(result.totalFare)}\nMetode Pembayaran: ${paymentMethod}\nStatus: LUNAS / VERIFIED`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl glass-panel border-slate-700 shadow-2xl p-6 my-8 space-y-5 bg-slate-900/95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2 text-brand-400">
            <ReceiptText className="w-5 h-5" />
            <h3 className="font-bold text-base text-white">Struk Perjalanan & Tarif Tol</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Customizer for Reimbursement */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
          <div>
            <label className="text-slate-400 font-medium">Plat Nomor Kendaraan</label>
            <input
              type="text"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
              className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono font-bold"
            />
          </div>
          <div>
            <label className="text-slate-400 font-medium">Nama Pengemudi / Driver</label>
            <input
              type="text"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-medium"
            />
          </div>
        </div>

        {/* Printable Struk Card (Paper receipt styling) */}
        <div id="printable-receipt" className="bg-slate-950 border border-slate-700 rounded-xl p-5 space-y-4 text-xs font-mono text-slate-300 relative shadow-inner">
          {/* Watermark badge */}
          <div className="text-center border-b border-dashed border-slate-700 pb-3 space-y-1">
            <h4 className="text-sm font-extrabold text-white tracking-widest uppercase">
              TOLL HELPER INDONESIA
            </h4>
            <p className="text-[10px] text-slate-400">REKAPITULASI BIAYA & STRUK TARIF TOL ELEKTRONIK</p>
            <p className="text-[10px] text-slate-400 font-sans">
              {now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {now.toLocaleTimeString('id-ID')}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">No. Referensi:</span>
              <span className="font-bold text-white">{receiptNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Kendaraan:</span>
              <span className="font-bold text-white">{plateNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Golongan:</span>
              <span className="font-bold text-white">{vehicleClassInfo?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Pengemudi:</span>
              <span className="font-medium text-slate-200">{driverName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Metode Bayar:</span>
              <span className="font-medium text-slate-200">{paymentMethod}</span>
            </div>
          </div>

          {/* Route Table */}
          <div className="border-t border-b border-dashed border-slate-700 py-3 space-y-2">
            <div className="text-[11px] font-bold text-slate-200 uppercase">Rincian Ruas Tol:</div>
            {result.legs.map((leg) => (
              <div key={leg.sequence} className="flex justify-between items-start text-[10px]">
                <div className="pr-2">
                  <div className="text-slate-200 font-semibold">{leg.roadName}</div>
                  <div className="text-slate-400">{leg.originGate.name} ➔ {leg.destinationGate.name} ({leg.distanceKm} KM)</div>
                </div>
                <div className="font-bold text-white whitespace-nowrap">
                  {formatRupiah(leg.fare)}
                </div>
              </div>
            ))}
          </div>

          {/* Summary Total */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Total Jarak Tol:</span>
              <span className="font-bold text-white">{result.totalDistanceKm} KM</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white border-t border-slate-800 pt-2">
              <span>TOTAL TARIF TOL:</span>
              <span className="text-base text-brand-400 font-extrabold">{formatRupiah(result.totalFare)}</span>
            </div>
          </div>

          {/* QR Code & Status Mock */}
          <div className="pt-3 border-t border-dashed border-slate-700 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-[10px] text-emerald-400 font-sans font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>TERVALIDASI RESMI BPJT</span>
            </div>
            <div className="text-[10px] text-slate-400 font-sans">
              Simpan bukti untuk klaim reimbursement
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-400 text-white shadow-glow-emerald transition"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
