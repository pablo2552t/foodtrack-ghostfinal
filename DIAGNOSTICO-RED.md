# Guía de Diagnóstico - Acceso desde Otros Dispositivos

## ✅ Estado del Servidor (Tu Computadora)
Todo está configurado correctamente:
- ✅ Backend escuchando en `0.0.0.0:3001`
- ✅ Frontend escuchando en `0.0.0.0:3000`
- ✅ Reglas de Firewall activas (FoodTrack Frontend y Backend)
- ✅ IP de red configurada: `172.21.1.107`

## 🔍 Diagnóstico desde el Otro Dispositivo

### Paso 1: Verificar que están en la misma red WiFi
**En el otro dispositivo:**
1. Abre configuración de WiFi
2. Verifica que estás conectado a **LA MISMA red WiFi** que tu computadora
3. Si usas datos móviles o una red diferente, **NO FUNCIONARÁ**

### Paso 2: Verificar la IP actual de tu computadora
La IP puede cambiar. Desde tu computadora, ejecuta en PowerShell:
```powershell
ipconfig | findstr "IPv4"
```

Busca la línea que dice algo como:
```
Dirección IPv4. . . . . . . . . : 172.21.1.107
```

**Si la IP es diferente a `172.21.1.107`**, necesitas actualizar `.env.local` con la nueva IP.

### Paso 3: Probar conexión básica desde el otro dispositivo
**En el navegador del otro dispositivo:**

1. **Prueba el Frontend:**
   - Ve a: `http://172.21.1.107:3000/`
   - ¿Qué aparece? _____________

2. **Prueba el Backend:**
   - Ve a: `http://172.21.1.107:3001/products`
   - Debería mostrar JSON con productos
   - ¿Qué aparece? _____________

### Paso 4: Diagnóstico de problemas comunes

#### Problema: "No se puede acceder a este sitio" o "ERR_CONNECTION_REFUSED"
**Causas posibles:**
- ❌ No están en la misma red WiFi
- ❌ El router tiene "Aislamiento de Clientes" (AP Isolation) activado
- ❌ La IP de tu computadora cambió

**Solución para Aislamiento de Clientes:**
1. Accede a la configuración de tu router (usualmente `192.168.1.1` o `192.168.0.1`)
2. Busca opciones como:
   - "AP Isolation" → Desactívalo
   - "Client Isolation" → Desactívalo
   - "Aislamiento de cliente" → Desactívalo
3. Guarda cambios y reinicia el router

#### Problema: "Página se queda cargando infinitamente"
**Causas posibles:**
- ❌ El Frontend carga pero no puede conectar con el Backend
- ❌ El `.env.local` tiene una IP incorrecta

**Solución:**
1. Verifica la IP actual con `ipconfig`
2. Si la IP cambió, actualiza `.env.local`:
   ```
   VITE_API_URL=http://TU_IP_ACTUAL:3001
   ```
3. Reinicia el frontend (Ctrl+C y `npm run dev`)

#### Problema: "Sitio no seguro" o advertencia de seguridad
**Esto es normal.** HTTP (no HTTPS) muestra este aviso. Es seguro continuar en tu red local.

## 🧪 Prueba desde tu propia computadora
Para confirmar que todo funciona, **desde tu propia computadora** abre:
- http://172.21.1.107:3000/ (debería funcionar)
- http://localhost:3000/ (debería funcionar)

Si funciona en `172.21.1.107` desde tu PC pero NO desde otro dispositivo, el problema es:
- Router con Aislamiento de Clientes activado
- Dispositivos en redes WiFi diferentes

## 📱 Instrucciones Específicas por Dispositivo

### Desde un Teléfono Android
1. Conecta al WiFi correcto
2. Abre Chrome
3. Escribe en la barra: `172.21.1.107:3000`
4. Espera a que cargue

### Desde un iPhone/iPad
1. Conecta al WiFi correcto
2. Abre Safari
3. Escribe en la barra: `172.21.1.107:3000`
4. Si sale advertencia de seguridad, toca "Continuar de todos modos"

### Desde Otra Computadora Windows
1. Conecta al WiFi correcto
2. Abre cualquier navegador
3. Escribe: `http://172.21.1.107:3000`
4. Presiona Enter

## ⚠️ Si Nada Funciona
Prueba esto como último recurso:

1. **Desactiva temporalmente el Firewall de Windows:**
   - Ve a: Panel de Control → Sistema y Seguridad → Firewall de Windows Defender
   - Haz clic en "Activar o desactivar Firewall de Windows Defender"
   - Desactiva para "Redes privadas"
   - Prueba de nuevo desde el otro dispositivo
   - **IMPORTANTE:** Vuelve a activar el firewall después de la prueba

2. **Si funciona con firewall desactivado:**
   - El problema es la configuración del firewall
   - Puede que necesites crear reglas adicionales o hay conflictos

## 📊 Resumen de Verificación

Marca lo que has verificado:
- [ ] Ambos dispositivos en la misma red WiFi
- [ ] IP correcta en `.env.local`
- [ ] Firewall configurado (reglas activas)
- [ ] Funciona desde `172.21.1.107:3000` en tu PC
- [ ] Aislamiento de Clientes desactivado en router
- [ ] Probado en navegador del otro dispositivo

Si marcaste todo ✅ y sigue sin funcionar, puede ser un problema específico de tu configuración de red que requiere acceso al router.
