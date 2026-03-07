export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark flex flex-col font-sans">
      <header className="bg-brand-bg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-serif italic text-brand-dark tracking-wide">Apapacho.</h1>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mt-2">Panel Editorial</p>
          </div>
          <div className="text-right pb-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-brand-dark">Sistema de Gestión</p>
          </div>
        </div>
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <p className="text-center text-[10px] tracking-[0.2em] uppercase text-gray-400">
            © {new Date().getFullYear()} Editorial Apapacho. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}