import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ChaptersTab({ books }) {
  const [selectedBookId, setSelectedBookId] = useState('')
  const [chapters, setChapters] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    chapter_number: ''
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Cada vez que seleccionas un libro distinto, buscamos sus capítulos
  useEffect(() => {
    if (selectedBookId) {
      fetchChapters(selectedBookId)
    } else {
      setChapters([])
    }
  }, [selectedBookId])

  const fetchChapters = async (bookId) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('book_id', bookId) // Filtramos solo los capítulos del libro seleccionado
        .order('chapter_number', { ascending: true }) // Los ordenamos por número
      
      if (error) throw error
      if (data) setChapters(data)
    } catch (error) {
      console.error('Error al cargar capítulos:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedBookId) return alert('Debes seleccionar un libro primero')
    setSaving(true)

    const newChapter = {
      book_id: selectedBookId,
      title: formData.title,
      content: formData.content,
      // Si no le pones número, asume que es el siguiente en la lista
      chapter_number: parseInt(formData.chapter_number) || chapters.length + 1 
    }

    try {
      const { error } = await supabase.from('chapters').insert([newChapter])
      if (error) throw error
      
      alert('Capítulo creado correctamente')
      setFormData({ title: '', content: '', chapter_number: '' })
      fetchChapters(selectedBookId) // Refrescamos la lista
    } catch (error) {
      console.error('Error al guardar capítulo:', error.message)
      alert('Hubo un error al guardar el capítulo')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if(!window.confirm('¿Seguro que quieres eliminar este capítulo?')) return;
    try {
      const { error } = await supabase.from('chapters').delete().eq('id', id)
      if (error) throw error
      setChapters(chapters.filter(c => c.id !== id))
    } catch (error) {
      console.error('Error:', error.message)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Columna Izquierda: Selector de Libros y Formulario */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Selector de Libro */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
          <h2 className="text-xl font-serif font-bold mb-4 text-gold">Seleccionar Libro</h2>
          <select 
            value={selectedBookId} 
            onChange={(e) => setSelectedBookId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold bg-white"
          >
            <option value="">-- Elige un libro --</option>
            {books.map(book => (
              <option key={book.id} value={book.id}>{book.title}</option>
            ))}
          </select>
        </div>

        {/* Formulario de Capítulo (Solo visible si hay libro seleccionado) */}
        {selectedBookId && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-serif font-bold mb-6 text-gold">Añadir Capítulo</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-900 mb-2">Nº *</label>
                  <input type="number" name="chapter_number" value={formData.chapter_number} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold outline-none" placeholder="Ej: 1" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-900 mb-2">Título del Capítulo *</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold outline-none" placeholder="Ej: El inicio..." />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Contenido</label>
                <textarea name="content" value={formData.content} onChange={handleInputChange} rows="8" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold outline-none" placeholder="Escribe el texto del capítulo aquí..." />
              </div>
              
              <button disabled={saving} type="submit" className="w-full py-3 text-white rounded font-semibold transition bg-gold hover:opacity-90 disabled:opacity-50">
                {saving ? 'Guardando...' : 'Crear Capítulo'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Columna Derecha: Lista de Capítulos */}
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-serif font-bold mb-6 text-gold">
          {selectedBookId ? 'Capítulos del Libro' : 'Selecciona un libro para ver sus capítulos'}
        </h2>
        
        {selectedBookId && (
          <div className="space-y-4">
            {loading ? (
              <p className="text-gray-500">Cargando capítulos...</p>
            ) : chapters.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center py-12">
                <p className="text-gray-600">Este libro aún no tiene capítulos. ¡Escribe el primero!</p>
              </div>
            ) : (
              chapters.map((chapter) => (
                <div key={chapter.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-sm font-bold text-gold">Capítulo {chapter.chapter_number}</span>
                      <h3 className="text-xl font-serif font-bold text-gray-900">{chapter.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {chapter.content || 'Sin contenido'}
                  </p>
                  <div className="flex gap-2 w-48">
                    <button onClick={() => handleDelete(chapter.id)} className="flex-1 px-4 py-2 bg-red-100 text-red-600 rounded font-semibold hover:bg-red-200 transition text-sm">
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}