export type VehicleClassId = 'GOL_1' | 'GOL_2' | 'GOL_3' | 'GOL_4' | 'GOL_5' | 'GOL_6';

export interface VehicleClass {
  id: VehicleClassId;
  name: string;
  category: string;
  description: string;
  axles: number;
  examples: string[];
  icon: string;
}

export type NetworkRegion = 'trans_java' | 'jabodetabek' | 'trans_sumatera' | 'bali';

export interface TollNetwork {
  id: NetworkRegion;
  name: string;
  region: string;
  description: string;
  badgeColor: string;
}

export interface TollRoad {
  id: string;
  networkId: NetworkRegion;
  name: string;
  operator: string;
  systemType: 'OPEN' | 'CLOSED';
  totalLengthKm: number;
  color?: string;
}

export interface TollGate {
  id: string;
  roadId: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  kmMarker: number;
  isEntry: boolean;
  isExit: boolean;
  isBarrier?: boolean;
}

export interface FareSegment {
  id: string;
  roadId: string;
  roadName: string;
  operator: string;
  originGateId: string;
  destinationGateId: string;
  distanceKm: number;
  estimatedDurationMins: number;
  fares: {
    GOL_1: number;
    GOL_2: number;
    GOL_3: number;
    GOL_4: number;
    GOL_5: number;
    GOL_6?: number;
  };
}

export type RestAreaType = 'TYPE_A' | 'TYPE_B' | 'TYPE_C';

export interface RestArea {
  id: string;
  roadId: string;
  roadName: string;
  name: string;
  direction: 'A' | 'B'; // A = Outbound (Ke Luar Kota / Timur / Selatan), B = Inbound (Ke Jakarta / Barat / Utara)
  kmMarker: number;
  type: RestAreaType;
  latitude: number;
  longitude: number;
  hasSpklu: boolean; // EV Fast Charging
  hasSpbu: boolean;
  hasMasjid: boolean;
  hasFoodCourt: boolean;
  hasAtm: boolean;
  hasMinimarket: boolean;
  hasWorkshop: boolean;
  popularTenants?: string[];
  fuelTypes?: string[];
  notes?: string;
}

export type CardBrand = 'E_MONEY' | 'FLAZZ' | 'BRIZZI' | 'TAPCASH';

export interface CardWallet {
  id: string;
  brand: CardBrand;
  cardNumberMasked: string;
  balance: number;
  nickname: string;
}

export interface RouteLeg {
  sequence: number;
  roadName: string;
  operator: string;
  originGate: TollGate;
  destinationGate: TollGate;
  distanceKm: number;
  durationMins: number;
  fare: number;
  systemType: 'OPEN' | 'CLOSED';
}

export interface CalculationResult {
  originGate: TollGate;
  destinationGate: TollGate;
  waypoints: TollGate[];
  vehicleClass: VehicleClassId;
  totalFare: number;
  totalDistanceKm: number;
  totalDurationMins: number;
  estimatedFuelLiters: number;
  legs: RouteLeg[];
  polylineCoords: [number, number][];
  restAreasOnRoute: RestArea[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  agency: string;
  category: 'GENERAL' | 'POLICE' | 'TOWING' | 'AMBULANCE' | 'OPERATOR';
  description: string;
  tollRoadId?: string;
}

export interface DigitalReceipt {
  receiptNo: string;
  date: string;
  vehiclePlate: string;
  driverName: string;
  vehicleClass: VehicleClass;
  originName: string;
  destinationName: string;
  legs: RouteLeg[];
  totalFare: number;
  totalDistanceKm: number;
  paymentMethod: string;
  qrPayload: string;
}
