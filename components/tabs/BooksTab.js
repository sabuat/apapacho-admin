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

  // Extraemos los géneros únicos directamente de los libros cargados
  const uniqueGenres = [...new Set(books.map(b => b.genre).filter(Boolean))].sort()

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
      alert('Operación exitosa.')
    } catch (error) {
      alert('Error: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if(!window.confirm('¿Seguro que deseas eliminar este libro del catálogo?')) return;
    try {
      const { error } = await supabase.from('books').delete().eq('id', id)
      if (error) throw error
      setBooks(books.filter(book => book.id !== id))
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-16">
      <div className="lg:w-1/2">
        <div className="sticky top-6">
          <h2 className="text-3xl font-serif italic text-brand-dark mb-8">
            {editingId ? 'Editar Obra Literaria' : 'Registrar Nueva Obra'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-3 pb-2">
              <input type="checkbox" name="published" id="published" checked={formData.published} onChange={handleInputChange} className="w-5 h-5 accent-brand-dark cursor-pointer rounded" />
              <label htmlFor="published" className="text-xs font-bold uppercase tracking-[0.1em] text-brand-dark cursor-pointer">
                Publicar inmediatamente
              </label>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.1em] text-gray-500 mb-2">Idioma</label>
                <select name="language" value={formData.language} onChange={handleInputChange} className="editorial-input cursor-pointer">
                  <option value="ES">Español</option>
                  <option value="EN">Inglés</option>
                  <option value="PT">Portugués</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.1em] text-gray-500 mb-2">Género</label>
                <input 
                  list="genre-list" 
                  name="genre" 
                  value={formData.genre} 
                  onChange={handleInputChange} 
                  placeholder="Escribe o selecciona..." 
                  className="editorial-input" 
                  autoComplete="off"
                />
                <datalist id="genre-list">
                  {uniqueGenres.map(g => (
                    <option key={g} value={g} />
                  ))}
                </datalist>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.1em] text-gray-500 mb-2">Portada del Libro</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-200 file:rounded-lg file:bg-white file:text-xs file:font-bold file:uppercase file:tracking-[0.1em] file:text-brand-dark hover:file:border-brand-dark file:transition-colors file:cursor-pointer file:shadow-sm" />
            </div>

            <div className="space-y-4 pt-2">
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} required placeholder="Título de la obra" className="editorial-input text-xl font-serif italic" />
              <input type="text" name="author" value={formData.author} onChange={handleInputChange} required placeholder="Nombre del autor" className="editorial-input" />
              <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} required placeholder="slug-de-la-obra" className="editorial-input font-mono text-sm" />
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" placeholder="Sinopsis o descripción breve..." className="editorial-input resize-y" />
            </div>

            <div className="flex gap-4 pt-4">
              <button disabled={saving} type="submit" className="editorial-btn flex-1">
                {saving ? 'Procesando...' : (editingId ? 'Guardar Cambios' : 'Crear Libro')}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="editorial-btn-outline flex-1">
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="lg:w-1/2">
        <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-gray-400 mb-8 pb-4 border-b border-gray-200">
          Catálogo Actual
        </h2>
        <div className="flex flex-col gap-2">
          {loading ? (
             <p className="text-base text-gray-400 italic font-serif">Cargando catálogo...</p>
          ) : books.length === 0 ? (
             <p className="text-base text-gray-400 italic font-serif">No hay libros registrados aún.</p>
          ) : (
            books.map((book) => (
              <div key={book.id} className="group flex gap-6 items-start p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <img src={book.cover_url || '/api/placeholder/80/120'} className="w-20 h-28 object-cover rounded-md shadow-sm" alt="Portada" />
                <div className="flex-1 min-w-0 flex flex-col justify-between h-28 py-1">
                  <div>
                    <h3 className="font-serif italic text-2xl text-brand-dark truncate leading-tight">{book.title}</h3>
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-gray-500 mt-2">{book.author}</p>
                  </div>
                  <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditClick(book)} className="text-xs font-bold uppercase tracking-[0.1em] text-brand-dark hover:text-gold transition-colors">Editar</button>
                    <span className="text-gray-200">|</span>
                    <button onClick={() => handleDelete(book.id)} className="text-xs font-bold uppercase tracking-[0.1em] text-red-600 hover:text-red-800 transition-colors">Eliminar</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}