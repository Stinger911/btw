/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './LanguageContext';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { StoryDetails } from './pages/StoryDetails';
import { Admin } from './pages/Admin';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-cyber-black text-gray-100 cyber-grid">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/story/:id" element={<StoryDetails />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } 
            />
          </Routes>
          
          <footer className="border-t border-cyber-cyan/10 bg-cyber-dark/50 py-8 text-center">
            <p className="font-mono text-xs text-gray-600 uppercase tracking-widest">
              © 2026 <a href="https://lab18.net" target="_blank">Lab18.net</a> // System.Auth.Author
            </p>
          </footer>
        </div>
      </Router>
    </LanguageProvider>
  );
}
