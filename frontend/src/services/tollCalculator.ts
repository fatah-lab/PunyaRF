import { TollGate, VehicleClassId, CalculationResult, RouteLeg, RestArea } from '../types/toll';
import { TOLL_GATES, FARE_SEGMENTS, TOLL_ROADS } from '../data/tollRoads';
import { REST_AREAS } from '../data/restAreas';

// Ordered sequence of major gates on the Trans-Java Spine
const TRANS_JAVA_SPINE: string[] = [
  'gt_halim',
  'gt_cikarang_utama',
  'gt_cikampek_utama',
  'gt_subang',
  'gt_kertajati',
  'gt_palimanan',
  'gt_kanci',
  'gt_pejagan',
  'gt_brebes_timur',
  'gt_pemalang',
  'gt_batang',
  'gt_kalikangkung',
  'gt_banyumanik',
  'gt_salatiga',
  'gt_colomadu',
  'gt_ngemplak',
  'gt_sragen',
  'gt_ngawi',
  'gt_madiun',
  'gt_nganjuk',
  'gt_bandar',
  'gt_mojokerto_barat',
  'gt_warugunung',
  'gt_kejapanan',
  'gt_pasuruan',
  'gt_probolinggo_timur',
];

// Helper to find a direct segment
function findDirectSegment(originId: string, destId: string) {
  return FARE_SEGMENTS.find(
    (s) =>
      (s.originGateId === originId && s.destinationGateId === destId) ||
      (s.originGateId === destId && s.destinationGateId === originId)
  );
}

// Find single-hop or multi-hop path between two gates
function calculatePathBetweenTwoGates(
  originGate: TollGate,
  destGate: TollGate,
  vehicleClass: VehicleClassId
): RouteLeg[] {
  // 1. Direct segment check
  const direct = findDirectSegment(originGate.id, destGate.id);
  if (direct) {
    const road = TOLL_ROADS.find((r) => r.id === direct.roadId);
    const fare = (direct.fares[vehicleClass] as number) || direct.fares.GOL_1;
    return [
      {
        sequence: 1,
        roadName: direct.roadName,
        operator: direct.operator,
        originGate,
        destinationGate: destGate,
        distanceKm: direct.distanceKm,
        durationMins: direct.estimatedDurationMins,
        fare,
        systemType: road?.systemType || 'CLOSED',
      },
    ];
  }

  // 2. Trans-Java Spine path traversal
  const originIndex = TRANS_JAVA_SPINE.indexOf(originGate.id);
  const destIndex = TRANS_JAVA_SPINE.indexOf(destGate.id);

  if (originIndex !== -1 && destIndex !== -1 && originIndex !== destIndex) {
    const isForward = originIndex < destIndex;
    const step = isForward ? 1 : -1;
    const subSpine: string[] = [];

    for (let i = originIndex; isForward ? i <= destIndex : i >= destIndex; i += step) {
      subSpine.push(TRANS_JAVA_SPINE[i]);
    }

    const legs: RouteLeg[] = [];
    let currentOriginIdx = 0;

    while (currentOriginIdx < subSpine.length - 1) {
      let matchedSegment = null;
      let matchedDestIdx = subSpine.length - 1;

      // Greedily find the longest available segment from current gate
      for (let j = subSpine.length - 1; j > currentOriginIdx; j--) {
        const seg = findDirectSegment(subSpine[currentOriginIdx], subSpine[j]);
        if (seg) {
          matchedSegment = seg;
          matchedDestIdx = j;
          break;
        }
      }

      if (matchedSegment) {
        const legOrigin = TOLL_GATES.find((g) => g.id === subSpine[currentOriginIdx]) || originGate;
        const legDest = TOLL_GATES.find((g) => g.id === subSpine[matchedDestIdx]) || destGate;
        const road = TOLL_ROADS.find((r) => r.id === matchedSegment.roadId);
        const fare = (matchedSegment.fares[vehicleClass] as number) || matchedSegment.fares.GOL_1;

        legs.push({
          sequence: legs.length + 1,
          roadName: matchedSegment.roadName,
          operator: matchedSegment.operator,
          originGate: legOrigin,
          destinationGate: legDest,
          distanceKm: matchedSegment.distanceKm,
          durationMins: matchedSegment.estimatedDurationMins,
          fare,
          systemType: road?.systemType || 'CLOSED',
        });

        currentOriginIdx = matchedDestIdx;
      } else {
        // Fallback step by step calculation
        const nextIdx = currentOriginIdx + 1;
        const legOrigin = TOLL_GATES.find((g) => g.id === subSpine[currentOriginIdx]) || originGate;
        const legDest = TOLL_GATES.find((g) => g.id === subSpine[nextIdx]) || destGate;
        const approxKm = Math.abs(legDest.kmMarker - legOrigin.kmMarker) || 25;
        
        // Multiplier rates by vehicle class
        const ratePerKm = vehicleClass === 'GOL_1' ? 1050 : vehicleClass === 'GOL_2' ? 1550 : vehicleClass === 'GOL_3' ? 1550 : 2100;
        const estimatedFare = Math.round((approxKm * ratePerKm) / 500) * 500;

        legs.push({
          sequence: legs.length + 1,
          roadName: 'Jalan Tol Terhubung',
          operator: 'PT Jasa Marga / Mitra Tol',
          originGate: legOrigin,
          destinationGate: legDest,
          distanceKm: approxKm,
          durationMins: Math.round((approxKm / 80) * 60),
          fare: estimatedFare,
          systemType: 'CLOSED',
        });

        currentOriginIdx = nextIdx;
      }
    }

    return legs;
  }

  // 3. Fallback for other interconnected toll routes (e.g. Jabodetabek or Sumatra)
  const dist = Math.abs(destGate.kmMarker - originGate.kmMarker) || 30;
  const rateMultiplier = vehicleClass === 'GOL_1' ? 1000 : vehicleClass === 'GOL_2' ? 1500 : vehicleClass === 'GOL_3' ? 1500 : 2000;
  const computedFare = Math.max(10000, Math.round((dist * rateMultiplier) / 500) * 500);

  return [
    {
      sequence: 1,
      roadName: `${originGate.name} ke ${destGate.name}`,
      operator: 'PT Jasa Marga / Mitra BUJT',
      originGate,
      destinationGate: destGate,
      distanceKm: dist,
      durationMins: Math.round((dist / 70) * 60),
      fare: computedFare,
      systemType: 'CLOSED',
    },
  ];
}

export function calculateTollTrip(
  originGateId: string,
  destinationGateId: string,
  waypointGateIds: string[] = [],
  vehicleClass: VehicleClassId = 'GOL_1'
): CalculationResult | null {
  const originGate = TOLL_GATES.find((g) => g.id === originGateId);
  const destinationGate = TOLL_GATES.find((g) => g.id === destinationGateId);

  if (!originGate || !destinationGate) {
    return null;
  }

  const waypoints = waypointGateIds
    .map((id) => TOLL_GATES.find((g) => g.id === id))
    .filter((g): g is TollGate => !!g);

  const fullRouteNodes: TollGate[] = [originGate, ...waypoints, destinationGate];
  const allLegs: RouteLeg[] = [];

  for (let i = 0; i < fullRouteNodes.length - 1; i++) {
    const from = fullRouteNodes[i];
    const to = fullRouteNodes[i + 1];
    const subLegs = calculatePathBetweenTwoGates(from, to, vehicleClass);
    allLegs.push(...subLegs);
  }

  // Re-index sequences
  allLegs.forEach((leg, idx) => {
    leg.sequence = idx + 1;
  });

  const totalFare = allLegs.reduce((sum, leg) => sum + leg.fare, 0);
  const totalDistanceKm = Number(allLegs.reduce((sum, leg) => sum + leg.distanceKm, 0).toFixed(1));
  const totalDurationMins = allLegs.reduce((sum, leg) => sum + leg.durationMins, 0);

  // Fuel consumption estimation (Km/L depends on vehicle class)
  const kmPerLiter = vehicleClass === 'GOL_1' ? 12 : vehicleClass === 'GOL_2' ? 7 : vehicleClass === 'GOL_3' ? 5 : 4;
  const estimatedFuelLiters = Number((totalDistanceKm / kmPerLiter).toFixed(1));

  // Build Polyline points
  const polylineCoords: [number, number][] = [];
  polylineCoords.push([originGate.latitude, originGate.longitude]);

  allLegs.forEach((leg) => {
    if (leg.originGate && (leg.originGate.latitude !== originGate.latitude || leg.originGate.longitude !== originGate.longitude)) {
      polylineCoords.push([leg.originGate.latitude, leg.originGate.longitude]);
    }
    if (leg.destinationGate) {
      polylineCoords.push([leg.destinationGate.latitude, leg.destinationGate.longitude]);
    }
  });

  // Filter Rest Areas along the route
  const minLat = Math.min(...polylineCoords.map((c) => c[0])) - 0.2;
  const maxLat = Math.max(...polylineCoords.map((c) => c[0])) + 0.2;
  const minLng = Math.min(...polylineCoords.map((c) => c[1])) - 0.2;
  const maxLng = Math.max(...polylineCoords.map((c) => c[1])) + 0.2;

  const restAreasOnRoute: RestArea[] = REST_AREAS.filter((ra) => {
    return ra.latitude >= minLat && ra.latitude <= maxLat && ra.longitude >= minLng && ra.longitude <= maxLng;
  });

  return {
    originGate,
    destinationGate,
    waypoints,
    vehicleClass,
    totalFare,
    totalDistanceKm,
    totalDurationMins,
    estimatedFuelLiters,
    legs: allLegs,
    polylineCoords,
    restAreasOnRoute,
  };
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDuration(mins: number): string {
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  if (hours === 0) return `${remainingMins} mnt`;
  if (remainingMins === 0) return `${hours} jam`;
  return `${hours} jam ${remainingMins} mnt`;
}
