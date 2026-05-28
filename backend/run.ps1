# Arranca el backend con perfil LOCAL y sin variables de entorno que rompan la conexion.
$ErrorActionPreference = "Stop"

$varsToClear = @(
    "SPRING_PROFILES_ACTIVE",
    "SPRING_DATASOURCE_URL",
    "SPRING_DATASOURCE_USERNAME",
    "SPRING_DATASOURCE_PASSWORD"
)

foreach ($name in $varsToClear) {
    Remove-Item "Env:$name" -ErrorAction SilentlyContinue
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " AIRCONTROL PRO - Backend (perfil local)" -ForegroundColor Cyan
Write-Host " PostgreSQL: 127.0.0.1:5440 / mi_basedatos" -ForegroundColor Cyan
Write-Host " Usuario: postgres  |  Password: 123456" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Si falla la contraseña, edita:" -ForegroundColor Yellow
Write-Host "  src\main\resources\application-local.properties" -ForegroundColor Yellow
Write-Host ""

# Liberar puerto 8080 si quedo una instancia anterior del backend
$on8080 = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue
if ($on8080) {
    $procIds = $on8080 | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($procId in $procIds) {
        Write-Host "Deteniendo proceso anterior en puerto 8080 (PID $procId)..." -ForegroundColor Yellow
        Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
}

$stillBusy = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue
if ($stillBusy) {
    Write-Host "ERROR: el puerto 8080 sigue ocupado. Cierra la otra terminal o ejecuta:" -ForegroundColor Red
    Write-Host "  netstat -ano | findstr :8080" -ForegroundColor Red
    Write-Host "  taskkill /PID <numero> /F" -ForegroundColor Red
    exit 1
}

# Sincroniza checksums si una migracion ya aplicada fue editada en el codigo
mvn -q flyway:repair

mvn clean spring-boot:run
