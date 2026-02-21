interface NavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const tabs = [
    { id: 'books', label: '📚 Libros' },
    { id: 'chapters', label: '📖 Capítulos' },
    { id: 'webinars', label: '🎥 Webinars' },
    { id: 'stats', label: '📊 Estadísticas' },
  ]

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {tabs.map((tab) => (
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
        </div>
      </div>
    </nav>
  )
}
