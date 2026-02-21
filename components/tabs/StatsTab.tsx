interface Book {
  id: number
  title: string
  author: string
  slug: string
  description: string
  published: boolean
  chapters: number
}

interface StatsTabProps {
  books: Book[]
}

export default function StatsTab({ books }: StatsTabProps) {
  const published = books.filter((b) => b.published).length
  const draft = books.filter((b) => !b.published).length
  const totalChapters = books.reduce((sum, b) => sum + b.chapters, 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="card text-center">
        <p className="text-4xl font-serif font-bold text-gold">{books.length}</p>
        <p className="text-sm text-gray-600 mt-2">Libros Totales</p>
      </div>
      <div className="card text-center">
        <p className="text-4xl font-serif font-bold text-green-600">{published}</p>
        <p className="text-sm text-gray-600 mt-2">Publicados</p>
      </div>
      <div className="card text-center">
        <p className="text-4xl font-serif font-bold text-yellow-600">{draft}</p>
        <p className="text-sm text-gray-600 mt-2">Borradores</p>
      </div>
      <div className="card text-center">
        <p className="text-4xl font-serif font-bold text-blue-600">{totalChapters}</p>
        <p className="text-sm text-gray-600 mt-2">Capítulos</p>
      </div>
    </div>
  )
}
