import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function BooksTab({ books, setBooks }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    slug: '',
    description: '',
  })
  const [loading, setLoading] = useState(true)

  // 1. LEER (Read): Obtener los libros al cargar la página
  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('id', { ascending: false })

      if (error) throw error
      if (data) setBooks(data)
    } catch (error) {
      console.error('Error al cargar libros:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 2. CREAR (Create): Guardar en la base de datos
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const newBookData = {
      title: formData.title,
      author: formData.author,
      slug: formData.slug,
      description: formData.description,
      published: true,
      chapters: 0,
    }

    try {
      const { data, error } = await supabase
        .from('books')
        .insert([newBookData])
        .select() // Esto devuelve el dato insertado

      if (error) throw error

      if (data) {
        setBooks([...books, data[0]]) // Actualizamos la vista
        setFormData({ title: '', author: '', slug: '', description: '' })
        alert('Libro creado correctamente en Supabase')
      }
    } catch (error) {
      console.error('Error al crear libro:', error.message)
      alert('Hubo un error al crear el libro')
    }
  }

  // 3. ELIMINAR (Delete): Borrar de la base de datos
  const handleDelete = async (id) => {
    if(!window.confirm('¿Seguro que quieres eliminar este libro?')) return;

    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Removemos de la vista local
      setBooks(books.filter(book => book.id !== id))
    } catch (error) {
      console.error('Error al eliminar:', error.message)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Create Book Form */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-serif font-bold mb-6 text-gold">Crear Nuevo Libro</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Título *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="Describe el libro..."
              />
            </div>
            <button type="submit" className="w-full px-6 py-3 text-white rounded font-semibold transition hover:opacity-90 bg-gold">
              Crear Libro
            </button>
          </form>
        </div>
      </div>

      {/* Books List */}
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-serif font-bold mb-6 text-gold">Libros Publicados</h2>
        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-gray-500 py-12">Cargando libros desde Supabase...</p>
          ) : books.length === 0 ? (
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
                  <span className={`px-3 py-1 rounded text-xs font-semibold ${book.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {book.published ? '✓ Publicado' : 'Borrador'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{book.description}</p>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-blue-100 text-blue-600 rounded font-semibold hover:bg-blue-200 transition">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(book.id)} className="flex-1 px-4 py-2 bg-red-100 text-red-600 rounded font-semibold hover:bg-red-200 transition">
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