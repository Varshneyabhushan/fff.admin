
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './Header';
import ModelPage from './ModelPage';
import { ModelListPage } from './ModelsListPage';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Header />}>
          <Route path='/models'>
            <Route index element={<ModelListPage />} />
            <Route path=':id' element={<ModelPage />} />
          </Route>
          {/* <Route path="*" element={<Redirect/>}/> */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
