import Login from './Login'
import Home from './Home'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute'
import Provider from './Provider';

function App() {
  return (
    <HashRouter>
      <Provider>
        <Routes>

          <Route path="/" element={
            <ProtectedRoute isProtected={true}>
              <Home />
            </ProtectedRoute>}
          />

          <Route path="/login" element={
            <ProtectedRoute isProtected={false}>
              <Login />
            </ProtectedRoute>}
          />

          <Route path="*" element={<Navigate to="/login" />} />

        </Routes>
      </Provider>
    </HashRouter>
  )
}

export default App
