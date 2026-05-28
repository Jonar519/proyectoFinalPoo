-- Rutas unicas por hijo para que routerLinkActive no marque todo el submenu como activo
UPDATE menu_items SET route = '/dashboard/flights' WHERE label = 'Gestión de Vuelos';
UPDATE menu_items SET route = '/dashboard/flights?view=register' WHERE label = 'Registrar Vuelo';
UPDATE menu_items SET route = '/dashboard/flights?view=validate' WHERE label = 'Validar Vuelo';

UPDATE menu_items SET route = '/dashboard/operations' WHERE label = 'Operaciones';
UPDATE menu_items SET route = '/dashboard/operations?tab=takeoff' WHERE label = 'Despegues';
UPDATE menu_items SET route = '/dashboard/operations?tab=landing' WHERE label = 'Aterrizajes';
UPDATE menu_items SET route = '/dashboard/operations?tab=cargo' WHERE label = 'Carga';
