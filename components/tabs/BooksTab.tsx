'use client'

import { useState } from 'react'

interface Book {
  id: number
  title: string
  author: string
  slug: string
  description: string
  published: boolean
  chapters: number
}

interface BooksTabProps {
  books: Book[]
  onBooksChange: () => void
}

export default function BooksTab({ books, onBooksChange }: BooksTabProps) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    slug: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Aquí irá la lógica para crear el libro
      alert('Libro creado correctamente')
      setFormData({ title: '', author: '', slug: '', description: '' })
      onBooksChange()
    } catch (error) {
      alert('Error al crear el libro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Create Book Form */}
      <div className="lg:col-span-1">
        <div className="card">
          <h2 className="text-2xl font-serif font-bold text-gold mb-6">Crear Nuevo Libro</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Título *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="input-field"
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
                className="input-field"
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
                className="input-field"
                placeholder="Ej: el-viaje-del-heroe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="input-field"
                placeholder="Describe el libro..."
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear Libro'}
            </button>
          </form>
        </div>
      </div>

      {/* Books List */}
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-serif font-bold text-gold mb-6">Libros Publicados</h2>
        <div className="space-y-4">
          {books.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600">No hay libros aún. ¡Crea el primero!</p>
            </div>
          ) : (
            books.map((book) => (
              <div key={book.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-gray-900">{book.title}</h3>
                    <p className="text-sm text-gray-600">por {book.author}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      book.published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {book.published ? '✓ Publicado' : '⊘ Borrador'}
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
