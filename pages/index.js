import { useState } from 'react'
import Head from 'next/head'
import Layout from '@/components/Layout'
import BooksTab from '@/components/tabs/BooksTab'
import ChaptersTab from '@/components/tabs/ChaptersTab'
import WebinarsTab from '@/components/tabs/WebinarsTab'
import StatsTab from '@/components/tabs/StatsTab'

export default function Admin() {
  const [activeTab, setActiveTab] = useState('books')
  const [books, setBooks] = useState([
    {
      id: 1,
      title: 'El Viaje del Héroe',
      author: 'Juan Pérez',
      slug: 'el-viaje-del-heroe',
      description: 'Una novela épica sobre aventura y descubrimiento',
      published: true,
      chapters: 12,
    },
  ])

  return (
    <>
      <Head>
        <title>Panel de Administración - Apapacho Reader</title>
        <meta name="description" content="Gestiona los libros, capítulos y webinars de Apapacho Reader" />
      </Head>

      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-serif font-bold text-gold">Apapacho Admin</h1>
            <p className="text-gray-600 mt-2">Panel de administración de contenido</p>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex gap-8 border-b border-gray-200 mb-8">
            {[
              { id: 'books', label: '📚 Libros' },
              { id: 'chapters', label: '📖 Capítulos' },
              { id: 'webinars', label: '🎥 Webinars' },
              { id: 'stats', label: '📊 Estadísticas' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-4 font-semibold transition ${
                  activeTab === tab.id
                    ? 'border-gold text-gold'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Tab Content */}
          <div>
            {activeTab === 'books' && <BooksTab books={books} setBooks={setBooks} />}
            {activeTab === 'chapters' && <ChaptersTab books={books} />}
            {activeTab === 'webinars' && <WebinarsTab />}
            {activeTab === 'stats' && <StatsTab books={books} />}
          </div>
        </div>
      </Layout>
    </>
  )
}
