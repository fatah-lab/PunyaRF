import React, { useState } from 'react';
import { CardWallet, CardBrand } from '../../types/toll';
import { formatRupiah } from '../../services/tollCalculator';
import { 
  CreditCard, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Edit2, 
  Smartphone, 
  Store, 
  HelpCircle,
  TrendingDown
} from 'lucide-react';

interface BalanceCheckerProps {
  cards: CardWallet[];
  onUpdateCards: (cards: CardWallet[]) => void;
  totalFare: number;
}

export const BalanceChecker: React.FC<BalanceCheckerProps> = ({
  cards,
  onUpdateCards,
  totalFare,
}) => {
  const [selectedCardId, setSelectedCardId] = useState<string>(cards[0]?.id || '');
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [inputBalance, setInputBalance] = useState<number>(0);
  const [isAddingCard, setIsAddingCard] = useState<boolean>(false);

  // New card form state
  const [newBrand, setNewBrand] = useState<CardBrand>('E_MONEY');
  const [newNickname, setNewNickname] = useState('');
  const [newBalance, setNewBalance] = useState(100000);

  const selectedCard = cards.find((c) => c.id === selectedCardId) || cards[0];
  const currentBalance = selectedCard ? selectedCard.balance : 0;
  const isSufficient = currentBalance >= totalFare;
  const deficit = Math.max(0, totalFare - currentBalance);
  const remaining = currentBalance - totalFare;

  // Total balance across all user cards
  const totalAllCardsBalance = cards.reduce((sum, c) => sum + c.balance, 0);

  const handleSaveBalance = (cardId: string) => {
    const updated = cards.map((c) => (c.id === cardId ? { ...c, balance: inputBalance } : c));
    onUpdateCards(updated);
    setEditingCardId(null);
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    const newCard: CardWallet = {
      id: `card_${Date.now()}`,
      brand: newBrand,
      cardNumberMasked: `**** ${Math.floor(1000 + Math.random() * 9000)}`,
      balance: Number(newBalance) || 0,
      nickname: newNickname || `${newBrand} Card`,
    };
    const updated = [...cards, newCard];
    onUpdateCards(updated);
    setSelectedCardId(newCard.id);
    setIsAddingCard(false);
    setNewNickname('');
    setNewBalance(100000);
  };

  const handleDeleteCard = (cardId: string) => {
    if (cards.length <= 1) return;
    const updated = cards.filter((c) => c.id !== cardId);
    onUpdateCards(updated);
    if (selectedCardId === cardId) {
      setSelectedCardId(updated[0]?.id || '');
    }
  };

  const getBrandColor = (brand: CardBrand) => {
    switch (brand) {
      case 'FLAZZ':
        return 'from-blue-600 to-indigo-800 border-blue-400/40 text-blue-100';
      case 'BRIZZI':
        return 'from-blue-700 to-sky-900 border-sky-400/40 text-sky-100';
      case 'TAPCASH':
        return 'from-orange-600 to-amber-800 border-orange-400/40 text-orange-100';
      default:
        return 'from-yellow-600 to-amber-700 border-amber-400/40 text-yellow-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Alert */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isSufficient
          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
          : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
      }`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start space-x-3">
            {isSufficient ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-rose-400 flex-shrink-0 mt-0.5 animate-bounce" />
            )}
            <div>
              <h3 className="font-bold text-base text-white">
                {isSufficient ? 'Saldo Kartu Mencukupi!' : 'Perhatian: Saldo Kartu Kurang!'}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {isSufficient ? (
                  <>
                    Saldo kartu terpilih (<span className="font-semibold text-white">{selectedCard?.nickname}</span>) mencukupi untuk total tarif tol {formatRupiah(totalFare)}. Sisa saldo setelah gerbang keluar: <span className="font-bold text-emerald-300 font-mono">{formatRupiah(remaining)}</span>.
                  </>
                ) : (
                  <>
                    Saldo kartu terpilih kurang sebesar <span className="font-bold text-rose-300 font-mono">{formatRupiah(deficit)}</span>. Segera lakukan pengisian (Top Up) sebelum memasuki gerbang tol untuk menghindari kemacetan di gardu tol.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Tarif Rute</span>
            <div className="text-lg font-extrabold text-white font-mono">{formatRupiah(totalFare)}</div>
          </div>
        </div>
      </div>

      {/* Cards Slider / Selector */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-400" />
              <span>Daftar Kartu Uang Elektronik (e-Money)</span>
            </h3>
            <p className="text-xs text-slate-400">Pilih kartu yang akan digunakan untuk simulasi pembayaran</p>
          </div>

          <button
            onClick={() => setIsAddingCard(!isAddingCard)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-500/40 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Kartu</span>
          </button>
        </div>

        {/* Add Card Form Modal / Collapsible */}
        {isAddingCard && (
          <form onSubmit={handleAddCard} className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Tambah Kartu Baru</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 font-medium">Jenis Kartu</label>
                <select
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value as CardBrand)}
                  className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value="E_MONEY">Mandiri e-Money</option>
                  <option value="FLAZZ">BCA Flazz</option>
                  <option value="BRIZZI">BRI Brizzi</option>
                  <option value="TAPCASH">BNI TapCash</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-medium">Nama / Label Kartu</label>
                <input
                  type="text"
                  placeholder="Misal: Flazz Mobil Honda"
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-medium">Saldo Awal (Rp)</label>
                <input
                  type="number"
                  step="5000"
                  value={newBalance}
                  onChange={(e) => setNewBalance(Number(e.target.value))}
                  className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingCard(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-brand-500 text-white shadow-glow-emerald"
              >
                Simpan Kartu
              </button>
            </div>
          </form>
        )}

        {/* Card Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cards.map((card) => {
            const isSelected = card.id === selectedCardId;
            const isEditing = editingCardId === card.id;

            return (
              <div
                key={card.id}
                onClick={() => setSelectedCardId(card.id)}
                className={`relative p-4 rounded-2xl bg-gradient-to-br border cursor-pointer transition-all duration-200 ${getBrandColor(card.brand)} ${
                  isSelected ? 'ring-2 ring-white shadow-xl scale-[1.02]' : 'opacity-85 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider">{card.brand.replace('_', ' ')}</span>
                  <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setEditingCardId(card.id);
                        setInputBalance(card.balance);
                      }}
                      className="p-1 rounded hover:bg-white/20 text-white/80 hover:text-white"
                      title="Ubah Saldo"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {cards.length > 1 && (
                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="p-1 rounded hover:bg-rose-500/40 text-white/80 hover:text-white"
                        title="Hapus Kartu"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-[11px] opacity-80">{card.nickname}</div>
                  <div className="text-xs font-mono tracking-widest opacity-70 mt-0.5">{card.cardNumberMasked}</div>
                </div>

                {/* Balance section */}
                <div className="mt-3 pt-3 border-t border-white/20">
                  {isEditing ? (
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="number"
                        step="5000"
                        value={inputBalance}
                        onChange={(e) => setInputBalance(Number(e.target.value))}
                        className="w-full bg-black/40 text-white text-xs font-mono font-bold px-2 py-1 rounded border border-white/30"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveBalance(card.id)}
                        className="px-2 py-1 bg-white text-slate-900 rounded text-xs font-bold"
                      >
                        OK
                      </button>
                    </div>
                  ) : (
                    <div>
                      <span className="text-[10px] uppercase font-bold opacity-80">Saldo Saat Ini</span>
                      <div className="text-lg font-bold font-mono text-white">{formatRupiah(card.balance)}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Multi-Card Combined Info */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Total Saldo Gabungan ({cards.length} Kartu):</span>
          <span className="font-bold text-slate-200 font-mono text-sm">{formatRupiah(totalAllCardsBalance)}</span>
        </div>
      </div>

      {/* Top Up Guide & NFC Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-panel p-4 rounded-xl border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-white">
            <Smartphone className="w-4 h-4 text-sky-400" />
            <span>Cara Top Up Cepat via Smartphone (NFC)</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Tempelkan kartu di belakang ponsel berfitur NFC melalui aplikasi m-Banking resmi: 
            <span className="text-slate-200 font-medium"> Livin' by Mandiri (e-Money), BCA Mobile/myBCA (Flazz), BRImo (Brizzi), BNI Mobile (TapCash)</span>.
          </p>
        </div>

        <div className="glass-panel p-4 rounded-xl border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-white">
            <Store className="w-4 h-4 text-emerald-400" />
            <span>Top Up di Rest Area / Minimarket</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Anda dapat melakukan isi ulang saldo tunai maupun debit di kasir <span className="text-slate-200 font-medium">Indomaret, Alfamart, SPBU Pertamina, atau mesin ATM</span> yang tersedia di seluruh Rest Area Type A & B.
          </p>
        </div>
      </div>
    </div>
  );
};
