# FoodTrack - Test de Diagnóstico Final
# Ejecutar como Administrador

Write-Host "=== DIAGNÓSTICO FINAL - FoodTrack ===" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Mostrar estado actual
Write-Host "1. Estado actual de la red:" -ForegroundColor Yellow
Get-NetConnectionProfile | Select-Object Name, NetworkCategory
Write-Host ""

# Paso 2: Verificar puertos
Write-Host "2. Puertos escuchando:" -ForegroundColor Yellow
netstat -ano | findstr ":3000 :3001"
Write-Host ""

# Paso 3: Recrear reglas de firewall
Write-Host "3. Eliminando reglas antiguas..." -ForegroundColor Yellow
netsh advfirewall firewall delete rule name="FoodTrack Frontend" 2>$null
netsh advfirewall firewall delete rule name="FoodTrack Backend" 2>$null
Write-Host ""

Write-Host "4. Creando nuevas reglas optimizadas..." -ForegroundColor Yellow
netsh advfirewall firewall add rule name="FoodTrack Frontend" dir=in action=allow protocol=TCP localport=3000 profile=private
netsh advfirewall firewall add rule name="FoodTrack Backend" dir=in action=allow protocol=TCP localport=3001 profile=private
Write-Host ""

# Paso 4: Verificar reglas
Write-Host "5. Reglas creadas:" -ForegroundColor Green
Get-NetFirewallRule -DisplayName "FoodTrack*" | Select-Object DisplayName, Enabled, Profile, Action
Write-Host ""

Write-Host "=== DIAGNÓSTICO ALTERNATIVO ===" -ForegroundColor Magenta
Write-Host ""
Write-Host "Si aún no funciona, prueba esto:" -ForegroundColor Yellow
Write-Host ""
Write-Host "OPCIÓN A - Desactivar firewall temporalmente:" -ForegroundColor White
Write-Host "  1. Abre: Panel de Control > Firewall de Windows Defender" -ForegroundColor Gray
Write-Host "  2. Haz clic en 'Activar o desactivar Firewall de Windows Defender'" -ForegroundColor Gray
Write-Host "  3. Desactiva SOLO 'Redes privadas'" -ForegroundColor Gray
Write-Host "  4. Prueba desde el otro dispositivo" -ForegroundColor Gray
Write-Host "  5. Si funciona = el problema es el firewall" -ForegroundColor Gray
Write-Host "  6. IMPORTANTE: Vuelve a activarlo después" -ForegroundColor Red
Write-Host ""
Write-Host "OPCIÓN B - Verificar desde tu PC:" -ForegroundColor White
Write-Host "  Abre Chrome/Edge y ve a: http://172.21.1.107:3000/" -ForegroundColor Cyan
Write-Host "  Si NO funciona ni en tu propia PC = problema de configuración del servidor" -ForegroundColor Gray
Write-Host "  Si SÍ funciona en tu PC = problema de red/router" -ForegroundColor Gray
Write-Host ""

Write-Host "Presiona cualquier tecla para cerrar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
