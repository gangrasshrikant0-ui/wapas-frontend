import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import ToastProvider from './components/common/ToastProvider.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Cases from './pages/Cases.jsx';
import CaseDetails from './pages/CaseDetails.jsx';
import Documents from './pages/Documents.jsx';
import Transcription from './pages/Transcription.jsx';
import Settings from './pages/Settings.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="cases" element={<Cases />} />
          <Route path="cases/:id" element={<CaseDetails />} />
          <Route path="documents" element={<Documents />} />
          <Route path="transcription" element={<Transcription />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
}
