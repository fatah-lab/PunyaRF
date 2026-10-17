import React from 'react';
import { EMERGENCY_CONTACTS, EMERGENCY_TIPS } from '../../data/emergencyContacts';
import { 
  PhoneCall, 
  ShieldAlert, 
  Truck, 
  HeartHandshake, 
  AlertOctagon, 
  ExternalLink,
  LifeBuoy
} from 'lucide-react';

export const EmergencyDirectory: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Warning Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/60 to-slate-900 border border-rose-500/40 shadow-xl">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 flex-shrink-0">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">
              Pusat Panggilan Darurat Jalan Tol (24 Jam Bebas Pulsa / Hotline)
            </h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Jika kendaraan Anda mogok, ban kempes, atau mengalami kecelakaan di jalan tol, segera nyalakan lampu hazard, tepi kendaraan di bahu jalan luar, dan hubungi nomor darurat di bawah ini.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EMERGENCY_CONTACTS.map((contact) => (
          <div
            key={contact.id}
            className="glass-panel p-5 rounded-2xl border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-800 text-brand-400 border border-slate-700">
                  {contact.agency}
                </span>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>24 Jam Aktif</span>
                </span>
              </div>

              <h3 className="font-bold text-base text-white">{contact.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{contact.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="font-mono text-lg font-extrabold text-brand-300 tracking-wider">
                {contact.phone}
              </div>

              <a
                href={`tel:${contact.phone}`}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-brand-500 hover:from-emerald-500 hover:to-brand-400 text-white shadow-glow-emerald transition"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Panggil Sekarang</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Safety Protocol Steps */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
        <div className="flex items-center space-x-2 text-amber-400">
          <AlertOctagon className="w-5 h-5" />
          <h3 className="font-bold text-sm text-white">
            Prosedur Keselamatan Saat Kendaraan Mogok di Jalan Tol
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {EMERGENCY_TIPS.map((tip, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 text-xs"
            >
              <h4 className="font-bold text-slate-200">{tip.title}</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
