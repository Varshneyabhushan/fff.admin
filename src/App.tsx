
import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AlbumListPage from './pages/AlbumList';
import AlbumPage from './pages/Album';
import './App.css';
import Header from './Header';
import ModelPage from './pages/ModelProfile';
import { ModelListPage } from './pages/Models';
import ErrorBoundary from './utils/resource/ErrorBoundary';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/models' element={<Header />}>
          <Route index element={<ModelListPageLoader />} />
          <Route path=':modelId'>
            <Route index element={<ModelPageLoader />} />
            <Route path='albums'>
              <Route index element={<AlbumListPage />} />
              <Route path=':albumId' element={<AlbumPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to={"/models"} />} />
      </Routes>
    </div>
  );
}

function ModelPageLoader() {
  return (
    <ErrorBoundary fallback={"error while loading model page"}>
      <Suspense fallback={"loading model page"}>
        <ModelPage />
      </Suspense>
    </ErrorBoundary>
  )
}
function ModelListPageLoader() {
  return (
    <ErrorBoundary fallback={"error while loading modellist page"}>
      <Suspense fallback={"loading modellist page"}>
        <ModelListPage />
      </Suspense>
    </ErrorBoundary>
  )
}

export default App;
