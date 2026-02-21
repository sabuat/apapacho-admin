'use client'

import { useState } from 'react'

export default function WebinarsTab() {
  const [webinars] = useState([])

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-gold">Webinars</h2>
        <button className="btn-primary">+ Nuevo Webinar</button>
      </div>

      {webinars.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No hay webinars aún. ¡Crea el primero!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {webinars.map((webinar: any) => (
            <div key={webinar.id} className="border border-gray-200 rounded p-4">
              <h3 className="font-semibold text-gray-900">{webinar.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{webinar.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
