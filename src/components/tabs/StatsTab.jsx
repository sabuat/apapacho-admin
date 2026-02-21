export default function StatsTab({ books }) {
  const booksArray = Array.isArray(books) ? books : []
  const published = booksArray.filter(b => b.published).length
  const draft = booksArray.filter(b => !b.published).length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <p className="text-3xl font-bold text-yellow-600">{booksArray.length}</p>
        <p className="text-sm text-gray-600">Libros Totales</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <p className="text-3xl font-bold text-green-600">{published}</p>
        <p className="text-sm text-gray-600">Publicados</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <p className="text-3xl font-bold text-yellow-600">{draft}</p>
        <p className="text-sm text-gray-600">Borradores</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <p className="text-3xl font-bold text-blue-600">0</p>
        <p className="text-sm text-gray-600">Usuarios</p>
      </div>
    </div>
  )
}