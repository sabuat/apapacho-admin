import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ChaptersTab({ books }) {
  const [selectedBookId, setSelectedBookId] = useState('')
  const [chapters, setChapters] = useState([])
  const [editingChapterId, setEditingChapterId] = useState(null)
  const [formData, setFormData] = useState({ title: '', content: '', chapter_number: '' })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

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
    if (!selectedBookId) return alert('Selecciona un libro')
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
      alert('Guardado con éxito')
    } catch (error) { alert(error.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if(!window.confirm('¿Eliminar capítulo?')) return;
    await supabase.from('chapters').delete().eq('id', id)
    fetchChapters(selectedBookId)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Editor (60%) */}
      <div className="lg:w-[60%] space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <label className="block text-sm font-bold text-gold mb-2">Seleccionar Libro</label>
          <select value={selectedBookId} onChange={(e) => setSelectedBookId(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg mb-4">
            <option value="">-- Elige un libro --</option>
            {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
          </select>

          {selectedBookId && (
            <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
              <div className="flex gap-4">
                <input type="number" name="chapter_number" value={formData.chapter_number} onChange={handleInputChange} placeholder="Nº" className="w-20 p-2 border border-gray-300 rounded-lg" required />
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Título del Capítulo" className="flex-1 p-2 border border-gray-300 rounded-lg" required />
              </div>
              <div className="relative">
                <div className="flex gap-2 mb-1">
                  <span className="text-[10px] text-gray-400">Tips: Use &lt;b&gt;negrita&lt;/b&gt; e &lt;i&gt;cursiva&lt;/i&gt;</span>
                </div>
                <textarea name="content" value={formData.content} onChange={handleInputChange} rows="12" placeholder="Escribe aquí el contenido..." className="w-full p-4 border border-gray-300 rounded-lg font-sans leading-relaxed focus:ring-2 focus:ring-gold outline-none" />
              </div>
              <div className="flex gap-2">
                <button disabled={saving} type="submit" className="flex-1 py-3 bg-gold text-white rounded font-bold">
                  {saving ? 'Guardando...' : (editingChapterId ? 'Actualizar Capítulo' : 'Crear Capítulo')}
                </button>
                {editingChapterId && <button type="button" onClick={() => {setEditingChapterId(null); setFormData({title:'', content:'', chapter_number:''})}} className="bg-gray-100 px-4 rounded text-gray-500">Cancelar</button>}
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Lista de Capítulos (40%) */}
      <div className="lg:w-[40%]">
        <h2 className="text-xl font-serif font-bold mb-6 text-gold">Capítulos</h2>
        {selectedBookId ? (
          <div className="space-y-3">
            {loading ? <p>Cargando...</p> : chapters.map((c) => (
              <div key={c.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gold">Cap {c.chapter_number}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(c)} className="text-[10px] font-bold text-blue-600">Editar</button>
                    <button onClick={() => handleDelete(c.id)} className="text-[10px] font-bold text-red-600">Eliminar</button>
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-800 truncate">{c.title}</p>
              </div>
            ))}
          </div>
        ) : <p className="text-gray-400 text-sm">Selecciona un libro para ver la lista.</p>}
      </div>
    </div>
  )
}