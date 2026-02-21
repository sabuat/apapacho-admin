export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Apapacho Admin</h1>
            <p className="text-sm text-gray-600 mt-1">Panel de administración de contenido</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Editorial Apapacho</p>
          </div>
        </div>
      </div>
    </header>
  )
}