# AIRCONTROL PRO — Sistema Inteligente de Gestión Aeroportuaria Comercial

## 🚀 Descripción del Proyecto
AIRCONTROL PRO es una plataforma empresarial diseñada para la gestión integral de operaciones aeroportuarias comerciales. El sistema permite el monitoreo y validación en tiempo real de despegues, aterrizajes, embarques y zonas de carga, garantizando la seguridad y eficiencia operacional.

## 🏗️ Arquitectura del Sistema
El proyecto sigue los principios de **Clean Architecture** y **SOLID**, utilizando una estructura de capas:
- **API Layer**: Controladores REST para la comunicación con el frontend.
- **Service Layer**: Lógica de negocio centralizada.
- **Persistence Layer**: Repositorios JPA para el acceso a datos.
- **Domain Layer**: Entidades de negocio con herencia y polimorfismo.

## 🧭 Diseño

### 1) Contexto
```mermaid
flowchart LR
    U[Usuario Operativo / Administrador] --> FE[Frontend Angular]
    FE --> API[Backend Spring Boot API]
    API --> DB[(PostgreSQL)]
    API --> AUTH[Autenticación JWT]
    API --> FW[Flyway Migraciones]
```

### 2) Despliegue
```mermaid
flowchart TB
    DEV[Desarrollador] --> GIT[Repositorio GitHub]
    GIT --> RBE[Render Web Service - Backend]
    GIT --> VFE[Vercel/Render Static - Frontend]
    RBE --> RDB[(Render PostgreSQL)]
    VFE -->|HTTPS API| RBE
    U2[Usuario final] --> VFE
```

### 3) Conceptual
```mermaid
classDiagram
    class Flight {
      +id
      +flightNumber
      +airline
      +scheduledDeparture
      +status
    }
    class AirRoute {
      +origin
      +destination
      +distanceKm
    }
    class AirportOperation {
      <<abstract>>
      +id
      +operationTime
      +status
      +flightNumber
      +validateOperation()
    }
    class Takeoff
    class Landing
    class Cargo
    class Boarding
    class FlightWorkflow {
      +phase
      +nextActionAt
    }

    Flight --> AirRoute
    AirportOperation <|-- Takeoff
    AirportOperation <|-- Landing
    AirportOperation <|-- Cargo
    AirportOperation <|-- Boarding
    Flight "1" --> "1" FlightWorkflow
```

### 4) Desarrollo
```mermaid
flowchart LR
    UI[Componentes Angular] --> SVCF[Servicios Frontend]
    SVCF --> REST[REST Controllers]
    REST --> APP[Servicios de Aplicación]
    APP --> REPO[Repositorios JPA]
    REPO --> PG[(PostgreSQL)]
    APP --> WF[Servicio de Flujo / Scheduler]
```

### 5) Funcional
```mermaid
stateDiagram-v2
    [*] --> SCHEDULED
    SCHEDULED --> BOARDING: Llega hora programada
    BOARDING --> DEPARTED: Carga completada
    DEPARTED --> IN_FLIGHT: Despegue autorizado
    IN_FLIGHT --> LANDING_IN_PROGRESS: Simulación 10 min
    LANDING_IN_PROGRESS --> LANDED: Aterrizaje completado
    LANDED --> [*]
```

### 6) Diagrama de clases
Diagrama del modelo de dominio del backend (entidades, herencia, interfaces y relaciones principales).

```mermaid
classDiagram
    direction TB

    %% --- Interfaces ---
    class UserDetails {
        <<interface Spring Security>>
        +getUsername() String
        +getPassword() String
        +getAuthorities() Collection
    }

    class Monitorable {
        <<interface>>
        +getStatus() String
        +updateStatus(newStatus) void
    }

    class Reportable {
        <<interface>>
        +generateReportData() Map
        +getReportType() String
    }

    class Auditable {
        <<interface>>
        +getCreatedAt() LocalDateTime
        +getCreatedBy() String
        +getUpdatedAt() LocalDateTime
        +getUpdatedBy() String
    }

    %% --- Usuarios ---
    class User {
        <<abstract>>
        #Long id
        #String username
        #String password
        #String email
        #UserRole role
        #boolean enabled
    }

    class Administrador {
        -String department
    }

    class ControladorAereo {
        -String licenseNumber
        -Integer yearsExperience
    }

    class UserRole {
        <<enumeration>>
        ADMIN
        CONTROLADOR
        EMBARQUE
        CARGA
        OPERADOR
    }

    User <|-- Administrador
    User <|-- ControladorAereo
    User ..|> UserDetails
    User --> UserRole

    %% --- Vuelos y rutas ---
    class Flight {
        -Long id
        -String flightNumber
        -String airline
        -String aircraftType
        -LocalDateTime scheduledDeparture
        -LocalDateTime scheduledArrival
        -FlightStatus status
    }

    class AirRoute {
        -Long id
        -String origin
        -String destination
        -Double distance
        +calculateTotalDistance() Double
    }

    class FlightStatus {
        <<enumeration>>
        SCHEDULED
        BOARDING
        DEPARTED
        IN_FLIGHT
        LANDED
        CANCELLED
        DELAYED
    }

    Flight --> AirRoute : route
    Flight --> FlightStatus : status

    AirRoute "0..*" --> "0..1" AirRoute : parentRoute / subRoutes

    %% --- Operaciones aeroportuarias ---
    class AirportOperation {
        <<abstract>>
        #Long id
        #LocalDateTime operationTime
        #String status
        #String flightNumber
        +validateOperation()* boolean
        +getReportType()* String
    }

    class Takeoff {
        -String runwayId
        -Double windSpeed
        -Double visibility
        +validateOperation() boolean
    }

    class Landing {
        -String approachPath
        -Boolean fuelEmergency
        +validateOperation() boolean
    }

    class Cargo {
        -Double totalWeight
        -Boolean hazardousMaterial
        -String cargoZone
        +validateOperation() boolean
    }

    class Boarding {
        -Integer passengerCount
        -Integer gateNumber
        -Boolean crewReady
        +validateOperation() boolean
    }

    AirportOperation <|-- Takeoff
    AirportOperation <|-- Landing
    AirportOperation <|-- Cargo
    AirportOperation <|-- Boarding
    AirportOperation ..|> Monitorable
    AirportOperation ..|> Reportable
    AirportOperation ..> Flight : flightNumber

    %% --- Flujo operativo ---
    class FlightWorkflow {
        -Long id
        -FlightWorkflowPhase phase
        -LocalDateTime nextActionAt
        -Long cargoOperationId
        -Long takeoffOperationId
        -Long landingOperationId
        -LocalDateTime updatedAt
    }

    class FlightWorkflowPhase {
        <<enumeration>>
        WAITING_SCHEDULE
        CARGO_IN_PROGRESS
        TAKEOFF_IN_PROGRESS
        IN_FLIGHT
        LANDING_IN_PROGRESS
        COMPLETED
    }

    Flight "1" --> "1" FlightWorkflow : workflow
    FlightWorkflow --> FlightWorkflowPhase : phase
    FlightWorkflow ..> Cargo : cargoOperationId
    FlightWorkflow ..> Takeoff : takeoffOperationId
    FlightWorkflow ..> Landing : landingOperationId

    %% --- Menú dinámico recursivo ---
    class MenuItem {
        -Long id
        -String label
        -String icon
        -String route
        -String requiredRole
        +findInHierarchy(targetLabel) MenuItem
    }

    MenuItem "0..*" --> "0..1" MenuItem : parent / children
```

**Notas del diagrama**
- `User` usa herencia **SINGLE_TABLE** (`Administrador`, `ControladorAereo`).
- `AirportOperation` usa herencia **JOINED** (`Takeoff`, `Landing`, `Cargo`, `Boarding`).
- `validateOperation()` es el método polimórfico central de las operaciones.
- `AirRoute` y `MenuItem` implementan estructuras recursivas en árbol.
- `FlightWorkflow` orquesta el flujo automático del vuelo y referencia operaciones por ID.

### 🧠 Implementación de POO Avanzada
- **Herencia**: Jerarquías de usuarios (`User` -> `Admin`, `Controller`) y operaciones (`AirportOperation` -> `Takeoff`, `Landing`).
- **Polimorfismo**: Método `validateOperation()` implementado de forma única en cada subclase de operación.
- **Recursividad**:
  - Árbol de rutas aéreas para cálculo de distancias totales.
  - Menú dinámico recursivo para la navegación.
- **Interfaces**: Uso de interfaces como `Monitorable`, `Reportable` y `Auditable` para herencia múltiple de comportamiento.

## 🛠️ Stack Tecnológico
### Backend
- Java 21/25 & Spring Boot 3.2.5
- Spring Security & JWT
- Spring Data JPA & PostgreSQL
- Flyway (Migraciones de DB)
- Maven

### Frontend
- Angular 19+ (Standalone Components)
- Angular Material
- RxJS & Signals (Gestión de Estado)
- Reactive Forms

## 📦 Configuración y Ejecución Local

### 1. Base de Datos

**Opción A — Docker (recomendado)**

Desde la raíz del proyecto:

```powershell
docker compose up -d
```

Esto levanta PostgreSQL en `localhost:5432` con base de datos `aircontrolpro`, usuario `postgres` y contraseña `postgres`.

**Opción B — PostgreSQL manual**

1. Crea una base de datos llamada `aircontrolpro`.
2. Usuario `postgres` / contraseña `postgres` (o define variables de entorno `SPRING_DATASOURCE_*`).
3. Flyway aplicará el esquema al iniciar el backend.

### 2. Ejecutar Backend

Abre una terminal en la carpeta `backend` y ejecuta:

```powershell
mvn spring-boot:run
```

**Perfiles de base de datos**

| Perfil | Cuándo usarlo | Conexión por defecto |
|--------|---------------|----------------------|
| `local` (por defecto) | PostgreSQL ya instalado en tu PC | `5440` / `mi_basedatos` / contraseña `123456` |
| `docker` | Tras `docker compose up -d` | `5432` / `aircontrolpro` / contraseña `postgres` |

```powershell
# Con Docker Compose
$env:SPRING_PROFILES_ACTIVE="docker"
mvn spring-boot:run
```

Si tu PostgreSQL usa otras credenciales, define variables antes de ejecutar:

```powershell
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://127.0.0.1:5432/tu_base"
$env:SPRING_DATASOURCE_PASSWORD="tu_contraseña"
mvn spring-boot:run
```

### 3. Ejecutar Frontend
1.  Abre una terminal en la carpeta `frontend`.
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Inicia la aplicación:
    ```bash
    npm start
    ```
    *La aplicación usará un proxy interno para comunicarse con `http://localhost:8080`.*

## 🔐 Seguridad
El sistema implementa seguridad basada en **JWT (JSON Web Tokens)** con:
- Autenticación sin estado.
- Roles de usuario: `ADMIN`, `CONTROLADOR`, `EMBARQUE`, `CARGA`, `OPERADOR`.
- Credenciales iniciales: **admin / admin123**.

## 🧪 Pruebas
- **Backend**: `mvn test` en la carpeta backend.
- **Frontend**: `npm test` en la carpeta frontend.

---
© 2026 AIRCONTROL PRO - Senior Software Engineering Project
