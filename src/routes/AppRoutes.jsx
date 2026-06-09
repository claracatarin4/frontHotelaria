import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Menu          from '../pages/Menu/Menu';
import Login         from '../pages/Login/Login';
import Cadastro      from '../pages/Cadastro/Cadastro';
import Quartos       from '../features/quarto/pages/Quartos';
import ViewQuarto    from '../features/quarto/pages/ViewQuarto';
import RegisterQuarto from '../features/quarto/pages/RegisterQuarto';

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter basename="/20261prj5/hotel">
      <Routes>
        {/* Públicas */}
        <Route path="/"         element={<Menu />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Privadas */}
        <Route path="/home" element={<PrivateRoute><Quartos /></PrivateRoute>} />

        {/* Quarto — visualizar */}
        <Route path="/quartos/:id" element={<PrivateRoute><ViewQuarto /></PrivateRoute>} />

        {/* Quarto — criar (admin) */}
        <Route path="/quartos/novo" element={<PrivateRoute><RegisterQuarto isEdit={false} /></PrivateRoute>} />

        {/* Quarto — editar (admin) */}
        <Route path="/quartos/:id/editar" element={<PrivateRoute><RegisterQuarto isEdit={true} /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
