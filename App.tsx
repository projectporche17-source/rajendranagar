import React, { useEffect, useState } from 'react';
import Admin from './pages/Admin';
import Home from './pages/Home';
import AreaPage from './pages/AreaPage';
import PropertyDetail from './pages/PropertyDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Simple Router Logic
  let Component = <Home />;
  
  // Route Matching
  if (route.startsWith('#/admin')) {
    Component = <Admin />;
  } else if (route.startsWith('#/area/')) {
    const areaName = decodeURIComponent(route.replace('#/area/', ''));
    Component = <AreaPage areaName={areaName} />;
  } else if (route.startsWith('#/p/')) {
    const id = route.replace('#/p/', '');
    Component = <PropertyDetail propertyId={id} />;
  } else if (route === '#/privacy') {
    Component = <PrivacyPolicy />;
  } else if (route === '#/terms') {
    Component = <Terms />;
  } else if (route === '#/contact') {
    Component = <Contact />;
  } else {
    // Default Home
    Component = <Home />;
  }

  // Admin page manages its own layout, public pages share a layout
  if (route.startsWith('#/admin')) {
    return (
      <div className="min-h-screen bg-gray-50 text-slate-800 font-sans">
        <nav className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <a href="#/" className="font-bold text-lg tracking-tight hover:text-blue-600 transition-colors">
              rajendranagar.online
            </a>
            <div className="text-sm text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">Admin Portal</div>
          </div>
        </nav>
        <main>{Component}</main>
        <footer className="mt-12 py-6 text-center text-xs text-gray-400 border-t">
          &copy; {new Date().getFullYear()} Rajendra Nagar Realty
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col">
      {/* Public Navbar */}
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
            <span className="text-lg">💬</span>
            <span className="hidden sm:inline">Contact Agent</span>
          </a>
        </div>
      </nav>

      <main className="flex-grow">
        {Component}
      </main>
      
      <footer className="bg-slate-900 text-slate-300 py-12 text-sm border-t border-slate-800 mt-auto">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Column 1: About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">About rajendranagar.online</h3>
            <p className="text-slate-400 leading-relaxed mb-4 text-sm">
              The most trusted real estate platform for Rajendra Nagar. We list only <strong>verified properties</strong> with no public posting allowed, ensuring quality and safety.
            </p>
            <p className="text-slate-400 text-sm mb-4">
              <strong>No Brokerage:</strong> We charge a small listing fee, not a commission. We stand against fake listings and unnecessary brokerage fees.
            </p>
            <p className="text-slate-400 text-sm">
              <strong>Trusted by:</strong> Google, Microsoft, & Govt Employees.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-base">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#/" className="hover:text-white transition-colors">Home Properties</a></li>
              <li><a href="#/contact" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#/terms" className="hover:text-white transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
             <h4 className="text-white font-semibold mb-4 text-base">Get in Touch</h4>
             <p className="mb-2 text-slate-400">Call or WhatsApp us for listing or buying:</p>
             <div className="flex flex-col gap-3 items-center md:items-start">
               <a href="tel:+916281256601" className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors">
                 <span className="text-lg">📞</span>
                 <span className="font-bold">Call Now</span>
               </a>
               <a href="https://wa.me/916281256601" className="flex items-center gap-2 text-white hover:text-green-400 transition-colors">
                 <span className="text-lg">💬</span>
                 <span className="font-bold">WhatsApp Chat</span>
               </a>
             </div>
             
             <p className="mt-6 text-xs text-slate-500">
               Property Owner? <a href="#/admin" className="underline hover:text-slate-300">Admin Login</a>
             </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-slate-600 text-xs flex flex-col md:flex-row justify-between items-center gap-2">
          <span>&copy; {new Date().getFullYear()} Rajendra Nagar Realty. All rights reserved.</span>
          <span>Designed for speed and simplicity.</span>
        </div>
      </footer>
    </div>
  );
};

export default App;