import React, { useState } from 'react';

interface Property {
  id: string;
  title: string;
  price: string;
  area: string;
  size: string;
  image?: string;
}

const App: React.FC = () => {
  const [properties] = useState<Property[]>([
    {
      id: '1',
      title: '3BHK Apartment - Kismatpur',
      price: '₹1.25 Cr',
      area: 'Kismatpur',
      size: '1670 SqFt',
      image: 'https://via.placeholder.com/400x300?text=Property+1'
    },
    {
      id: '2',
      title: '2BHK Villa - Madhapur',
      price: '₹85 Lakhs',
      area: 'Madhapur',
      size: '1200 SqFt',
      image: 'https://via.placeholder.com/400x300?text=Property+2'
    },
    {
      id: '3',
      title: '4BHK House - Rajendranagar',
      price: '₹2.5 Cr',
      area: 'Rajendranagar',
      size: '2500 SqFt',
      image: 'https://via.placeholder.com/400x300?text=Property+3'
    }
  ]);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <a href="#/" className="font-extrabold text-xl tracking-tight text-slate-900">
            rajendranagar.online
          </a>
          <a 
            href="https://wa.me/916281256601"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-green-100 transition-colors"
          >
            <span>💬</span>
            <span className="hidden sm:inline">Contact Agent</span>
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">Rajendra Nagar Properties</h1>
            <p className="text-xl text-slate-300 mb-8">Find your dream property in Rajendra Nagar with verified listings and exact locations.</p>
            <div className="flex gap-4 justify-center">
              <a href="#/properties" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">Browse Properties</a>
              <a href="https://wa.me/916281256601" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">List Your Property</a>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8">Featured Properties</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-48 object-cover bg-gray-200"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{property.title}</h3>
                  <p className="text-2xl font-bold text-blue-600 mb-2">{property.price}</p>
                  <div className="space-y-1 text-sm text-slate-600">
                    <p>📍 {property.area}</p>
                    <p>📏 {property.size}</p>
                  </div>
                  <a href={`#/p/${property.id}`} className="block mt-4 text-center bg-blue-50 text-blue-600 font-semibold py-2 rounded hover:bg-blue-100 transition-colors">
                    View Details
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-slate-50 py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">✓</div>
                <h3 className="font-bold mb-2">Verified Properties</h3>
                <p className="text-sm text-slate-600">Only genuine, verified listings</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">📍</div>
                <h3 className="font-bold mb-2">Exact Locations</h3>
                <p className="text-sm text-slate-600">Google Maps integration for accuracy</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="font-bold mb-2">Ultra Fast</h3>
                <p className="text-sm text-slate-600">Lightning-fast loading speeds</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">💰</div>
                <h3 className="font-bold mb-2">No Brokerage</h3>
                <p className="text-sm text-slate-600">Direct seller contact only</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-4 border-t border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold text-lg mb-4">About</h4>
              <p className="text-sm">The most trusted real estate platform for Rajendra Nagar with verified properties and exact locations.</p>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#/terms" className="hover:text-white transition-colors">Terms & Conditions</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Contact</h4>
              <div className="space-y-2 text-sm">
                <a href="tel:+916281256601" className="flex items-center gap-2 hover:text-white transition-colors">
                  <span>📞</span> +91-628-125-6601
                </a>
                <a href="https://wa.me/916281256601" className="flex items-center gap-2 hover:text-white transition-colors">
                  <span>💬</span> WhatsApp
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-xs">
            <p>&copy; {new Date().getFullYear()} Rajendra Nagar Realty. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;