import { useState } from 'react'

export default function BooksTab({ books, setBooks }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    slug: '',
    description: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newBook = {
      id: books.length + 1,
      ...formData,
      published: true,
      chapters: 0,
    }
    setBooks([...books, newBook])
    setFormData({ title: '', author: '', slug: '', description: '' })
    alert('Libro creado correctamente')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Create Book Form */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-serif font-bold mb-6" style={{ color: '#C5A059' }}>Crear Nuevo Libro</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Título *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#C5A059' }}
                placeholder="Ej: El Viaje del Héroe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Autor *</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#C5A059' }}
                placeholder="Ej: Juan Pérez"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#C5A059' }}
                placeholder="Ej: el-viaje-del-heroe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#C5A059' }}
                placeholder="Describe el libro..."
              />
            </div>
            <button type="submit" className="w-full px-6 py-3 text-white rounded font-semibold transition hover:opacity-90" style={{ backgroundColor: '#C5A059' }}>
              Crear Libro
            </button>
          </form>
        </div>
      </div>

      {/* Books List */}
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-serif font-bold mb-6" style={{ color: '#C5A059' }}>Libros Publicados</h2>
        <div className="space-y-4">
          {books.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center py-12">
              <p className="text-gray-600">No hay libros aún. ¡Crea el primero!</p>
            </div>
          ) : (
            books.map((book) => (
              <div key={book.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-gray-900">{book.title}</h3>
                    <p className="text-sm text-gray-600">por {book.author}</p>
                  </div>
                  <span className="px-3 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">
                    ✓ Publicado
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{book.description}</p>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-blue-100 text-blue-600 rounded font-semibold hover:bg-blue-200 transition">
                    Editar
                  </button>
                  <button className="flex-1 px-4 py-2 bg-red-100 text-red-600 rounded font-semibold hover:bg-red-200 transition">
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
