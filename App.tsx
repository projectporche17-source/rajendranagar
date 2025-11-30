import React from 'react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <a href="/" className="font-extrabold text-xl tracking-tight text-slate-900">
            rajendranagar.online
          </a>
          <a 
            href="https://wa.me/916281256601"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-green-100 transition-colors"
          >
            <span className="text-lg">💬</span>
            <span className="hidden sm:inline">Contact Agent</span>
          </a>
        </div>
      </nav>

      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">Rajendra Nagar Properties</h1>
          <p className="text-lg text-slate-600 mb-8">
            The most trusted real estate platform for Rajendra Nagar. Browse verified properties with exact locations and competitive pricing.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-bold mb-2">Buy Property</h2>
              <p className="text-slate-600 mb-4">Explore our collection of verified properties in Rajendra Nagar.</p>
              <a href="#/properties" className="text-blue-600 font-semibold hover:underline">Browse Now →</a>
            </div>
            <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-bold mb-2">List Property</h2>
              <p className="text-slate-600 mb-4">Post your property and reach serious buyers directly.</p>
              <a href="#/admin" className="text-blue-600 font-semibold hover:underline">Admin Portal →</a>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-300 py-12 text-sm border-t border-slate-800 mt-auto">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">About</h3>
            <p className="text-slate-400 text-sm">The most trusted real estate platform for Rajendra Nagar with verified properties.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#/terms" className="hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <a href="tel:+916281256601" className="flex items-center gap-2 text-white hover:text-blue-400 mb-2">
              <span>📞</span> Call
            </a>
            <a href="https://wa.me/916281256601" className="flex items-center gap-2 text-white hover:text-green-400">
              <span>💬</span> WhatsApp
            </a>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-slate-600 text-xs">
          <span>&copy; {new Date().getFullYear()} Rajendra Nagar Realty</span>
        </div>
      </footer>
    </div>
  );
};

export default App;