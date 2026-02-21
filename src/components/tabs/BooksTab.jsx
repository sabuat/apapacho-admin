import { useState } from 'react'
import axios from 'axios'

export default function BooksTab({ books, onBooksChange, apiUrl }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    slug: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post(`${apiUrl}/api/trpc/books.create`, formData)
      alert('Libro creado correctamente')
      setFormData({ title: '', author: '', slug: '', description: '' })
      onBooksChange()
    } catch (error) {
      alert('Error al crear el libro: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Create Book Form */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Crear Nuevo Libro</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Título *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Autor *</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Slug *</label>
              <input
                type="text"
                name="slug"
                placeholder="ej: mi-libro"
                value={formData.slug}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear Libro'}
            </button>
          </form>
        </div>
      </div>

      {/* Books List */}
      <div className="lg:col-span-2">
        <h2 className="text-lg font-semibold mb-4">Libros Publicados</h2>
        <div className="space-y-3">
          {books.length === 0 ? (
            <p className="text-gray-600">No hay libros aún</p>
          ) : (
            books.map(book => (
              <div key={book.id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{book.title}</h3>
                    <p className="text-sm text-gray-600">{book.author}</p>
                  </div>
                  <span className={`px-3 py-1 rounded text-xs font-semibold ${
                    book.published ? 'status-published' : 'status-draft'
                  }`}>
                    {book.published ? '✓ Publicado' : '⊘ Borrador'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-blue-100 text-blue-600 rounded text-sm font-semibold hover:bg-blue-200 transition">
                    Editar
                  </button>
                  <button className="flex-1 px-3 py-2 bg-red-100 text-red-600 rounded text-sm font-semibold hover:bg-red-200 transition">
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
