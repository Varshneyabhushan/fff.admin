
import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AlbumListPage from './AlbumListPage';
import './App.css';
import Header from './Header';
import ModelPage from './ModelPage';
import { ModelListPage } from './ModelsListPage';
import ErrorBoundary from './utils/resource/ErrorBoundary';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/models' element={<Header />}>
          <Route path='/models'>
            <Route index element={<ModelListPage />} />
            <Route path=':id'>
              <Route index element={<ModelPageLoader/>}/>
              <Route path='albums' element={<AlbumListPage/>}>
              </Route>  
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
        <ModelPage/>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App;
