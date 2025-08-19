export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Mini Event Manager</h1>
        <p className="mb-2">Welcome to your event manager page!</p>
        <a
          href="/events"
          className="block mt-6 text-center bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 transition font-semibold"
        >
          Go to Events Page
        </a>
      </div>
    </main>
  );
}
