import { useState } from 'react'
import Head from 'next/head'
import Layout from '@/components/Layout'
import BooksTab from '@/components/tabs/BooksTab'
import ChaptersTab from '@/components/tabs/ChaptersTab'
import WebinarsTab from '@/components/tabs/WebinarsTab'
import StatsTab from '@/components/tabs/StatsTab'
import EpubTab from '@/components/tabs/EpubTab'

export default function Admin() {
  const [activeTab, setActiveTab] = useState('books')
  const [books, setBooks] = useState([])

  const tabs = [
    { id: 'books', label: 'Libros' },
    { id: 'chapters', label: 'Capítulos' },
    { id: 'webinars', label: 'Webinars' },
    { id: 'stats', label: 'Estadísticas' },
    { id: 'epub', label: 'Maquetador Sigil' },
  ]

  return (
    <>
      <Head>
        <title>Workspace | Apapacho</title>
      </Head>

      <Layout>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          
          {/* Navegación Editorial */}
          <nav className="flex flex-wrap gap-x-10 gap-y-4 border-b border-gray-200 mb-12">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 relative ${
                  activeTab === tab.id
                    ? 'text-brand-dark'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-dark"></span>
                )}
              </button>
            ))}
          </nav>

          {/* Contenido */}
          <div className="animate-fade-in">
            {activeTab === 'books' && <BooksTab books={books} setBooks={setBooks} />}
            {activeTab === 'chapters' && <ChaptersTab books={books} />}
            {activeTab === 'webinars' && <WebinarsTab />}
            {activeTab === 'stats' && <StatsTab books={books} />}
            {activeTab === 'epub' && <EpubTab />}
          </div>
        </div>
      </Layout>
    </>
  )
}