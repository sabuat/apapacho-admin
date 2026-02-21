interface Book {
  id: number
  title: string
  author: string
  slug: string
  description: string
  published: boolean
  chapters: number
}

interface ChaptersTabProps {
  books: Book[]
}

export default function ChaptersTab({ books }: ChaptersTabProps) {
  return (
    <div className="card">
      <h2 className="text-2xl font-serif font-bold text-gold mb-6">Gestionar Capítulos</h2>
      <p className="text-gray-600">Selecciona un libro para gestionar sus capítulos</p>
      
      {books.length > 0 && (
        <div className="mt-6 space-y-2">
          {books.map((book) => (
            <button
              key={book.id}
              className="w-full text-left px-4 py-3 border border-gray-200 rounded hover:bg-gray-50 transition"
            >
              <p className="font-semibold text-gray-900">{book.title}</p>
              <p className="text-sm text-gray-600">{book.chapters} capítulos</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
