-- Seed Initial Data

-- Create Admin User (password: admin123)
INSERT INTO users (user_type, username, password, email, role, enabled, department)
VALUES ('ADMIN', 'admin', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'admin@aircontrolpro.com', 'ADMIN', TRUE, 'Gerencia');

-- Create Dynamic Recursive Menu
INSERT INTO menu_items (label, icon, route, required_role) VALUES ('Gestión de Vuelos', 'flight', '/flights', 'OPERADOR');
INSERT INTO menu_items (label, icon, route, required_role, parent_id) VALUES ('Registrar Vuelo', 'add', '/flights/register', 'OPERADOR', 1);
INSERT INTO menu_items (label, icon, route, required_role, parent_id) VALUES ('Validar Vuelo', 'check', '/flights/validate', 'CONTROLADOR', 1);

INSERT INTO menu_items (label, icon, route, required_role) VALUES ('Operaciones', 'settings', '/operations', 'OPERADOR');
INSERT INTO menu_items (label, icon, route, required_role, parent_id) VALUES ('Despegues', 'flight_takeoff', '/operations/takeoff', 'CONTROLADOR', 4);
INSERT INTO menu_items (label, icon, route, required_role, parent_id) VALUES ('Aterrizajes', 'flight_land', '/operations/landing', 'CONTROLADOR', 4);
INSERT INTO menu_items (label, icon, route, required_role, parent_id) VALUES ('Carga', 'inventory_2', '/operations/cargo', 'CARGA', 4);

-- Recursive Air Routes
INSERT INTO air_routes (origin, destination, distance) VALUES ('BOG', 'MAD', 8000);
INSERT INTO air_routes (origin, destination, distance, parent_route_id) VALUES ('BOG', 'CLO', 300, 1);
