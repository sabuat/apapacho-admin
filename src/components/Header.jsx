import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://3000-iofk42tnf1qwkk8m5zhyy-de4313a9.us2.manus.computer'

export default function Header({ user }) {
  const handleLogout = async () => {
    if (confirm('¿Deseas cerrar sesión?')) {
      try {
        await axios.post(`${API_URL}/api/trpc/auth.logout`)
        window.location.href = '/'
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="serif text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="text-sm text-gray-600">Editorial Apapacho</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Bienvenido, {user?.name || 'Admin'}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
