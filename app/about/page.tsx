export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">About AI Tools Wiki</h1>
      <p className="text-gray-700 mb-4">
        Welcome to <strong>AI Tools Wiki</strong> — a community-driven platform where you can explore, review,
        and contribute to a growing collection of AI tools across a wide range of categories.
      </p>

      <hr className="my-6" />

      <h2 className="text-2xl font-semibold mt-6 mb-2">🧠 Our Mission</h2>
      <p className="text-gray-700 mb-4">
        We aim to support developers, creators, educators, and businesses in discovering the best
        AI-powered tools for their needs. Whether you're searching for:
      </p>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>✍️ Writing assistants</li>
        <li>🎞️ Video generators</li>
        <li>🖼️ Image enhancers</li>
        <li>⚙️ Automation tools</li>
        <li>📊 Data or productivity apps</li>
      </ul>

      <hr className="my-6" />

      <h2 className="text-2xl font-semibold mt-6 mb-2">🔍 How It Works</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>
          <strong>Browse AI Tools</strong> — Visit the <a href="/tools" className="text-blue-600 underline">Tools page</a> to view all listings, filter by category, and sort by name or rating.
        </li>
        <li>
          <strong>Search & Filter</strong> — Use the search bar or category buttons to find exactly what you need.
        </li>
        <li>
          <strong>Read Reviews</strong> — Get insights from real users to help guide your choices.
        </li>
        <li>
          <strong>Contribute a Tool</strong> — Click the <a href="/add-tool" className="text-blue-600 underline">Add New AI Tool</a> button to share tools you've discovered.
        </li>
      </ul>

      <hr className="my-6" />

      <h2 className="text-2xl font-semibold mt-6 mb-2">🤝 Get Involved</h2>
      <p className="text-gray-700 mb-4">
        Your contributions help keep the AI Wiki community up to date!
      </p>
      <p className="text-gray-700 mb-4">
        📩 If you find a bug, have a suggestion, or want a tool added but can't do it yourself, head over to the <a href="/contact" className="text-blue-600 underline">Contact</a> page.
      </p>

      <p className="text-gray-700 font-semibold">
        Thank you for being part of the community! 🚀
      </p>
    </div>
  );
}
