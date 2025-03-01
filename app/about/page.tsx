export default function About() {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">About AI Tools Wiki</h1>
        <p className="text-gray-700">
          Welcome to the AI Tools Wiki! This is a community-driven platform where you can explore, 
          review, and contribute to a growing list of AI tools across various categories.
        </p>
  
        <h2 className="text-2xl font-semibold mt-6 mb-2">Our Mission</h2>
        <p className="text-gray-700">
          Our goal is to help developers, creators, and businesses find the best AI-powered tools 
          for their needs. Whether you're looking for writing assistants, video generators, 
          image enhancers, or automation tools, we have you covered.
        </p>
  
        <h2 className="text-2xl font-semibold mt-6 mb-2">How It Works</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Browse and discover AI tools by category.</li>
          <li>Read real user reviews and ratings.</li>
          <li>Submit your own AI tools and contribute to the community.</li>
        </ul>
  
        <h2 className="text-2xl font-semibold mt-6 mb-2">Get Involved</h2>
        <p className="text-gray-700">
          Do you know an AI tool that should be featured? Click the "Add New AI Tool" button 
          on the home page to submit it. Your contributions help the community stay updated 
          on the best AI technology available.
        </p>
      </div>
    );
  }
  