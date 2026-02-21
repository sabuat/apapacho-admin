import { useState, useEffect } from 'react'
import Header from './components/Header'
import Tabs from './components/Tabs'
import BooksTab from './components/tabs/BooksTab'
import ChaptersTab from './components/tabs/ChaptersTab'
import WebinarsTab from './components/tabs/WebinarsTab'
import StatsTab from './components/tabs/StatsTab'

const API_URL = import.meta.env.VITE_API_URL || 'https://3000-iofk42tnf1qwkk8m5zhyy-de4313a9.us2.manus.computer'

function App() {
  const [activeTab, setActiveTab] = useState('books')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadBooks()
  }, [])

  const loadBooks = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Intentar cargar libros desde la API
      const response = await fetch(`${API_URL}/api/trpc/books.list?input={}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      const booksData = data.result?.data || []
      setBooks(Array.isArray(booksData) ? booksData : [])
    } catch (error) {
      console.error('Error loading books:', error)
      setError(`Error al cargar los libros: ${error.message}`)
      // Usar datos de ejemplo si hay error
      setBooks([
        {
          id: 1,
          title: 'Ejemplo de Libro',
          author: 'Autor Ejemplo',
          slug: 'ejemplo-libro',
          published: true,
          description: 'Este es un libro de ejemplo'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">{error}</p>
          </div>
        )}
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
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

export default App