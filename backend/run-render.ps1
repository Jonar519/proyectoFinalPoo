# Arranca el backend contra PostgreSQL en Render (perfil render).
$ErrorActionPreference = "Stop"

$envFile = Join-Path $PSScriptRoot ".env.render"
if (Test-Path $envFile) {
    Write-Host "Cargando variables desde .env.render ..." -ForegroundColor Cyan
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*#' -or $_ -match '^\s*$') { return }
        $pair = $_ -split '=', 2
        if ($pair.Length -eq 2) {
            Set-Item -Path "Env:$($pair[0].Trim())" -Value $pair[1].Trim()
        }
    }
} else {
    Write-Host "AVISO: Crea backend\.env.render desde .env.render.example" -ForegroundColor Yellow
}

if (-not $env:SPRING_DATASOURCE_PASSWORD) {
    Write-Host "ERROR: Define SPRING_DATASOURCE_PASSWORD en .env.render o en el entorno." -ForegroundColor Red
    exit 1
}

$env:SPRING_PROFILES_ACTIVE = "render"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " AIRCONTROL PRO - Backend (Render DB)" -ForegroundColor Cyan
$portLabel = if ($env:PORT) { $env:PORT } else { "8080" }
Write-Host " Perfil: render | Puerto: $portLabel" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Set-Location $PSScriptRoot
mvn -q flyway:migrate "-Dflyway.url=$env:SPRING_DATASOURCE_URL" "-Dflyway.user=$env:SPRING_DATASOURCE_USERNAME" "-Dflyway.password=$env:SPRING_DATASOURCE_PASSWORD"
mvn clean spring-boot:run
