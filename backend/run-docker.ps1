# Arranca el backend con perfil DOCKER (requiere: docker compose up -d en la raiz del proyecto)
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

Write-Host "Perfil: docker (5432/aircontrolpro, postgres/postgres)" -ForegroundColor Cyan
mvn clean spring-boot:run "-Dspring-boot.run.profiles=docker"
