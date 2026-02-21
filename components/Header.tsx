export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-serif font-bold text-gold">Apapacho Admin</h1>
            <p className="text-sm text-gray-600 mt-1">Panel de administración de contenido</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Editorial Apapacho</p>
            <p className="text-xs text-gray-500 mt-1">Literatura que te abraza</p>
          </div>
        </div>
      </div>
    </header>
  )
}
