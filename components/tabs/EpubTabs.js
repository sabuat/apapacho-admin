import { useState } from 'react';
import { Copy, Check, FileCode2 } from 'lucide-react';

export default function EpubTab() {
  const [title, setTitle] = useState('');
  const [filename, setFilename] = useState('BTM-cap01.html');
  const [rawText, setRawText] = useState('');
  const [formattedHtml, setFormattedHtml] = useState('');
  const [copied, setCopied] = useState(false);

  const generateEpubHtml = () => {
    if (!rawText.trim()) return;

    // Separa el texto por saltos de línea y elimina vacíos
    const paragraphs = rawText.split(/\n+/).filter(p => p.trim() !== '');
    let contentHtml = '';

    paragraphs.forEach((p, index) => {
      let text = p.trim();
      let innerHTML = text;

      // LÓGICA DE DIÁLOGOS: Detecta si empieza con algún tipo de guion
      if (text.startsWith('-') || text.startsWith('—') || text.startsWith('–')) {
        // Normaliza todos los guiones a raya de diálogo (Em Dash)
        let normalized = text.replace(/[-–]/g, '—');
        let segments = normalized.split('—');
        let html = '';
        
        for (let i = 1; i < segments.length; i++) {
          let seg = segments[i];
          if (i % 2 !== 0) {
            // Parte Hablada: Envuelve en <em> y mete el guion de cierre si hay narrativa después
            let hasNext = i < segments.length - 1;
            let closingDash = hasNext ? ' —' : '';
            html += `<em class="p2i">— ${seg.trim()}${closingDash}</em>`;
          } else {
            // Parte Narrativa: Elimina espacio inicial para pegarlo a la etiqueta <em>
            html += seg.replace(/^\s+/, '');
          }
        }
        innerHTML = html;
      }

      // LÓGICA DE PÁRRAFOS: El primero lleva sangría especial (.p1a), el resto (.p)
      const pClass = index === 0 ? 'p1a' : 'p';
      contentHtml += `<p class="${pClass}">${innerHTML}</p>\n\n`;
    });

    // Plantilla exacta de tu archivo XHTML
    const fullHtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"
  "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
\t<link charset="UTF-8" href="../Styles/global.css" rel="stylesheet" type="text/css"/>
\t<link charset="UTF-8" href="../Styles/textos.css" rel="stylesheet" type="text/css"/>
  <title>${filename || 'capitulo.html'}</title>
</head>

<body class="calibre3">
\t<h1 class="tit1">${title || 'Título del Capítulo'}</h1>

${contentHtml.trim()}

</body>
</html>`;

    setFormattedHtml(fullHtml);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 border-b border-gray-100 pb-6">
          <h2 className="text-3xl font-serif text-brand-dark mb-2">Maquetador Sigil</h2>
          <p className="text-sm text-gray-500 font-sans">Transforma texto plano en código XHTML respetando tu hoja de estilos editorial.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panel de Entrada */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Título (h1)</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Ej: Bestias de tierras..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-yellow-600 text-gray-800"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Archivo (&lt;title&gt;)</label>
                <input 
                  type="text" 
                  value={filename} 
                  onChange={(e) => setFilename(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-yellow-600 text-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Texto Original (Word/Docs)</label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Pega el capítulo de tu libro aquí..."
                className="w-full h-[500px] p-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-yellow-600 font-serif text-sm resize-none text-gray-800 leading-relaxed"
              />
            </div>

            <button 
              onClick={generateEpubHtml}
              className="w-full bg-slate-900 text-white py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-95"
            >
              <FileCode2 size={16} /> Generar XHTML
            </button>
          </div>

          {/* Panel de Salida */}
          <div className="flex flex-col relative h-full">
            <div className="flex justify-between items-end mb-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-yellow-600 block">Código Listo para Sigil</label>
              <button 
                onClick={handleCopy}
                disabled={!formattedHtml}
                className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-colors shadow-sm ${copied ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-white border border-gray-200 text-gray-800 hover:border-yellow-600'} disabled:opacity-50 active:scale-95`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copiado' : 'Copiar Código'}
              </button>
            </div>
            <textarea
              value={formattedHtml}
              readOnly
              className="w-full flex-grow h-[570px] p-6 border border-gray-200 rounded-xl bg-[#1E1E1E] font-mono text-[13px] text-[#D4D4D4] resize-none outline-none shadow-inner"
            />
          </div>
        </div>
      </div>
    </div>
  );
}