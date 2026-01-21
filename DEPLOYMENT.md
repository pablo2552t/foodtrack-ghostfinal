# 🚀 Guía de Despliegue: Ghost Burger

Guía completa para desplegar tu aplicación Ghost Burger en Railway (Backend) y Vercel (Frontend).

---

## 📋 Pre-requisitos

- [ ] Cuenta de GitHub
- [ ] Código subido a GitHub
- [ ] Cuenta de Railway ([railway.app](https://railway.app))
- [ ] Cuenta de Vercel ([vercel.com](https://vercel.com))

---

## 🔧 Paso 1: Preparar el Repositorio de GitHub

### 1.1 Subir el código a GitHub

```bash
# Inicializar git (si no lo has hecho)
git init
git add .
git commit -m "Initial commit - Ghost Burger App"

# Crear repositorio en GitHub y subir
git remote add origin https://github.com/TU-USUARIO/ghost-burger.git
git branch -M main
git push -u origin main
```

### 1.2 Verificar archivos importantes

Asegúrate de que estos archivos estén en el repositorio:
- ✅ `backend/railway.json`
- ✅ `vercel.json`
- ✅ `.gitignore` (debe excluir `.env`, `node_modules`, etc.)

---

## 🚂 Paso 2: Desplegar Backend en Railway

### 2.1 Crear Nuevo Proyecto

1. Ve a [railway.app](https://railway.app)
2. Click en "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Autoriza Railway a acceder a tu GitHub
5. Selecciona el repositorio `ghost-burger`

### 2.2 Crear Base de Datos PostgreSQL

1. En tu proyecto de Railway, click en "+ New"
2. Selecciona "Database" → "PostgreSQL"
3. Railway creará automáticamente una variable `DATABASE_URL`

### 2.3 Configurar Variables de Entorno

En el dashboard de Railway, ve a "Variables" y agrega:

```env
DATABASE_URL=<Ya está creada automáticamente>
JWT_SECRET=foodtrack_jwt_secret_key_2024_secure
JWT_EXPIRES_IN=7d
PORT=3001
FRONTEND_URL=https://TU-APP.vercel.app
```

**IMPORTANTE:** Actualiza `FRONTEND_URL` después de desplegar en Vercel (Paso 3)

### 2.4 Configurar Root Directory

1. Ve a "Settings" en Railway
2. En "Root Directory", escribe: `backend`
3. Railway ahora buscará el código en la carpeta `/backend`

### 2.5 Deploy

1. Railway hará deploy automáticamente
2. Espera a que termine (2-3 minutos)
3. Copia la URL pública: `https://TU-BACKEND.up.railway.app`

### 2.6 Ejecutar Migraciones de Prisma (si es necesario)

Si las migraciones no se ejecutan automáticamente:

1. Ve a la terminal de Railway (icono de terminal)
2. Ejecuta:
```bash
npx prisma migrate deploy
npx prisma db seed  # Si tienes seed data
```

---

## ▲ Paso 3: Desplegar Frontend en Vercel

### 3.1 Crear Nuevo Proyecto

1. Ve a [vercel.com](https://vercel.com)
2. Click en "Add New" → "Project"
3. Importa tu repositorio de GitHub `ghost-burger`
4. Vercel detectará automáticamente que es un proyecto Vite

### 3.2 Configurar Variables de Entorno

En la sección "Environment Variables", agrega:

```env
VITE_API_URL=https://TU-BACKEND.up.railway.app
```

**Usa la URL que copiaste del Paso 2.5**

### 3.3 Configurar Build Settings

Vercel debería detectar automáticamente:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

Si no, configúralos manualmente.

### 3.4 Deploy

1. Click en "Deploy"
2. Espera 1-2 minutos
3. Copia tu URL de producción: `https://TU-APP.vercel.app`

---

## 🔗 Paso 4: Conectar Frontend y Backend

### 4.1 Actualizar FRONTEND_URL en Railway

1. Regresa a Railway
2. Ve a "Variables"
3. Actualiza `FRONTEND_URL` con la URL de Vercel:
   ```env
   FRONTEND_URL=https://TU-APP.vercel.app
   ```
4. Railway re-desplegará automáticamente

### 4.2 Verificar CORS

Espera 1-2 minutos y verifica que el backend acepte peticiones del frontend.

---

## ✅ Paso 5: Verificación

### 5.1 Probar la Aplicación

1. Abre tu URL de Vercel: `https://TU-APP.vercel.app`
2. Verifica que:
   - ✅ La página carga correctamente
   - ✅ Los productos se muestran (llama al backend)
   - ✅ Puedes hacer login
   - ✅ Puedes agregar productos al carrito

### 5.2 Verificar Logs

**Railway (Backend):**
1. Ve al dashboard de Railway
2. Click en "Deployments"
3. Revisa los logs en tiempo real

**Vercel (Frontend):**
1. Ve al dashboard de Vercel
2. Click en tu deployment
3. Revisa "Functions" logs

---

## 🔄 Paso 6: Actualizaciones Futuras

### Deploy Automático

Cada vez que hagas `git push`:
- ✅ Railway re-desplegará el backend automáticamente
- ✅ Vercel re-desplegará el frontend automáticamente

```bash
# Hacer cambios en el código
git add .
git commit -m "Descripción de cambios"
git push

# Railway y Vercel despliegan automáticamente
```

---

## 🐛 Troubleshooting

### Error de CORS

**Síntoma:** Frontend no puede conectarse al backend

**Solución:**
1. Verifica que `FRONTEND_URL` en Railway incluya tu URL de Vercel
2. Asegúrate de no tener `http://` y `https://` mezclados
3. Revisa los logs de Railway para errores

### Error 500 en Backend

**Síntoma:** Endpoints del backend fallan

**Posibles causas:**
1. `DATABASE_URL` no configurada
2. Migraciones de Prisma no ejecutadas
3. Variables de entorno faltantes

**Solución:**
```bash
# En Railway terminal
npx prisma migrate deploy
npx prisma generate
```

### Frontend muestra "Failed to fetch"

**Síntoma:** Productos no cargan

**Solución:**
1. Verifica `VITE_API_URL` en Vercel
2. Asegúrate de que el backend esté corriendo en Railway
3. Revisa la consola del navegador para errores

---

## 📊 Variables de Entorno - Resumen

### Railway (Backend)
```env
DATABASE_URL=<Auto-generada>
JWT_SECRET=foodtrack_jwt_secret_key_2024_secure
JWT_EXPIRES_IN=7d
PORT=3001
FRONTEND_URL=https://ghost-burger.vercel.app
```

### Vercel (Frontend)
```env
VITE_API_URL=https://ghost-burger-backend.up.railway.app
```

---

## 🎉 ¡Listo!

Tu aplicación Ghost Burger ahora está:
- ✅ Desplegada en producción
- ✅ Accesible desde cualquier lugar
- ✅ Con SSL/HTTPS automático
- ✅ Con deploy automático en cada `git push`

**URLs Finales:**
- Frontend: `https://TU-APP.vercel.app`
- Backend: `https://TU-BACKEND.up.railway.app`
- API Docs: `https://TU-BACKEND.up.railway.app/api/docs` (Swagger)

---

## 📝 Notas Adicionales

### Desarrollo Local

Tu configuración local NO se afecta. Sigue usando:

```bash
# Backend
cd backend
npm run start:dev

# Frontend
npm run dev
```

### Custom Domain (Opcional)

**Vercel:**
1. Ve a "Settings" → "Domains"
2. Agrega tu dominio personalizado
3. Configura DNS según instrucciones

**Railway:**
1. Ve a "Settings" → "Domains"
2. Agrega tu dominio backend (opcional)

---

¿Necesitas ayuda? Revisa los logs en Railway y Vercel para más detalles.
