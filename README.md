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
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Build para Producción

```bash
npm run build
npm start
```

## Despliegue en Netlify

1. Sube el repositorio a GitHub
2. Conecta el repositorio en Netlify
3. Netlify detectará automáticamente la configuración de Next.js
4. El plugin de Netlify para Next.js manejará el build y deployment

## Estructura del Proyecto

```
apapacho-admin/
├── pages/
│   ├── _app.js
│   ├── _document.js
│   └── index.js
├── components/
│   ├── Layout.js
│   └── tabs/
│       ├── BooksTab.js
│       ├── ChaptersTab.js
│       ├── WebinarsTab.js
│       └── StatsTab.js
├── styles/
│   └── globals.css
├── public/
├── tailwind.config.js
├── next.config.mjs
├── postcss.config.mjs
├── jsconfig.json
└── package.json
```

## Tecnologías

- **Next.js** - Framework React
- **React** - Librería UI
- **Tailwind CSS** - Estilos
- **Playfair Display** - Tipografía serif
- **Lato** - Tipografía sans-serif

## Licencia

MIT
