import { CardWallet } from '../types/toll';

const CARDS_STORAGE_KEY = 'toll_helper_cards_v1';
const RECENT_TRIPS_KEY = 'toll_helper_recent_trips_v1';

export const DEFAULT_CARDS: CardWallet[] = [
  {
    id: 'card_1',
    brand: 'E_MONEY',
    cardNumberMasked: '**** 8891',
    balance: 250000,
    nickname: 'Mandiri e-Money Utama',
  },
  {
    id: 'card_2',
    brand: 'FLAZZ',
    cardNumberMasked: '**** 3422',
    balance: 100000,
    nickname: 'BCA Flazz Cadangan',
  },
  {
    id: 'card_3',
    brand: 'BRIZZI',
    cardNumberMasked: '**** 5519',
    balance: 50000,
    nickname: 'BRIZZI Mobil',
  },
];

export function getSavedCards(): CardWallet[] {
  try {
    const data = localStorage.getItem(CARDS_STORAGE_KEY);
    if (!data) return DEFAULT_CARDS;
    return JSON.parse(data);
  } catch {
    return DEFAULT_CARDS;
  }
}

export function saveCards(cards: CardWallet[]): void {
  try {
    localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(cards));
  } catch (e) {
    console.error('Failed to save cards to localStorage', e);
  }
}

export interface SavedTripRecord {
  id: string;
  originId: string;
  destId: string;
  originName: string;
  destName: string;
  vehicleClass: string;
  totalFare: number;
  distanceKm: number;
  date: string;
}

export function getRecentTrips(): SavedTripRecord[] {
  try {
    const data = localStorage.getItem(RECENT_TRIPS_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function addRecentTrip(trip: SavedTripRecord): void {
  try {
    const existing = getRecentTrips().filter((t) => !(t.originId === trip.originId && t.destId === trip.destId));
    const updated = [trip, ...existing].slice(0, 10);
    localStorage.setItem(RECENT_TRIPS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save recent trip', e);
  }
}
