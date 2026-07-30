import { useState, useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider } from './data/store';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import CheckoutForm from './components/cart/CheckoutForm';
import ParticleBackground from './components/effects/ParticleBackground';
import Home from './pages/Home';
import Celulares from './pages/Celulares';
import Accesorios from './pages/Accesorios';
import Nosotros from './pages/Nosotros';
import AdminPage from './pages/AdminPage';

function AppContent() {
  const { pathname } = useLocation();
  const [showBadge, setShowBadge] = useState(true);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useLayoutEffect(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <ParticleBackground />
      <Navbar />
      <div className="fixed top-20 left-4 z-50 flex items-start gap-2">
        {showBadge && (
          <a
            href="https://artifactss-9895c.web.app"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-green-700/90 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur-sm hover:bg-green-700 transition-colors no-underline"
          >
            Versión demo / En venta
          </a>
        )}
        <button
          onClick={() => setShowBadge(!showBadge)}
          className="rounded-md bg-black/50 px-2 py-2 text-white shadow-lg backdrop-blur-sm hover:bg-black/70 transition-colors text-sm leading-none"
          aria-label={showBadge ? "Ocultar badge" : "Mostrar badge"}
        >
          {showBadge ? "✕" : "👁"}
        </button>
      </div>
      <main className="flex-1 pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/celulares" element={<Celulares />} />
          <Route path="/accesorios" element={<Accesorios />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      <CheckoutForm />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </BrowserRouter>
  );
}

export default App;
