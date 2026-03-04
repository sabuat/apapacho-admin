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

  // Inserta Markdown (** para negrita, * para cursiva)
  const insertFormat = (symbol) => {
    const textarea = document.getElementById('chapter-content');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.content;
    const selected = text.substring(start, end);
    
    const newText = text.substring(0, start) + `${symbol}${selected}${symbol}` + text.substring(end);
    setFormData({ ...formData, content: newText });
    setTimeout(() => textarea.focus(), 10);
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
      alert('¡Guardado correctamente!')
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
      <div className="lg:w-[60%] space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <label className="block text-sm font-bold text-gold mb-2">Libro Seleccionado</label>
          <select value={selectedBookId} onChange={(e) => setSelectedBookId(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg mb-4 bg-gray-50 focus:ring-2 focus:ring-gold outline-none">
            <option value="">-- Elige un libro --</option>
            {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
          </select>

          {selectedBookId && (
            <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
              <div className="flex gap-4">
                <div className="w-24">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Nº</label>
                  <input type="number" name="chapter_number" value={formData.chapter_number} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg" required />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Título</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg" required />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400">Contenido</label>
                <div className="flex gap-2 mb-2">
                  <button type="button" onClick={() => insertFormat('**')} className="w-10 h-10 bg-gray-100 border border-gray-300 rounded font-bold hover:bg-gray-200">B</button>
                  <button type="button" onClick={() => insertFormat('*')} className="w-10 h-10 bg-gray-100 border border-gray-300 rounded italic hover:bg-gray-200">I</button>
                </div>
                <textarea 
                  id="chapter-content"
                  name="content" 
                  value={formData.content} 
                  onChange={handleInputChange} 
                  rows="14" 
                  placeholder="Escribe el texto aquí. Usa los botones para dar formato."
                  className="w-full p-4 border border-gray-300 rounded-lg font-sans leading-relaxed focus:ring-2 focus:ring-gold outline-none" 
                />
              </div>

              <div className="flex gap-2">
                <button disabled={saving} type="submit" className="flex-1 py-4 bg-gold text-white rounded-lg font-bold shadow-md hover:bg-opacity-90 transition">
                  {saving ? 'Procesando...' : (editingChapterId ? 'Actualizar' : 'Guardar Capítulo')}
                </button>
                {editingChapterId && (
                  <button type="button" onClick={() => {setEditingChapterId(null); setFormData({title:'', content:'', chapter_number:''})}} className="bg-gray-200 px-6 rounded-lg text-gray-600 font-bold">
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="lg:w-[40%]">
        <h2 className="text-xl font-serif font-bold mb-6 text-gold">Capítulos</h2>
        {selectedBookId ? (
          <div className="space-y-4">
            {loading ? <p>Cargando...</p> : chapters.map((c) => (
              <div key={c.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <p className="text-xs font-bold text-gold mb-1">Capítulo {c.chapter_number}</p>
                <p className="text-base font-bold text-gray-800 mb-4 truncate">{c.title}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(c)} className="flex-1 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded border border-blue-100 hover:bg-blue-100 transition">Editar</button>
                  <button onClick={() => handleDelete(c.id)} className="flex-1 py-2 text-sm font-bold text-red-600 bg-red-50 rounded border border-red-100 hover:bg-red-100 transition">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        ) : <div className="text-gray-400 text-center py-20 border-2 border-dashed rounded-lg">Selecciona un libro</div>}
      </div>
    </div>
  )
}