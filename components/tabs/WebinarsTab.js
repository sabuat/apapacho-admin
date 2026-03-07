import { useState } from 'react'

export default function WebinarsTab() {
  const [webinars] = useState([])

  return (
    <div>
      <div className="flex justify-between items-center mb-10 pb-4 border-b border-gray-200">
        <h2 className="text-3xl font-serif italic text-brand-dark">Eventos y Webinars</h2>
        <button className="editorial-btn">Nuevo Webinar</button>
      </div>

      {webinars.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-lg font-serif italic text-gray-400">El calendario está libre.</p>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-gray-300 mt-3">Aún no hay webinars programados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {webinars.map((webinar) => (
            <div key={webinar.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-serif italic text-2xl text-brand-dark">{webinar.title}</h3>
              <p className="text-sm text-gray-500 mt-3 leading-relaxed">{webinar.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}