import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function BooksTab({ books, setBooks }) {
  const [formData, setFormData] = useState({
    title: '', author: '', slug: '', description: '', cover_url: ''
  })
  const [coverFile, setCoverFile] = useState(null)
  const [editingId, setEditingId] = useState(null) // Para saber si estamos creando o editando
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase.from('books').select('*').order('id', { ascending: false })
      if (error) throw error
      if (data) setBooks(data)
    } catch (error) {
      console.error('Error:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0])
  }

  // Prepara el formulario para editar
  const handleEditClick = (book) => {
    setEditingId(book.id)
    setFormData({
      title: book.title, author: book.author, slug: book.slug, description: book.description, cover_url: book.cover_url || ''
    })
    setCoverFile(null) // Limpiamos el archivo seleccionado previamente
    window.scrollTo({ top: 0, behavior: 'smooth' }) // Sube la pantalla al formulario
  }

  // Cancelar edición
  const cancelEdit = () => {
    setEditingId(null)
    setFormData({ title: '', author: '', slug: '', description: '', cover_url: '' })
    setCoverFile(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      let finalCoverUrl = formData.cover_url

      // 1. Si el usuario seleccionó una imagen nueva, la subimos a Storage primero
      if (coverFile) {
        const fileExt = coverFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('covers')
          .upload(fileName, coverFile)

        if (uploadError) throw uploadError

        // Obtenemos la URL pública de la imagen
        const { data: publicUrlData } = supabase.storage
          .from('covers')
          .getPublicUrl(fileName)
          
        finalCoverUrl = publicUrlData.publicUrl
      }

      const bookData = {
        title: formData.title,
        author: formData.author,
        slug: formData.slug,
        description: formData.description,
        cover_url: finalCoverUrl,
        published: true,
      }

      // 2. Si estamos editando (Update)
      if (editingId) {
        const { error } = await supabase.from('books').update(bookData).eq('id', editingId)
        if (error) throw error
        alert('Libro actualizado correctamente')
      } 
      // 3. Si estamos creando (Insert)
      else {
        bookData.chapters = 0
        const { error } = await supabase.from('books').insert([bookData])
        if (error) throw error
        alert('Libro creado correctamente')
      }

      // Refrescamos la lista y limpiamos el formulario
      fetchBooks()
      cancelEdit()

    } catch (error) {
      console.error('Error al guardar:', error.message)
      alert('Hubo un error al guardar el libro')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if(!window.confirm('¿Seguro que quieres eliminar este libro?')) return;
    try {
      const { error } = await supabase.from('books').delete().eq('id', id)
      if (error) throw error
      setBooks(books.filter(book => book.id !== id))
    } catch (error) {
      console.error('Error:', error.message)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Formulario */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
          <h2 className="text-2xl font-serif font-bold mb-6 text-gold">
            {editingId ? 'Editar Libro' : 'Crear Nuevo Libro'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Portada del Libro</label>
              {formData.cover_url && !coverFile && (
                <img src={formData.cover_url} alt="Portada actual" className="w-32 h-auto mb-2 rounded" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-gold hover:file:bg-yellow-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Título *</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Autor *</label>
              <input type="text" name="author" value={formData.author} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Slug *</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold outline-none" placeholder="ej-mi-libro" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Descripción</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold outline-none" />
            </div>
            
            <div className="flex gap-2">
              <button disabled={saving} type="submit" className="flex-1 py-3 text-white rounded font-semibold transition bg-gold hover:opacity-90 disabled:opacity-50">
                {saving ? 'Guardando...' : (editingId ? 'Actualizar' : 'Crear')}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="flex-1 py-3 text-gray-600 bg-gray-100 rounded font-semibold hover:bg-gray-200">
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Lista de Libros */}
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-serif font-bold mb-6 text-gold">Libros Publicados</h2>
        <div className="space-y-4">
          {loading ? <p className="text-gray-500">Cargando...</p> : books.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex gap-6">
              {/* Mostramos la miniatura de la portada si existe */}
              {book.cover_url ? (
                <img src={book.cover_url} alt={book.title} className="w-24 h-36 object-cover rounded shadow-sm" />
              ) : (
                <div className="w-24 h-36 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs text-center p-2">Sin portada</div>
              )}
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-gray-900">{book.title}</h3>
                    <p className="text-sm text-gray-600">por {book.author}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{book.description}</p>
                <div className="flex gap-2 w-48">
                  <button onClick={() => handleEditClick(book)} className="flex-1 px-4 py-2 bg-blue-100 text-blue-600 rounded font-semibold hover:bg-blue-200 transition text-sm">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(book.id)} className="flex-1 px-4 py-2 bg-red-100 text-red-600 rounded font-semibold hover:bg-red-200 transition text-sm">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}