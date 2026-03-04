import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function BooksTab({ books, setBooks }) {
  const [formData, setFormData] = useState({
    title: '', author: '', slug: '', description: '', cover_url: '',
    published: true, language: 'ES', genre: ''
  })
  const [coverFile, setCoverFile] = useState(null)
  const [editingId, setEditingId] = useState(null)
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
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0])
  }

  const handleEditClick = (book) => {
    setEditingId(book.id)
    setFormData({
      title: book.title, author: book.author, slug: book.slug, description: book.description, 
      cover_url: book.cover_url || '', published: book.published ?? true, 
      language: book.language || 'ES', genre: book.genre || ''
    })
    setCoverFile(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData({ title: '', author: '', slug: '', description: '', cover_url: '', published: true, language: 'ES', genre: '' })
    setCoverFile(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      let finalCoverUrl = formData.cover_url
      if (coverFile) {
        const fileExt = coverFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage.from('covers').upload(fileName, coverFile)
        if (uploadError) throw uploadError
        const { data: publicUrlData } = supabase.storage.from('covers').getPublicUrl(fileName)
        finalCoverUrl = publicUrlData.publicUrl
      }

      const bookData = {
        title: formData.title,
        author: formData.author,
        slug: formData.slug,
        description: formData.description,
        cover_url: finalCoverUrl,
        published: formData.published,
        language: formData.language,
        genre: formData.genre
      }

      if (editingId) {
        const { error } = await supabase.from('books').update(bookData).eq('id', editingId)
        if (error) throw error
      } else {
        bookData.chapters = 0
        const { error } = await supabase.from('books').insert([bookData])
        if (error) throw error
      }
      fetchBooks()
      cancelEdit()
      alert('¡Operación exitosa!')
    } catch (error) {
      alert('Error: ' + error.message)
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
      alert(error.message)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-[60%]">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
          <h2 className="text-2xl font-serif font-bold mb-6 text-gold">
            {editingId ? 'Editar Libro' : 'Crear Nuevo Libro'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-100">
              <input type="checkbox" name="published" id="published" checked={formData.published} onChange={handleInputChange} className="w-4 h-4 accent-gold" />
              <label htmlFor="published" className="text-sm font-medium text-gray-700">Publicar libro inmediatamente</label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Idioma</label>
                <select name="language" value={formData.language} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gold">
                  <option value="ES">Español</option>
                  <option value="EN">Inglés</option>
                  <option value="PT">Portugués</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Género</label>
                <select name="genre" value={formData.genre} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gold">
                  <option value="">Seleccionar...</option>
                  <option value="Ficción">Ficción</option>
                  <option value="Poesía">Poesía</option>
                  <option value="Infantil">Infantil</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Portada</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-yellow-50 file:text-gold" />
            </div>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} required placeholder="Título" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            <input type="text" name="author" value={formData.author} onChange={handleInputChange} required placeholder="Autor" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} required placeholder="slug-del-libro" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" placeholder="Descripción..." className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            <div className="flex gap-2">
              <button disabled={saving} type="submit" className="flex-1 py-3 bg-gold text-white rounded font-bold hover:opacity-90 disabled:opacity-50">
                {saving ? 'Guardando...' : (editingId ? 'Actualizar' : 'Crear')}
              </button>
              {editingId && <button type="button" onClick={cancelEdit} className="px-6 py-3 bg-gray-100 text-gray-600 rounded">Cancelar</button>}
            </div>
          </form>
        </div>
      </div>

      <div className="lg:w-[40%]">
        <h2 className="text-xl font-serif font-bold mb-6 text-gold">Libros Registrados</h2>
        <div className="space-y-4">
          {loading ? <p>Cargando...</p> : books.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex gap-4 items-center">
              <img src={book.cover_url || '/api/placeholder/80/120'} className="w-16 h-24 object-cover rounded shadow-sm" alt="" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate text-base">{book.title}</h3>
                <p className="text-xs text-gray-500 mb-3">{book.author}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleEditClick(book)} className="flex-1 text-sm font-bold text-blue-600 bg-blue-50 py-2 rounded border border-blue-100 hover:bg-blue-100 transition">Editar</button>
                  <button onClick={() => handleDelete(book.id)} className="flex-1 text-sm font-bold text-red-600 bg-red-50 py-2 rounded border border-red-100 hover:bg-red-100 transition">Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}