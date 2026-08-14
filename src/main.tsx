import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { initMetaPixel } from './utils/metaPixel';

const GalleryPage = lazy(() => import('./pages/GalleryPage.tsx'));
const AdminLogin = lazy(() => import('./pages/AdminLogin.tsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.tsx'));

function PageLoader() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-maroon/20 border-t-maroon rounded-full animate-spin" />
    </div>
  );
}

initMetaPixel();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
);
