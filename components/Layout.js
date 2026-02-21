export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gold">Apapacho</h1>
              <p className="text-sm text-gray-600 mt-1">Panel de Administración</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Editorial Apapacho</p>
              <p className="text-xs text-gray-500 mt-1">Literatura que te abraza</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-gray-600">
            © 2024 Editorial Apapacho. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
