import { EmergencyContact } from '../types/toll';

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'jm_one_call',
    name: 'Jasa Marga One Call (24 Jam)',
    phone: '14080',
    agency: 'PT Jasa Marga (Persero) Tbk',
    category: 'GENERAL',
    description: 'Pusat panggilan darurat resmi seluruh ruas tol Jasa Marga (Jawa, Jabodetabek, Sumatera, Bali). Derek resmi, info lalu lintas, ambulance.',
  },
  {
    id: 'bpjt_pupr',
    name: 'Call Center BPJT Kementerian PUPR',
    phone: '151',
    agency: 'Badan Pengatur Jalan Tol',
    category: 'GENERAL',
    description: 'Pusat informasi dan pengaduan jalan tol resmi Kementerian PUPR.',
  },
  {
    id: 'pjr_korlantas',
    name: 'Patroli Jalan Raya (PJR) Korlantas Polri',
    phone: '110',
    agency: 'Korlantas POLRI',
    category: 'POLICE',
    description: 'Bantuan kepolisian darurat, kecelakaan lalu lintas, dan penegakan hukum di jalan tol.',
  },
  {
    id: 'astra_cipali',
    name: 'Astra Tol Cipali (Cikopo - Palimanan)',
    phone: '02607600600',
    agency: 'PT Lintas Marga Sedaya',
    category: 'OPERATOR',
    description: 'Bantuan darurat, derek gratis, dan informasi lalu lintas Ruas Tol Cipali KM 72 - KM 188.',
    tollRoadId: 'cipali',
  },
  {
    id: 'astra_tangerang_merak',
    name: 'Astra Tol Tangerang - Merak',
    phone: '08001777879',
    agency: 'PT Marga Mandalasakti',
    category: 'OPERATOR',
    description: 'Layanan bebas pulsa darurat dan derek tol Tangerang menuju Pelabuhan Merak.',
    tollRoadId: 'tangerang_merak',
  },
  {
    id: 'hk_toll_sumatera',
    name: 'Hutama Karya Toll Call Center (JTTS)',
    phone: '1500099',
    agency: 'PT Hutama Karya',
    category: 'OPERATOR',
    description: 'Pusat bantuan darurat Jalan Tol Trans Sumatera (Bakter, Terpeka, Palindra, Pekanbaru-Dumai).',
    tollRoadId: 'bakter',
  },
  {
    id: 'derek_gratis',
    name: 'Layanan Derek Tol Resmi (Gratis)',
    phone: '14080',
    agency: 'BUJT / Operator Tol',
    category: 'TOWING',
    description: 'Derek gratis sampai ke pintu tol/gerbang keluar terdekat bagi kendaraan mogok/mengalami kendala teknis di dalam tol.',
  },
  {
    id: 'ambulance_tol',
    name: 'Ambulans & Pertolongan Medis Tol',
    phone: '118',
    agency: 'Kemenkes / PMI / BUJT',
    category: 'AMBULANCE',
    description: 'Layanan evakuasi medis darurat & trauma kecelakaan di jalan tol.',
  },
];

export const EMERGENCY_TIPS = [
  {
    title: '1. Segera Nyalakan Lampu Hazard',
    desc: 'Beri tanda kepada pengemudi di belakang bahwa kendaraan Anda sedang mengalami kendala darurat.',
  },
  {
    title: '2. Tepi Kendaraan ke Bahu Jalan',
    desc: 'Arahkan kendaraan ke bahu jalan sebelah kiri selebar mungkin dan putar roda ke arah kiri.',
  },
  {
    title: '3. Pasang Segitiga Pengaman',
    desc: 'Pasang minimal 30 - 50 meter di belakang mobil untuk tol luar kota berkecepatan tinggi.',
  },
  {
    title: '4. Jangan Berdiri di Jalur / Belakang Mobil',
    desc: 'Seluruh penumpang harus segera keluar dari mobil dan berdiri aman di luar pagar pembatas tol (guardrail).',
  },
  {
    title: '5. Hubungi 14080 / Call Center Ruas',
    desc: 'Sebutkan KM lokasi dan arah lajur untuk penjemputan derek gratis resmi.',
  },
];
