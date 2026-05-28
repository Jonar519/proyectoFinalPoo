CREATE TABLE flight_workflows (
    id BIGSERIAL PRIMARY KEY,
    flight_id BIGINT NOT NULL UNIQUE REFERENCES flights(id) ON DELETE CASCADE,
    phase VARCHAR(50) NOT NULL,
    next_action_at TIMESTAMP,
    cargo_operation_id BIGINT REFERENCES operations(id) ON DELETE SET NULL,
    takeoff_operation_id BIGINT REFERENCES operations(id) ON DELETE SET NULL,
    landing_operation_id BIGINT REFERENCES operations(id) ON DELETE SET NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_flight_workflows_phase ON flight_workflows(phase);
CREATE INDEX idx_flight_workflows_next_action ON flight_workflows(next_action_at);

-- Inicializar flujos para vuelos existentes
INSERT INTO flight_workflows (flight_id, phase, updated_at)
SELECT f.id, 'WAITING_SCHEDULE', CURRENT_TIMESTAMP
FROM flights f
WHERE NOT EXISTS (
    SELECT 1 FROM flight_workflows w WHERE w.flight_id = f.id
);
