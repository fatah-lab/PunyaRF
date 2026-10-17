# Product Requirements Document (PRD)
## Project: Toll Helper (Aplikasi Asisten & Kalkulator Tarif Tol Indonesia)

**Version:** 1.0.0  
**Status:** Approved  
**Target Platform:** Web Application (Responsive Desktop & Mobile)  
**Primary Language:** Bahasa Indonesia & English  

---

## 1. Executive Summary
**Toll Helper** is a modern, comprehensive, and interactive web application designed to help Indonesian motorists, road trippers, logistics operators, and commercial drivers calculate accurate toll road tariffs, plan multi-segment highway routes, monitor electronic money (e-Money / Flazz / Brizzi / TapCash) balances, locate highway rest areas (including EV Charging SPKLU and gas stations), and access emergency roadside hotlines in real time.

---

## 2. Problem Statement
1. **Unpredictable Toll Expenses:** Motorists often enter toll roads without knowing the exact cumulative toll fare across multiple toll road operators (e.g., Jasa Marga, Astra Infra, Hutama Karya), leading to insufficient card balance at exit toll gates (Gerbang Tol).
2. **Multiple Vehicle Categories:** Fares differ significantly across Vehicle Classes (Golongan I to V). Commercial vehicles and trucks frequently lack simple tools to calculate operational toll budgets.
3. **Complex Multi-Segment Toll Networks:** Mega networks like Trans-Java (Jakarta to Surabaya/Banyuwangi) and Trans-Sumatera involve dozens of consecutive toll sections and multiple toll gates with varying barrier systems (Open vs. Closed Barrier systems).
4. **Scattered Rest Area & Emergency Information:** Finding rest areas equipped with specific amenities (such as SPKLU EV Fast Chargers, Mosques, and specialized mechanics) or finding official emergency rescue numbers (Derek Tol Gratis) during roadside emergencies is inconvenient while driving.

---

## 3. Goals & Objectives
- **Accurate Tariff Calculation:** Calculate 100% accurate Indonesian BPJT-compliant toll tariffs for Golongan I through Golongan V vehicles.
- **Interactive Visual Mapping:** Provide an interactive Leaflet route map showing exact toll gate locations, connecting polylines, toll plazas, and rest areas.
- **e-Money Balance Management:** Alert drivers in advance if their current electronic money card balance is insufficient, showing the exact deficit and recommended top-up values.
- **Smart Waypoint Routing:** Support multi-stop trips (e.g., Jakarta -> Cirebon -> Semarang -> Surabaya).
- **Expense & Itinerary Reporting:** Generate downloadable and printable digital toll receipts for reimbursement and fleet accounting.
- **Emergency Preparedness:** Provide one-touch emergency calling directory for all toll operators, PJR police, and towing services.

---

## 4. User Personas
### Persona 1: Arya (Family Road Tripper / Daily Commuter)
- **Vehicle:** Passenger Car (Golongan I - SUV / MPV)
- **Need:** Wants to calculate the total toll budget for holiday trips (e.g., Jakarta to Malang) and check where the best Rest Areas with SPKLU / Family dining are located.
- **Pain Point:** Worried about card balance rejection at toll barriers with long queues behind.

### Persona 2: Budi (Logistics Fleet Driver)
- **Vehicle:** Heavy Truck 3 Axles (Golongan III / IV)
- **Need:** Calculates commercial logistics route costs, compares alternative routes, and saves trip receipts for operational expense reimbursement.
- **Pain Point:** Needs accurate Golongan III-V rates and official toll breakdowns.

---

## 5. Functional Requirements (FR)

### FR1: Vehicle Class Selection (Golongan Kendaraan)
- **FR1.1:** Support all standard Indonesian Toll Vehicle Classes:
  - **Golongan I:** Sedan, Jip, Pick Up/Truk Kecil, Bus, Minibus.
  - **Golongan II:** Truk Besar dengan 2 Gandar (Axles).
  - **Golongan III:** Truk Besar dengan 3 Gandar (Axles).
  - **Golongan IV:** Truk Besar dengan 4 Gandar (Axles).
  - **Golongan V:** Truk Besar dengan 5 Gandar (Axles) atau lebih.
  - **Golongan VI:** Sepeda Motor (Khusus ruas Tol Bali Mandara & Suramadu).
- **FR1.2:** Intuitive visual vehicle selector with vehicle icons and axle diagrams.

### FR2: Toll Route & Gate Selection
- **FR2.1:** Dynamic autocomplete search for Origin (Gerbang Asal) and Destination (Gerbang Tujuan).
- **FR2.2:** Filter and group gates by Toll Network (Trans-Java, Jabodetabek & JORR, Trans-Sumatera, Bali Mandara).
- **FR2.3:** Add intermediate stops / waypoints to plan multi-city itineraries.
- **FR2.4:** Quick origin-destination swapping button.

### FR3: Tariff & Travel Breakdown
- **FR3.1:** Display total toll fare in Rupiah (`Rp xxx.xxx`).
- **FR3.2:** Detailed step-by-step breakdown displaying:
  - Toll Road Name (Ruas Tol)
  - Operator (Jasa Marga, Astra Infra, Hutama Karya, etc.)
  - System Type (Sistem Terbuka / Sistem Tertutup)
  - Segment Tariff per Vehicle Class
  - Segment Distance (KM) & Estimated Travel Duration
- **FR3.3:** Total trip metrics: Total Distance (KM), Estimated Travel Time, Estimated Fuel Consumption (Liters).

### FR4: Interactive Leaflet Route Map
- **FR4.1:** Render OpenStreetMap tiles with custom styled toll gate markers (Origin: Green, Intermediate: Blue, Destination: Red).
- **FR4.2:** Render smooth polyline geometry connecting the selected route segments.
- **FR4.3:** Display Rest Area pins on the map with interactive popups showing KM marker and available amenities.
- **FR4.4:** Interactive gate click: Clicking a toll gate pin on the map allows setting it directly as Origin or Destination.
- **FR4.5:** Map controls: Zoom in/out, fit to bounds / center route, full screen toggle.

### FR5: e-Money Balance & Shortfall Alerts
- **FR5.1:** Input starting balance for e-Money cards (Mandiri e-Money, BCA Flazz, BRI Brizzi, BNI TapCash).
- **FR5.2:** Real-time balance calculation: `Remaining Balance = Starting Balance - Total Fare`.
- **FR5.3:** Insufficient Balance Warning: Displays a prominent warning card if `Remaining Balance < 0`, indicating the exact top-up deficit required.
- **FR5.4:** Multi-card splitting support: Allocate fare across multiple cards.

### FR6: Rest Area & Amenity Directory
- **FR6.1:** Comprehensive directory of Rest Areas along the selected route.
- **FR6.2:** Facility filtering tags:
  - ⚡ SPKLU (EV Fast Charging)
  - ⛽ SPBU (Pertamina / Shell / BP)
  - 🕌 Masjid / Musholla
  - 🍴 Food Court / Restoran / Resto 24 Jam
  - 🏪 Minimarket (Indomaret / Alfamart)
  - 🔧 Bengkel Darurat / Tambal Ban
- **FR6.3:** Rest Area categorization by Type (Type A - Full, Type B - Medium, Type C - Parking bay / Kecil).

### FR7: Toll Road Emergency Hotline Directory
- **FR7.1:** Instant one-click phone dialer for critical numbers:
  - Jasa Marga One Call: `14080`
  - Astra Tol Nusantara: `021-8643000`
  - Hutama Karya: `1500099`
  - Derek Tol Resmi (Gratis sampai gerbang tol terdekat)
  - Patroli Jalan Raya (PJR) POLRI
  - Call Center BPJT Kementerian PUPR: `151`
- **FR7.2:** Emergency roadside safety instructions (Segitiga pengaman, bahu jalan, tips mogok).

### FR8: Digital Toll Receipt & Expense Export
- **FR8.1:** Modal generating an official-style Digital Toll Trip Summary / Struk Tol.
- **FR8.2:** Fields: Transaction Date, Vehicle Registration Plate Number, Driver Name, Vehicle Class, Itemized Route Breakdown, Total Fare, Reference Number, and Verification QR code.
- **FR8.3:** Print-friendly view and export format for business trip reimbursement.

---

## 6. Non-Functional Requirements (NFR)
1. **Performance:** Instantaneous calculation (< 10ms client-side calculation).
2. **Usability & Aesthetic:** Modern dark/light theme, clean glassmorphic cards, emerald green & cyan accent colors, dynamic micro-animations, and high-contrast readable typography.
3. **Responsiveness:** Fully responsive across mobile smartphones, tablets, and desktop displays.
4. **Reliability:** Pre-bundled offline dataset of Indonesian toll roads ensuring 100% availability without relying on unstable 3rd-party scrapers.

---

## 7. Technology Stack
- **Frontend Core:** React 18+ with TypeScript
- **Bundler & Tooling:** Vite
- **Styling:** Tailwind CSS + PostCSS + Lucide Icons
- **Mapping Engine:** Leaflet & React-Leaflet with OpenStreetMap tiles
- **State & Storage:** React Hooks + LocalStorage persistence
