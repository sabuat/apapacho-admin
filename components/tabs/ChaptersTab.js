import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, Image as ImageIcon, Loader2, Quote, Indent, MessageSquare, Mail, Smartphone, SplitSquareHorizontal } from 'lucide-react'

export default function ChaptersTab({ books }) {
  const [selectedBookId, setSelectedBookId] = useState('')
  const [chapters, setChapters] = useState([])
  const [editingChapterId, setEditingChapterId] = useState(null)
  const [formData, setFormData] = useState({ title: '', content: '', chapter_number: '' })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef(null)

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

  const insertText = (prefix, suffix = '') => {
    const textarea = document.getElementById('chapter-content')
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = formData.content
    const selectedText = text.substring(start, end)

    const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end)
    setFormData((prev) => ({ ...prev, content: newText }))

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, end + prefix.length)
    }, 0)
  }

  // Motor de inyección estructural literaria
  const applyLiteraryFormat = (type) => {
    const textarea = document.getElementById('chapter-content')
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = formData.content
    const selectedText = text.substring(start, end)
    
    let replacement = ''

    switch (type) {
      case 'dialogue':
        replacement = selectedText ? selectedText.split('\n').map(line => line.trim() === '' ? line : line.replace(/^[-–—]*\s*/, '— ')).join('\n') : '— ';
        break;
      case 'letter':
        replacement = selectedText ? selectedText.split('\n').map(line => line.trim() === '' ? line : `> ${line.replace(/^>\s*/, '')}`).join('\n') : '> ';
        break;
      case 'sms':
        replacement = `\`\`\`\n${selectedText || 'Mensaje de texto'}\n\`\`\``;
        break;
      case 'scene-break':
        replacement = start === end ? `\n\n***\n\n` : `\n\n***\n\n${selectedText}`;
        break;
      default:
        return;
    }

    const newText = text.substring(0, start) + replacement + text.substring(end)
    setFormData((prev) => ({ ...prev, content: newText }))
    
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start, start + replacement.length)
    }, 0)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage.from('covers').upload(fileName, file)
      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage.from('covers').getPublicUrl(fileName)
      const publicUrl = publicUrlData.publicUrl

      insertText(`\n![Imagen](${publicUrl})\n\n`, '')
    } catch (error) {
      alert('Error subiendo imagen: ' + error.message)
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }

  const ToolbarBtn = ({ icon, onClick, title }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="p-2 text-gray-500 hover:bg-gray-200 hover:text-brand-dark rounded transition-colors focus:outline-none"
    >
      {icon}
    </button>
  )

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

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all focus-within:ring-2 focus-within:ring-brand-gold/30 focus-within:border-brand-gold">
              
              <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap items-center gap-1">
                <ToolbarBtn onClick={() => insertText('**', '**')} icon={<Bold size={16} />} title="Negrita" />
                <ToolbarBtn onClick={() => insertText('_', '_')} icon={<Italic size={16} />} title="Cursiva" />
                <div className="w-px h-5 bg-gray-300 mx-2"></div>
                <ToolbarBtn onClick={() => insertText('### ', '')} icon={<Heading1 size={16} />} title="Título" />
                <ToolbarBtn onClick={() => insertText('#### ', '')} icon={<Heading2 size={16} />} title="Subtítulo" />
                <div className="w-px h-5 bg-gray-300 mx-2"></div>
                
                {/* Herramientas de diagramación literaria */}
                <ToolbarBtn onClick={() => applyLiteraryFormat('dialogue')} icon={<MessageSquare size={16} />} title="Diálogo (Raya)" />
                <ToolbarBtn onClick={() => applyLiteraryFormat('letter')} icon={<Mail size={16} />} title="Carta / Cita" />
                <ToolbarBtn onClick={() => applyLiteraryFormat('sms')} icon={<Smartphone size={16} />} title="SMS / Digital" />
                <ToolbarBtn onClick={() => applyLiteraryFormat('scene-break')} icon={<SplitSquareHorizontal size={16} />} title="Salto de Escena" />
                
                <div className="w-px h-5 bg-gray-300 mx-2"></div>
                
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={uploadingImage}
                  className="p-2 text-gray-500 hover:bg-gray-200 hover:text-brand-dark rounded transition-colors disabled:opacity-50 flex items-center gap-2 text-xs font-bold uppercase tracking-widest ml-auto mr-2"
                  title="Insertar Imagen"
                >
                  {uploadingImage ? <Loader2 className="animate-spin" size={16}/> : <ImageIcon size={16} />}
                  {uploadingImage ? 'Subiendo...' : 'Insertar Imagen'}
                </button>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
              </div>

              <div className="bg-gray-100 p-4 md:p-8">
                <textarea 
                  id="chapter-content"
                  name="content" 
                  value={formData.content} 
                  onChange={handleInputChange} 
                  rows="22" 
                  placeholder="Érase una vez..."
                  className="w-full max-w-3xl mx-auto block p-8 bg-white border border-transparent shadow-md rounded-sm font-serif text-lg leading-relaxed text-brand-dark focus:ring-0 outline-none resize-y" 
                />
              </div>
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
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-brand-gold">Capítulo {c.chapter_number}</p>
                    <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(c)} className="text-[10px] font-bold uppercase tracking-[0.1em] text-brand-dark hover:text-brand-gold transition-colors">Editar</button>
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