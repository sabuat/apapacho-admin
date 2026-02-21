'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import BooksTab from '@/components/tabs/BooksTab'
import ChaptersTab from '@/components/tabs/ChaptersTab'
import WebinarsTab from '@/components/tabs/WebinarsTab'
import StatsTab from '@/components/tabs/StatsTab'

export default function Home() {
  const [activeTab, setActiveTab] = useState('books')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBooks()
  }, [])

  const loadBooks = async () => {
    try {
      setLoading(true)
      // Simulamos datos de ejemplo
      setBooks([
        {
          id: 1,
          title: 'El Viaje del Héroe',
          author: 'Juan Pérez',
          slug: 'el-viaje-del-heroe',
          description: 'Una novela épica sobre aventura y descubrimiento',
          published: true,
          chapters: 12,
        },
        {
          id: 2,
          title: 'Historias del Corazón',
          author: 'María García',
          slug: 'historias-del-corazon',
          description: 'Relatos sobre amor, amistad y familia',
          published: true,
          chapters: 8,
        },
      ])
    } catch (error) {
      console.error('Error loading books:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
              <p className="text-gray-600 mt-4">Cargando...</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'books' && <BooksTab books={books} onBooksChange={loadBooks} />}
            {activeTab === 'chapters' && <ChaptersTab books={books} />}
            {activeTab === 'webinars' && <WebinarsTab />}
            {activeTab === 'stats' && <StatsTab books={books} />}
          </>
        )}
      </main>
    </div>
  )
}
