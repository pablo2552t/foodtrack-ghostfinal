# FoodTrack - Configuración de Firewall
# Este script debe ejecutarse como Administrador

Write-Host "=== Configuración de Firewall para FoodTrack ===" -ForegroundColor Cyan
Write-Host ""

# Agregar regla para el Frontend (puerto 3000)
Write-Host "Agregando regla para el Frontend (puerto 3000)..." -ForegroundColor Yellow
try {
    netsh advfirewall firewall add rule name="FoodTrack Frontend" dir=in action=allow protocol=TCP localport=3000
    Write-Host "✓ Regla del Frontend agregada exitosamente" -ForegroundColor Green
} catch {
    Write-Host "✗ Error al agregar regla del Frontend" -ForegroundColor Red
}

# Agregar regla para el Backend (puerto 3001)
Write-Host "Agregando regla para el Backend (puerto 3001)..." -ForegroundColor Yellow
try {
    netsh advfirewall firewall add rule name="FoodTrack Backend" dir=in action=allow protocol=TCP localport=3001
    Write-Host "✓ Regla del Backend agregada exitosamente" -ForegroundColor Green
} catch {
    Write-Host "✗ Error al agregar regla del Backend" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Configuración completada ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ahora deberías poder acceder a la aplicación desde otros dispositivos usando:" -ForegroundColor White
Write-Host "  http://172.21.1.107:3000/" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona cualquier tecla para cerrar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
