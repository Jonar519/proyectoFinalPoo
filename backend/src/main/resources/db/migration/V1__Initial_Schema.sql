-- Initial Schema for AIRCONTROL PRO

-- Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    user_type VARCHAR(31) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    department VARCHAR(255),
    license_number VARCHAR(255),
    years_experience INTEGER
);

-- Air Routes Table
CREATE TABLE air_routes (
    id BIGSERIAL PRIMARY KEY,
    origin VARCHAR(10) NOT NULL,
    destination VARCHAR(10) NOT NULL,
    distance DOUBLE PRECISION,
    parent_route_id BIGINT REFERENCES air_routes(id)
);

-- Flights Table
CREATE TABLE flights (
    id BIGSERIAL PRIMARY KEY,
    flight_number VARCHAR(20) UNIQUE NOT NULL,
    airline VARCHAR(100),
    aircraft_type VARCHAR(50),
    route_id BIGINT REFERENCES air_routes(id),
    scheduled_departure TIMESTAMP,
    scheduled_arrival TIMESTAMP,
    status VARCHAR(50)
);

-- Operations Base Table
CREATE TABLE operations (
    id BIGSERIAL PRIMARY KEY,
    operation_time TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    flight_number VARCHAR(20) NOT NULL
);

-- Takeoffs Table (Inheritance JOINED)
CREATE TABLE takeoffs (
    id BIGINT PRIMARY KEY REFERENCES operations(id),
    runway_id VARCHAR(50),
    wind_speed DOUBLE PRECISION,
    visibility DOUBLE PRECISION
);

-- Landings Table (Inheritance JOINED)
CREATE TABLE landings (
    id BIGINT PRIMARY KEY REFERENCES operations(id),
    approach_path VARCHAR(255),
    fuel_emergency BOOLEAN
);

-- Boardings Table (Inheritance JOINED)
CREATE TABLE boardings (
    id BIGINT PRIMARY KEY REFERENCES operations(id),
    passenger_count INTEGER,
    gate_number INTEGER,
    crew_ready BOOLEAN
);

-- Cargo Operations Table (Inheritance JOINED)
CREATE TABLE cargo_operations (
    id BIGINT PRIMARY KEY REFERENCES operations(id),
    total_weight DOUBLE PRECISION,
    hazardous_material BOOLEAN,
    cargo_zone VARCHAR(100)
);

-- Menu Items (Recursivity)
CREATE TABLE menu_items (
    id BIGSERIAL PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    icon VARCHAR(100),
    route VARCHAR(255),
    required_role VARCHAR(50),
    parent_id BIGINT REFERENCES menu_items(id)
);
