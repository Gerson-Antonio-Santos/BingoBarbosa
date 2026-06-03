import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './components/Home';
import { TelaPrincipalPage } from './pages/TelaPrincipal';
import { CartelaJogadorPage } from './pages/CartelaJogador';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/TelaPrincipal" element={<TelaPrincipalPage />} />
        <Route path="/CartelaJogador" element={<CartelaJogadorPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
