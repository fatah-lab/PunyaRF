import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { FareCalculator } from './components/FareCalculator/FareCalculator';
import { FareBreakdown } from './components/FareSummary/FareBreakdown';
import { TollMap } from './components/Map/TollMap';
import { BalanceChecker } from './components/CardBalance/BalanceChecker';
import { RestAreaList } from './components/RestAreaFinder/RestAreaList';
import { EmergencyDirectory } from './components/Emergency/EmergencyDirectory';
import { ReceiptModal } from './components/Receipt/ReceiptModal';

import { VehicleClassId, CalculationResult, CardWallet } from './types/toll';
import { calculateTollTrip } from './services/tollCalculator';
import { getSavedCards, saveCards, addRecentTrip } from './services/storageService';
import { 
  Sparkles, 
  MapPin, 
  CreditCard, 
  PhoneCall, 
  Coffee, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('calculator');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);

  // Cards State from storage
  const [cards, setCards] = useState<CardWallet[]>(() => getSavedCards());

  // Default Calculation: Jakarta (Halim) to Surabaya (Warugunung)
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(() => {
    return calculateTollTrip('gt_halim', 'gt_warugunung', [], 'GOL_1');
  });

  // Keep dark class on html
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Handle calculation update
  const handleCalculate = (
    originId: string,
    destId: string,
    waypointIds: string[],
    vehicleClass: VehicleClassId
  ) => {
    const res = calculateTollTrip(originId, destId, waypointIds, vehicleClass);
    setCalculationResult(res);

    if (res) {
      addRecentTrip({
        id: `trip_${Date.now()}`,
        originId,
        destId,
        originName: res.originGate.name,
        destName: res.destinationGate.name,
        vehicleClass,
        totalFare: res.totalFare,
        distanceKm: res.totalDistanceKm,
        date: new Date().toLocaleDateString('id-ID'),
      });
    }
  };

  const handleUpdateCards = (updatedCards: CardWallet[]) => {
    setCards(updatedCards);
    saveCards(updatedCards);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReceipt={() => setIsReceiptOpen(true)}
        isDark={isDark}
        setIsDark={setIsDark}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Tab 1: Kalkulator Tarif & Rute */}
        {activeTab === 'calculator' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Hero / Header info banner */}
            <div className="relative rounded-3xl overflow-hidden glass-panel border-slate-800 p-6 sm:p-8 bg-gradient-to-r from-brand-950/40 via-slate-900 to-slate-900">
              <div className="max-w-3xl space-y-2">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                  <span>Update Tarif Tol BPJT Terbaru 2025/2026</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Hitung Tarif Tol Resmi & Rencanakan Rute Tanpa Ribet
                </h1>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Kalkulator tarif tol Indonesia akurat untuk Mobil Pribadi (Gol I) hingga Truk Berat (Gol V). Cek estimasi saldo e-Money, jarak tempuh, dan lokasi rest area SPKLU sepanjang rute Trans-Jawa, Sumatera, dan Jabodetabek.
                </p>
              </div>
            </div>

            {/* 2-Column Split: Calculator & Result/Map Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                <FareCalculator
                  onCalculate={handleCalculate}
                  calculationResult={calculationResult}
                  onViewMap={() => setActiveTab('map')}
                />

                {/* Quick e-Money card status mini widget */}
                {calculationResult && (
                  <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-brand-400" />
                        <span>Kesiapan Saldo e-Money</span>
                      </span>
                      <button
                        onClick={() => setActiveTab('wallet')}
                        className="text-xs font-semibold text-brand-400 hover:text-brand-300"
                      >
                        Kelola Kartu →
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                      <div>
                        <div className="text-slate-400">{cards[0]?.nickname || 'Kartu Utama'}</div>
                        <div className="font-mono font-bold text-white text-sm">
                          Rp {cards[0]?.balance.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-slate-400">Total Tarif</div>
                        <div className="font-mono font-bold text-brand-400 text-sm">
                          Rp {calculationResult.totalFare.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                {calculationResult && (
                  <>
                    <FareBreakdown
                      result={calculationResult}
                      onOpenReceipt={() => setIsReceiptOpen(true)}
                    />

                    {/* Interactive Leaflet Map Preview */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-emerald-400" />
                          <span>Peta Visualisasi Rute & Titik Gerbang</span>
                        </h3>
                        <button
                          onClick={() => setActiveTab('map')}
                          className="text-xs font-semibold text-brand-400 hover:text-brand-300"
                        >
                          Buka Layar Penuh →
                        </button>
                      </div>
                      <TollMap
                        calculationResult={calculationResult}
                        onSelectOrigin={(gId) => handleCalculate(gId, calculationResult.destinationGate.id, [], calculationResult.vehicleClass)}
                        onSelectDestination={(gId) => handleCalculate(calculationResult.originGate.id, gId, [], calculationResult.vehicleClass)}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Peta Interaktif Full View */}
        {activeTab === 'map' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <span>Peta Interaktif Jalan Tol Indonesia</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Eksplorasi posisi gerbang tol, rest area, fasilitas SPKLU, dan jalur penghubung antar provinsi.
                </p>
              </div>

              {calculationResult && (
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300">
                  Rute Aktif: <span className="text-brand-400 font-bold">{calculationResult.originGate.name}</span> ➔ <span className="text-rose-400 font-bold">{calculationResult.destinationGate.name}</span>
                </div>
              )}
            </div>

            <TollMap
              calculationResult={calculationResult}
              onSelectOrigin={(gId) => {
                if (calculationResult) handleCalculate(gId, calculationResult.destinationGate.id, [], calculationResult.vehicleClass);
              }}
              onSelectDestination={(gId) => {
                if (calculationResult) handleCalculate(calculationResult.originGate.id, gId, [], calculationResult.vehicleClass);
              }}
            />
          </div>
        )}

        {/* Tab 3: Rest Area & SPKLU */}
        {activeTab === 'rest_area' && (
          <div className="animate-fadeIn">
            <RestAreaList
              routeRestAreas={calculationResult?.restAreasOnRoute}
            />
          </div>
        )}

        {/* Tab 4: Info & Kontak Darurat */}
        {activeTab === 'emergency' && (
          <div className="animate-fadeIn">
            <EmergencyDirectory />
          </div>
        )}

        {/* Tab 5: Saldo & Manajemen Kartu e-Money */}
        {activeTab === 'wallet' && (
          <div className="animate-fadeIn">
            <BalanceChecker
              cards={cards}
              onUpdateCards={handleUpdateCards}
              totalFare={calculationResult?.totalFare || 0}
            />
          </div>
        )}
      </main>

      {/* Digital Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        result={calculationResult}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-white tracking-wider">TOLL<span className="text-brand-400">HELPER</span></span>
            <span>• Asisten Perjalanan Jalan Tol Seluruh Indonesia</span>
          </div>

          <div className="text-center sm:text-right text-[11px] text-slate-400">
            Data tarif tol resmi merujuk pada Keputusan Menteri PUPR & BUJT (Jasa Marga, Astra Infra, dkk).
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
