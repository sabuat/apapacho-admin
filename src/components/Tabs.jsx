export default function Tabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'books', label: '📚 Libros' },
    { id: 'chapters', label: '📖 Capítulos' },
    { id: 'webinars', label: '🎥 Webinars' },
    { id: 'stats', label: '📊 Estadísticas' }
  ]

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex gap-8" role="tablist">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-4 font-semibold transition ${
                activeTab === tab.id
                  ? 'border-yellow-600 text-yellow-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
              role="tab"
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
