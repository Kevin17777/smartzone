import { useLayoutEffect } from 'react';
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
