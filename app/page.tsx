import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-black">
        Chatbot Builder Dashboard
      </h1>
      <Link
        href="/editor"
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Go to Chatbot Editor
      </Link>
    </div>
  )
}
