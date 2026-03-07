import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function StatsTab({ books }) {
  const [stats, setStats] = useState({
    activeUsers: 0,
    totalInteractions: 0,
    mostReadBook: 'Calculando...',
    mostReadAuthor: '',
    topCountry: '-',
    avgAge: '-'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRealStats() {
      try {
        // 1. MÉTRICAS DE LECTURA Y ACTIVIDAD
        const { data: progressData } = await supabase.from('reading_progress').select('user_id, book_id')
        const { data: listData } = await supabase.from('my_list').select('user_id, book_id')
        
        const allActivity = [...(progressData || []), ...(listData || [])]
        const uniqueUsers = new Set(allActivity.map(item => item.user_id)).size

        let bookCounts = {}
        allActivity.forEach(item => {
          bookCounts[item.book_id] = (bookCounts[item.book_id] || 0) + 1
        })

        let topBookId = null
        let maxCount = 0
        for (const [id, count] of Object.entries(bookCounts)) {
          if (count > maxCount) {
            maxCount = count
            topBookId = id
          }
        }

        const topBook = books.find(b => b.id === topBookId)

        // 2. MÉTRICAS DEMOGRÁFICAS (País y Edad)
        // Pedimos solo los campos estrictamente necesarios de los perfiles
        const { data: profiles } = await supabase.from('profiles').select('country, birth_date')
        
        let topCountryName = 'Sin datos'
        let averageAgeStr = '-'

        if (profiles && profiles.length > 0) {
          // A. Calcular el país con más usuarios
          const countryCounts = {}
          let maxCountryCount = 0
          profiles.forEach(p => {
            if (p.country) {
              countryCounts[p.country] = (countryCounts[p.country] || 0) + 1
              if (countryCounts[p.country] > maxCountryCount) {
                maxCountryCount = countryCounts[p.country]
                topCountryName = p.country
              }
            }
          })

          // B. Calcular el promedio de edad usando la fecha de nacimiento
          let totalAges = 0
          let validAgesCount = 0
          profiles.forEach(p => {
            if (p.birth_date) {
              const birthDate = new Date(p.birth_date)
              const today = new Date()
              let age = today.getFullYear() - birthDate.getFullYear()
              const m = today.getMonth() - birthDate.getMonth()
              // Si aún no ha cumplido años este año, le restamos 1
              if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--
              }
              // Validamos que sea una edad lógica (mayor a 10 y menor a 100)
              if (age >= 10 && age <= 100) { 
                totalAges += age
                validAgesCount++
              }
            }
          })

          if (validAgesCount > 0) {
            averageAgeStr = Math.round(totalAges / validAgesCount) + ' años'
          }
        }

        // 3. ACTUALIZAR TODO EL ESTADO
        setStats({
          activeUsers: uniqueUsers,
          totalInteractions: allActivity.length,
          mostReadBook: topBook ? topBook.title : 'Aún sin datos',
          mostReadAuthor: topBook ? topBook.author : '',
          topCountry: topCountryName,
          avgAge: averageAgeStr
        })

      } catch (error) {
        console.error('Error al cargar estadísticas:', error)
      } finally {
        setLoading(false)
      }
    }

    if (books.length > 0) {
      fetchRealStats()
    } else {
      setLoading(false)
    }
  }, [books])

  const published = books.filter((b) => b.published).length

  return (
    <div className="space-y-12 animate-fade-in">
      
      {/* SECCIÓN 1: AUDIENCIA Y LECTURAS */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-gray-400 mb-6 pb-2 border-b border-gray-200">
          Métricas de Audiencia
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-5xl font-serif italic text-gold">{loading ? '-' : stats.activeUsers}</p>
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-gray-500 mt-4">Lectores Activos</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-5xl font-serif italic text-apapacho-blue">{loading ? '-' : stats.totalInteractions}</p>
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-gray-500 mt-4">Interacciones en App</p>
          </div>

          <div className="bg-brand-dark p-8 rounded-xl shadow-md flex flex-col justify-center border border-gray-800">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-gold mb-2">Obra Más Popular</p>
            <p className="text-2xl font-serif italic text-white leading-tight">{loading ? '-' : stats.mostReadBook}</p>
            <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400 mt-2">{stats.mostReadAuthor}</p>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: DEMOGRAFÍA (NUEVO) */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-gray-400 mb-6 pb-2 border-b border-gray-200">
          Perfil Demográfico
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center text-gold font-serif italic text-3xl">
              📍
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-gray-400 mb-1">Región Principal</p>
              <p className="text-3xl font-serif italic text-brand-dark">{loading ? '...' : stats.topCountry}</p>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 rounded-full bg-apapacho-blue/10 flex items-center justify-center text-apapacho-blue font-serif italic text-3xl">
              👥
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-gray-400 mb-1">Promedio de Edad</p>
              <p className="text-3xl font-serif italic text-brand-dark">{loading ? '...' : stats.avgAge}</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: CATÁLOGO */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-gray-400 mb-6 pb-2 border-b border-gray-200">
          Estado del Catálogo
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
            <div>
              <p className="text-4xl font-serif italic text-brand-dark">{books.length}</p>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-gray-500 mt-2">Obras Totales</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-serif italic text-gray-400">{published}</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 mt-1">Obras Públicas</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}