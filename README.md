# Apapacho Admin - Panel de Administración

Panel de administración web para gestionar libros, capítulos y webinars de Apapacho Reader.

## Características

- ✅ Crear y gestionar libros
- ✅ Gestionar capítulos por libro
- ✅ Gestionar webinars
- ✅ Dashboard con estadísticas
- ✅ Autenticación segura (solo admins)
- ✅ Interfaz moderna con Tailwind CSS

## Requisitos

- Node.js 16+
- npm o pnpm

## Instalación Local

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build
```

La aplicación estará disponible en `http://localhost:5173`

## Despliegue en Netlify

### Opción 1: Desde GitHub (Recomendado)

1. **Crea un repositorio en GitHub** con el nombre `apapacho-admin`
2. **Sube los archivos** a tu repositorio
3. **En Netlify:**
   - Conecta tu repositorio de GitHub
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Agrega variable de entorno: `VITE_API_URL` = `https://3000-iofk42tnf1qwkk8m5zhyy-de4313a9.us2.manus.computer`

### Opción 2: Deploy Manual

```bash
npm run build
# Sube la carpeta 'dist' a Netlify
```

## Configuración del Dominio

Para usar `admin.editorialapapacho.com`:

1. En Netlify, ve a **Domain settings**
2. Agrega un nuevo dominio personalizado: `admin.editorialapacho.com`
3. Sigue las instrucciones para configurar los registros DNS

## Variables de Entorno

Crea un archivo `.env.local`:

```
VITE_API_URL=https://tu-api-url.com
```

## Estructura del Proyecto

```
src/
├── components/
│   ├── Header.jsx
│   ├── Tabs.jsx
│   └── tabs/
│       ├── BooksTab.jsx
│       ├── ChaptersTab.jsx
│       ├── WebinarsTab.jsx
│       └── StatsTab.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## API Endpoints

El panel se conecta a los siguientes endpoints:

- `GET /api/trpc/auth.me` - Obtener usuario actual
- `POST /api/trpc/auth.logout` - Cerrar sesión
- `GET /api/trpc/books.list` - Listar libros
- `POST /api/trpc/books.create` - Crear libro
- `POST /api/trpc/books.update` - Actualizar libro
- `GET /api/trpc/chapters.getByBook` - Obtener capítulos
- `POST /api/trpc/chapters.create` - Crear capítulo
- `GET /api/trpc/webinars.list` - Listar webinars
- `POST /api/trpc/webinars.create` - Crear webinar

## Licencia

Privado - Editorial Apapacho
