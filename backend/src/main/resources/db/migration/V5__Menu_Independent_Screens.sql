-- Eliminar subopciones de vuelos del menu (registro solo desde el boton en la pantalla)
DELETE FROM menu_items WHERE label IN ('Registrar Vuelo', 'Validar Vuelo');

-- Pantallas independientes por ruta
UPDATE menu_items SET route = '/dashboard/flights' WHERE label = 'Gestión de Vuelos';

UPDATE menu_items SET route = NULL WHERE label = 'Operaciones';

UPDATE menu_items SET route = '/dashboard/operations/takeoff' WHERE label = 'Despegues';
UPDATE menu_items SET route = '/dashboard/operations/landing' WHERE label = 'Aterrizajes';
UPDATE menu_items SET route = '/dashboard/operations/cargo' WHERE label = 'Carga';
