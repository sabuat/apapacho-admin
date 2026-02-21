# Apapacho Admin Panel

Panel de administración para Apapacho Reader construido con Next.js, React y Tailwind CSS.

## Características

- 📚 Gestión de libros
- 📖 Gestión de capítulos
- 🎥 Gestión de webinars
- 📊 Dashboard con estadísticas
- 🎨 Diseño responsivo con Tailwind CSS
- 📱 Compatible con dispositivos móviles

## Requisitos

- Node.js 18+
- npm o pnpm

## Instalación

```bash
npm install
# o
pnpm install
```

## Desarrollo

```bash
npm run dev
# o
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Build para Producción

```bash
npm run build
npm start
# o
pnpm build
pnpm start
```

## Despliegue en Netlify

1. Sube el repositorio a GitHub
2. Conecta el repositorio en Netlify
3. Configura:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Agrega el plugin de Netlify para Next.js en `netlify.toml`

## Estructura del Proyecto

```
apapacho-admin/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Header.tsx
│   ├── Navigation.tsx
│   └── tabs/
│       ├── BooksTab.tsx
│       ├── ChaptersTab.tsx
│       ├── WebinarsTab.tsx
│       └── StatsTab.tsx
├── public/
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## Tecnologías

- **Next.js** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Playfair Display** - Tipografía serif
- **Lato** - Tipografía sans-serif

## Licencia

MIT
