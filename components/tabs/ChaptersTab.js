import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ChaptersTab({ books }) {
  const [selectedBookId, setSelectedBookId] = useState('')
  const [chapters, setChapters] = useState([])
  const [editingChapterId, setEditingChapterId] = useState(null)
  const [formData, setFormData] = useState({ title: '', content: '', chapter_number: '' })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Aquí ordenamos los libros alfabéticamente solo para la vista
  const sortedBooks = [...books].sort((a, b) => a.title.localeCompare(b.title))

  useEffect(() => {
    if (selectedBookId) fetchChapters(selectedBookId)
    else setChapters([])
  }, [selectedBookId])

  const fetchChapters = async (bookId) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('chapters').select('*').eq('book_id', bookId).order('chapter_number', { ascending: true })
      if (error) throw error
      setChapters(data || [])
    } catch (error) { console.error(error.message) }
    finally { setLoading(false) }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEdit = (chapter) => {
    setEditingChapterId(chapter.id)
    setFormData({ title: chapter.title, content: chapter.content, chapter_number: chapter.chapter_number })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedBookId) return alert('Por favor, selecciona una obra primero.')
    setSaving(true)
    const chapterData = {
      book_id: selectedBookId,
      title: formData.title,
      content: formData.content,
      chapter_number: parseInt(formData.chapter_number) || (chapters.length + 1)
    }
    try {
      if (editingChapterId) {
        const { error } = await supabase.from('chapters').update(chapterData).eq('id', editingChapterId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('chapters').insert([chapterData])
        if (error) throw error
      }
      setFormData({ title: '', content: '', chapter_number: '' })
      setEditingChapterId(null)
      fetchChapters(selectedBookId)
      alert('Capítulo guardado con éxito.')
    } catch (error) { alert(error.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if(!window.confirm('¿Eliminar este capítulo de forma permanente?')) return;
    await supabase.from('chapters').delete().eq('id', id)
    fetchChapters(selectedBookId)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-16">
      <div className="lg:w-3/5 space-y-8">
        <div>
          <label className="block text-xs font-bold uppercase tracking-[0.1em] text-gray-500 mb-3">Seleccionar Obra</label>
          <select value={selectedBookId} onChange={(e) => setSelectedBookId(e.target.value)} className="editorial-input text-lg font-serif italic cursor-pointer">
            <option value="">-- Elige un título del catálogo --</option>
            {sortedBooks.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
          </select>
        </div>

        {selectedBookId && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
            <div className="flex gap-6">
              <div className="w-32">
                <label className="block text-xs font-bold uppercase tracking-[0.1em] text-gray-500 mb-2">Capítulo Nº</label>
                <input type="number" name="chapter_number" value={formData.chapter_number} onChange={handleInputChange} className="editorial-input text-center text-lg" required />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold uppercase tracking-[0.1em] text-gray-500 mb-2">Título del Capítulo</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="editorial-input font-serif text-2xl" required />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all focus-within:ring-1 focus-within:ring-gold focus-within:border-gold">
              <textarea 
                id="chapter-content"
                name="content" 
                value={formData.content} 
                onChange={handleInputChange} 
                rows="16" 
                placeholder="Comienza a escribir tu historia aquí..."
                className="w-full p-6 bg-transparent border-none font-serif text-xl leading-relaxed text-brand-dark focus:ring-0 outline-none resize-y mt-2" 
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button disabled={saving} type="submit" className="editorial-btn w-64">
                {saving ? 'Procesando...' : (editingChapterId ? 'Actualizar Texto' : 'Guardar Capítulo')}
              </button>
              {editingChapterId && (
                <button type="button" onClick={() => {setEditingChapterId(null); setFormData({title:'', content:'', chapter_number:''})}} className="editorial-btn-outline w-40">
                  Descartar
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      <div className="lg:w-2/5">
        <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-gray-400 mb-8 pb-4 border-b border-gray-200">
          Índice
        </h2>
        {selectedBookId ? (
          <div className="flex flex-col gap-3">
            {loading ? (
              <p className="text-base text-gray-400 italic font-serif">Cargando índice...</p>
            ) : chapters.length === 0 ? (
              <p className="text-base text-gray-400 italic font-serif">Esta obra aún no tiene capítulos.</p>
            ) : (
              chapters.map((c) => (
                <div key={c.id} className="group p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col gap-2">
                  <div className="flex justify-between items-baseline">
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-gold">Capítulo {c.chapter_number}</p>
                    <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(c)} className="text-[10px] font-bold uppercase tracking-[0.1em] text-brand-dark hover:text-gold transition-colors">Editar</button>
                      <button onClick={() => handleDelete(c.id)} className="text-[10px] font-bold uppercase tracking-[0.1em] text-red-600 hover:text-red-800 transition-colors">Eliminar</button>
                    </div>
                  </div>
                  <p className="font-serif italic text-xl text-brand-dark truncate">{c.title}</p>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 border border-dashed border-gray-200 rounded-xl bg-white/50">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-gray-400">Selecciona una obra</p>
          </div>
        )}
      </div>
    </div>
  )
}