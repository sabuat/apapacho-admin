import { useState, useEffect } from 'react'
import axios from 'axios'
import Header from './components/Header'
import Tabs from './components/Tabs'
import BooksTab from './components/tabs/BooksTab'
import ChaptersTab from './components/tabs/ChaptersTab'
import WebinarsTab from './components/tabs/WebinarsTab'
import StatsTab from './components/tabs/StatsTab'

const API_URL = import.meta.env.VITE_API_URL || 'https://3000-iofk42tnf1qwkk8m5zhyy-de4313a9.us2.manus.computer'

function App() {
  const [activeTab, setActiveTab] = useState('books')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [books, setBooks] = useState([])

  useEffect(() => {
    checkAuth()
    loadBooks()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/trpc/auth.me`)
      const userData = response.data.result?.data
      
      if (userData && userData.role === 'admin') {
        setUser(userData)
      } else {
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Auth error:', error)
      window.location.href = '/'
    } finally {
      setLoading(false)
    }
  }

  const loadBooks = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/trpc/books.list`)
      setBooks(response.data.result?.data || [])
    } catch (error) {
      console.error('Error loading books:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Cargando...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">Acceso denegado</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'books' && <BooksTab books={books} onBooksChange={loadBooks} apiUrl={API_URL} />}
        {activeTab === 'chapters' && <ChaptersTab books={books} apiUrl={API_URL} />}
        {activeTab === 'webinars' && <WebinarsTab apiUrl={API_URL} />}
        {activeTab === 'stats' && <StatsTab books={books} />}
      </main>
    </div>
  )
}

export default App
