# Entity Relationship Diagram (ERD) & Data Architecture
## Project: Toll Helper (Aplikasi Asisten & Kalkulator Tarif Tol Indonesia)

**Version:** 1.0.0  
**Status:** Approved  

---

## 1. Visual Entity Relationship Diagram (Mermaid)

```mermaid
erDiagram
    TOLL_NETWORK ||--|{ TOLL_ROAD : "contains"
    TOLL_ROAD ||--|{ TOLL_GATE : "has gates"
    TOLL_ROAD ||--|{ FARE_SEGMENT : "defines tariffs"
    TOLL_ROAD ||--|{ REST_AREA : "located along"
    
    TOLL_GATE ||--o{ FARE_SEGMENT : "origin gate"
    TOLL_GATE ||--o{ FARE_SEGMENT : "destination gate"
    
    VEHICLE_CLASS ||--|{ FARE_SEGMENT : "has rate for"
    
    TRIP_ITINERARY ||--|{ TRIP_LEG : "composed of"
    TRIP_LEG }|--|| TOLL_GATE : "from_gate"
    TRIP_LEG }|--|| TOLL_GATE : "to_gate"
    TRIP_LEG }|--|| FARE_SEGMENT : "calculated via"
    
    CARD_WALLET ||--o{ TRIP_ITINERARY : "pays for"
    
    EMERGENCY_CONTACT }|--o| TOLL_ROAD : "services"

    TOLL_NETWORK {
        string id PK
        string name
        string region "e.g., Jawa, Sumatera, Bali"
        string description
    }

    TOLL_ROAD {
        string id PK
        string network_id FK
        string name "e.g., Tol Jakarta - Cikampek"
        string operator "e.g., PT Jasa Marga"
        string system_type "OPEN | CLOSED"
        float total_length_km
        string status "ACTIVE | UNDER_MAINTENANCE"
    }

    TOLL_GATE {
        string id PK
        string road_id FK
        string name "e.g., GT Cikarang Utama"
        float latitude
        float longitude
        float km_marker "e.g., 29.0"
        boolean is_entry
        boolean is_exit
        boolean is_barrier
        string description
    }

    VEHICLE_CLASS {
        string id PK "GOL_1 | GOL_2 | GOL_3 | GOL_4 | GOL_5 | GOL_6"
        string name "e.g., Golongan I"
        string description "Sedan, Jip, Pick Up, Bus, Minibus"
        int axle_count
        string icon_name
    }

    FARE_SEGMENT {
        string id PK
        string road_id FK
        string origin_gate_id FK
        string destination_gate_id FK
        float distance_km
        int estimated_duration_mins
        int fare_gol1
        int fare_gol2
        int fare_gol3
        int fare_gol4
        int fare_gol5
        int fare_gol6
    }

    REST_AREA {
        string id PK
        string road_id FK
        string name "e.g., Rest Area KM 57 A"
        string direction "A (Menuju Luar Kota) | B (Menuju Jakarta)"
        float km_marker
        string type "TYPE_A | TYPE_B | TYPE_C"
        float latitude
        float longitude
        boolean has_spklu "EV Charging"
        boolean has_spbu "Gas Station"
        boolean has_masjid "Mosque"
        boolean has_food_court "Food Court"
        boolean has_atm "ATM Center"
        boolean has_minimarket "Minimarket"
        boolean has_workshop "Bengkel Darurat"
        string[] fuel_types "Pertalite, Pertamax, Dex"
        string popular_tenants "Starbucks, Solaria, etc."
    }

    CARD_WALLET {
        string id PK
        string card_type "E_MONEY | FLAZZ | BRIZZI | TAPCASH"
        string card_number_masked "e.g., **** 1234"
        int current_balance
        string nickname
    }

    TRIP_ITINERARY {
        string id PK
        string user_id
        string vehicle_class_id FK
        string origin_gate_id FK
        string destination_gate_id FK
        float total_distance_km
        int total_fare
        int estimated_duration_mins
        float estimated_fuel_liters
        datetime created_at
    }

    TRIP_LEG {
        string id PK
        string trip_id FK
        int sequence_order
        string from_gate_id FK
        string to_gate_id FK
        string road_id FK
        int fare_amount
        float distance_km
    }

    EMERGENCY_CONTACT {
        string id PK
        string name "e.g., Call Center Jasa Marga"
        string phone_number "14080"
        string agency "Jasa Marga"
        string service_type "GENERAL | POLICE | TOWING | AMBULANCE"
        string description
        string road_id FK "optional"
    }
```

---

## 2. Data Dictionary & Field Specifications

### 2.1 Entity: `TOLL_NETWORK`
Represents high-level geographic toll highway corridors.
| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | VARCHAR(32) | PRIMARY KEY | Unique network identifier (`trans_java`, `jabodetabek`, `trans_sumatera`, `bali`) |
| `name` | VARCHAR(100) | NOT NULL | Display name (e.g., "Jalan Tol Trans-Jawa") |
| `region` | VARCHAR(50) | NOT NULL | Island or territory (Jawa, Sumatera, Bali) |
| `description`| TEXT | NULLABLE | Geographic bounds and corridor details |

---

### 2.2 Entity: `TOLL_ROAD`
Individual toll concessions or expressway stretches operated by toll road enterprises (BUJT).
| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | VARCHAR(64) | PRIMARY KEY | Identifier (`japek`, `cipali`, `jagorawi`, etc.) |
| `network_id` | VARCHAR(32) | FOREIGN KEY -> TOLL_NETWORK.id | Parent highway network |
| `name` | VARCHAR(150) | NOT NULL | Official section name |
| `operator` | VARCHAR(100) | NOT NULL | Concession operator (Jasa Marga, Astra Tol Cipali, etc.) |
| `system_type`| ENUM('OPEN', 'CLOSED') | NOT NULL | Flat rate at barrier (OPEN) or ticket-based barrier-to-barrier (CLOSED) |
| `total_length_km` | DECIMAL(6,2) | NOT NULL | Total length in kilometers |
| `status` | ENUM('ACTIVE', 'MAINTENANCE') | DEFAULT 'ACTIVE' | Operational status |

---

### 2.3 Entity: `TOLL_GATE`
Physical toll plazas, interchanges, and entry/exit on-ramps/off-ramps.
| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | VARCHAR(64) | PRIMARY KEY | Unique gate code (`gt_cikarang_utama`, `gt_kalikangkung`) |
| `road_id` | VARCHAR(64) | FOREIGN KEY -> TOLL_ROAD.id | Associated toll road |
| `name` | VARCHAR(150) | NOT NULL | Plaza name (e.g., "Gerbang Tol Cikampek Utama") |
| `latitude` | DECIMAL(10,7) | NOT NULL | GPS Latitude coordinate |
| `longitude` | DECIMAL(10,7) | NOT NULL | GPS Longitude coordinate |
| `km_marker` | DECIMAL(6,2) | NOT NULL | Chainage marker (e.g., KM 70.0) |
| `is_entry` | BOOLEAN | DEFAULT TRUE | Allows entrance to toll road |
| `is_exit` | BOOLEAN | DEFAULT TRUE | Allows exit from toll road |
| `is_barrier` | BOOLEAN | DEFAULT FALSE | Barrier toll gate where tariff is paid |

---

### 2.4 Entity: `FARE_SEGMENT`
Tariff matrix defining the rate between two gates for all vehicle classes.
| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | VARCHAR(64) | PRIMARY KEY | Segment identifier |
| `road_id` | VARCHAR(64) | FOREIGN KEY -> TOLL_ROAD.id | Toll road concession |
| `origin_gate_id` | VARCHAR(64) | FOREIGN KEY -> TOLL_GATE.id | Entrance plaza |
| `destination_gate_id` | VARCHAR(64) | FOREIGN KEY -> TOLL_GATE.id | Exit plaza |
| `distance_km` | DECIMAL(6,2) | NOT NULL | Distance in KM |
| `estimated_duration_mins`| INT | NOT NULL | Average driving time in minutes |
| `fare_gol1` | INT | NOT NULL | Fare for Golongan I (Sedan/Bus/Minibus) |
| `fare_gol2` | INT | NOT NULL | Fare for Golongan II (2-Axle Truck) |
| `fare_gol3` | INT | NOT NULL | Fare for Golongan III (3-Axle Truck) |
| `fare_gol4` | INT | NOT NULL | Fare for Golongan IV (4-Axle Truck) |
| `fare_gol5` | INT | NOT NULL | Fare for Golongan V (5+ Axle Truck) |
| `fare_gol6` | INT | DEFAULT 0 | Fare for Golongan VI (Motorcycle - Bali Mandara) |

---

### 2.5 Entity: `REST_AREA`
Service and rest areas along expressways.
| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | VARCHAR(64) | PRIMARY KEY | Unique rest area ID |
| `road_id` | VARCHAR(64) | FOREIGN KEY -> TOLL_ROAD.id | Associated toll road |
| `name` | VARCHAR(150) | NOT NULL | Name (e.g., "Rest Area KM 57 A Jakarta-Cikampek") |
| `direction` | VARCHAR(20) | NOT NULL | Traffic direction (A = Outbound, B = Inbound) |
| `km_marker` | DECIMAL(6,2) | NOT NULL | KM location marker |
| `type` | ENUM('TYPE_A', 'TYPE_B', 'TYPE_C') | NOT NULL | Classification based on facilities |
| `latitude` | DECIMAL(10,7) | NOT NULL | GPS Latitude |
| `longitude` | DECIMAL(10,7) | NOT NULL | GPS Longitude |
| `has_spklu` | BOOLEAN | DEFAULT FALSE | Electric Vehicle Fast Charger available |
| `has_spbu` | BOOLEAN | DEFAULT TRUE | Gas Station available |
| `has_masjid` | BOOLEAN | DEFAULT TRUE | Large Mosque / Prayer Room |
| `has_food_court`| BOOLEAN | DEFAULT TRUE | Restaurants and food court |
| `has_atm` | BOOLEAN | DEFAULT TRUE | Bank ATM gallery |
| `has_minimarket`| BOOLEAN | DEFAULT TRUE | 24-hour convenience store |
| `has_workshop` | BOOLEAN | DEFAULT FALSE | Emergency tire and mechanic shop |

---

### 2.6 Entity: `CARD_WALLET`
User's prepaid electronic money cards for tracking toll payment capability.
| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | VARCHAR(64) | PRIMARY KEY | Local card record ID |
| `card_type` | ENUM('E_MONEY', 'FLAZZ', 'BRIZZI', 'TAPCASH') | NOT NULL | Issuer brand |
| `card_number_masked`| VARCHAR(20) | NULLABLE | Last 4 digits for identification |
| `current_balance` | INT | NOT NULL DEFAULT 0 | Current stored balance (IDR) |
| `nickname` | VARCHAR(50) | NULLABLE | User custom label (e.g., "Kartu Utama Mobil") |

---

### 2.7 Entity: `EMERGENCY_CONTACT`
Direct emergency contacts for roadside assistance and rescue.
| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | VARCHAR(32) | PRIMARY KEY | ID |
| `name` | VARCHAR(100) | NOT NULL | Contact title |
| `phone_number` | VARCHAR(30) | NOT NULL | Dialable phone number (e.g. `14080`) |
| `agency` | VARCHAR(100) | NOT NULL | Entity / BUJT |
| `service_type` | ENUM('GENERAL', 'POLICE', 'TOWING', 'AMBULANCE') | NOT NULL | Service category |
| `description` | TEXT | NULLABLE | Details on services and free rescue range |
