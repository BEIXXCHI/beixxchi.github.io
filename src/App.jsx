import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { PageTransition } from './components/common';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Archive from './pages/Archive';
import About from './pages/About';

// ── 路由切换时滚动到顶部 ──
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Header />
      <PageTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </PageTransition>
      <Footer />
    </HashRouter>
  );
}
