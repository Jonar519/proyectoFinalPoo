-- Corrige rutas del menú para alinearlas con el enrutador Angular (/dashboard/*)
UPDATE menu_items SET route = '/dashboard/flights' WHERE route = '/flights';
UPDATE menu_items SET route = '/dashboard/flights' WHERE route = '/flights/register';
UPDATE menu_items SET route = '/dashboard/flights' WHERE route = '/flights/validate';
UPDATE menu_items SET route = '/dashboard/operations' WHERE route = '/operations';
UPDATE menu_items SET route = '/dashboard/operations' WHERE route = '/operations/takeoff';
UPDATE menu_items SET route = '/dashboard/operations' WHERE route = '/operations/landing';
UPDATE menu_items SET route = '/dashboard/operations' WHERE route = '/operations/cargo';
