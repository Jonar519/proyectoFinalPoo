# Guía de despliegue — AIRCONTROL PRO

Despliegue recomendado:

| Componente | Plataforma | URL ejemplo |
|------------|------------|-------------|
| Backend API | Render (Web Service + Docker) | `https://proyectofinalpoo.onrender.com` |
| Frontend SPA | Vercel (Static) | `https://tu-proyecto.vercel.app` |
| Base de datos | Render PostgreSQL | Oregon |

---

## Parte 1 — Base de datos (Render PostgreSQL)

Si ya tienes la BD creada, usa **Internal/External Database URL** del panel.

Datos actuales del proyecto:

- Host: `dpg-d8bpcp4m0tmc73eoea0g-a.oregon-postgres.render.com`
- Puerto: `5432`
- Base: `trabajo_final_m90z`
- Usuario: `trabajo_final_m90z_user`
- Password: (copiar desde Render → Database → Credentials)

---

## Parte 2 — Backend en Render (desde cero)

### Paso 1: Crear Web Service

1. Entra a [render.com](https://render.com) → **New +** → **Web Service**
2. Conecta GitHub y selecciona el repo `proyectoFinalPoo`
3. Configura **exactamente** así:

| Campo | Valor |
|-------|--------|
| **Name** | `aircontrol-pro-api` (o el que prefieras) |
| **Region** | `Oregon (US West)` (misma región que la BD) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime / Language** | `Docker` |
| **Instance Type** | `Free` |

### Paso 2: Build y Start (Docker)

Con runtime **Docker**, deja vacíos:

- **Build Command**: *(vacío)*
- **Start Command**: *(vacío)*

Render usará automáticamente `backend/Dockerfile`.

### Paso 3: Environment Variables

En **Environment** agrega:

| Key | Value |
|-----|--------|
| `SPRING_PROFILES_ACTIVE` | `render` |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://dpg-d8bpcp4m0tmc73eoea0g-a.oregon-postgres.render.com:5432/trabajo_final_m90z?sslmode=require` |
| `SPRING_DATASOURCE_USERNAME` | `trabajo_final_m90z_user` |
| `SPRING_DATASOURCE_PASSWORD` | *(password de Render DB)* |
| `JWT_SECRET` | *(cadena larga aleatoria, mín. 32 caracteres)* |
| `CORS_ALLOWED_ORIGIN_PATTERNS` | `http://localhost:4200,https://*.vercel.app,https://tu-proyecto.vercel.app` |

> Sustituye `https://tu-proyecto.vercel.app` por la URL real de Vercel cuando la tengas.

### Paso 4: Health Check

| Campo | Valor |
|-------|--------|
| **Health Check Path** | `/health` |

### Paso 5: Deploy

1. Click **Create Web Service**
2. Espera el build (5–10 min la primera vez)
3. Verifica en el navegador:
   - `https://TU-SERVICIO.onrender.com/` → `{"status":"UP","service":"AIRCONTROL PRO API"}`
   - `https://TU-SERVICIO.onrender.com/health` → `{"status":"UP"}`

### Alternativa: Blueprint automático

También puedes usar **New → Blueprint** y el archivo `render.yaml` de la raíz del repo.

---

## Parte 3 — Frontend en Vercel (desde cero)

### Paso 1: Importar proyecto

1. [vercel.com](https://vercel.com) → **Add New → Project**
2. Importa el mismo repo de GitHub
3. Configura:

| Campo | Valor |
|-------|--------|
| **Framework Preset** | `Other` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build:vercel` |
| **Output Directory** | `dist/frontend/browser` |
| **Install Command** | `npm install` |

> El archivo `frontend/vercel.json` ya incluye rewrites para SPA (evita 404 en `/dashboard`).

### Paso 2: Environment Variables en Vercel

| Key | Value |
|-----|--------|
| `API_BASE_URL` | `https://TU-SERVICIO.onrender.com` *(sin barra final)* |

Ejemplo: `https://proyectofinalpoo.onrender.com`

### Paso 3: Deploy

1. Click **Deploy**
2. Cuando termine, abre la URL de Vercel
3. Login: `admin` / `admin123`

### Paso 4: Actualizar CORS en Render

Después de tener la URL de Vercel, vuelve a Render → backend → **Environment** y actualiza:

`CORS_ALLOWED_ORIGIN_PATTERNS` = `http://localhost:4200,https://tu-proyecto.vercel.app,https://*.vercel.app`

Guarda y haz **Manual Deploy**.

---

## Parte 4 — Verificación final

Checklist:

- [ ] `GET https://TU-API.onrender.com/health` → `UP`
- [ ] Login en Vercel funciona
- [ ] Menú carga (llama a `/api/v1/menu`)
- [ ] Lista de vuelos carga
- [ ] No hay error CORS en consola del navegador (F12)

---

## Desarrollo local (sin cambiar producción)

**Backend local + BD Render:**

```powershell
cd backend
copy .env.render.example .env.render
# Edita .env.render con la password
.\run-render.ps1
```

**Frontend local + backend local:**

```powershell
cd frontend
npm install
npm start
```

Usa proxy (`/api` → `localhost:8080`) automáticamente.

---

## Solución de problemas

| Problema | Solución |
|----------|----------|
| `mvn: command not found` en Render | Runtime debe ser **Docker**, no Node |
| 403 al abrir URL del API | Normal en rutas protegidas; prueba `/` o `/health` |
| 404 en Vercel al recargar página | Verifica `vercel.json` y Output `dist/frontend/browser` |
| CORS error en login | Agrega tu dominio Vercel en `CORS_ALLOWED_ORIGIN_PATTERNS` |
| Cold start lento (Free) | Primera petición tarda ~30–60 s; es normal en plan free |

---

## Seguridad

- No subas contraseñas al repositorio
- Usa variables de entorno en Render y Vercel
- Rota `JWT_SECRET` y password de BD si se expusieron en chats o commits
