import React from 'react';
import { SectionId } from '../types';
import { MapPin, Clock, Mail, Phone } from 'lucide-react';

const Visit: React.FC = () => {
  return (
    <section id={SectionId.VISIT} className="py-24 bg-slate-900 text-slate-200 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-slate-800 to-transparent opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl font-serif text-yellow-100 mb-8">Plan Your Visit</h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">Location</h3>
                  <p className="text-slate-400">1889 Starry Lane<br/>Saint-Rémy-de-Provence, France</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">Opening Hours</h3>
                  <p className="text-slate-400">Mon - Sun: 10:00 AM - 6:00 PM<br/>Late Night Fridays until 9:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">Contact</h3>
                  <p className="text-slate-400">inquiries@vangoghvision.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-8 rounded-lg shadow-xl border border-slate-700">
            <h3 className="text-2xl font-serif text-white mb-6">Newsletter</h3>
            <p className="text-slate-400 mb-6">Subscribe to receive updates on new exhibitions and events.</p>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all outline-none"
                  placeholder="vincent@example.com"
                />
              </div>
              <button className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-semibold rounded-md transition-colors duration-300">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Vincent's Vision Gallery. All rights reserved.
        </div>
      </div>
    </section>
  );
};

export default Visit;