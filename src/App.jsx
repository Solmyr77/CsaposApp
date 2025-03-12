import Login from './Login'
import TableMenu from './TableMenu'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute'
import Provider from './Provider';
import OrdersMenu from './OrdersMenu';
import ReceiptsMenu from './ReceiptsMenu';
import GuestsMenu from './GuestsMenu';
import StockMenu from './StockMenu';
import StatisticsMenu from './StatisticsMenu'
import ExtraMenu from './ExtraMenu';

function App() {
  return (
    <HashRouter>
      <Provider>
        <Routes>

          <Route path="/tables" element={
            <ProtectedRoute isProtected={true}>
              <TableMenu />
            </ProtectedRoute>}
          />

          <Route path="/orders" element={
            <ProtectedRoute isProtected={true}>
              <OrdersMenu />
            </ProtectedRoute>}
          />

          <Route path="/receipts" element={
            <ProtectedRoute isProtected={true}>
              <ReceiptsMenu />
            </ProtectedRoute>}
          />

          <Route path="/guests" element={
            <ProtectedRoute isProtected={true}>
              <GuestsMenu />
            </ProtectedRoute>}
          />

          <Route path="/stock" element={
            <ProtectedRoute isProtected={true}>
              <StockMenu />
            </ProtectedRoute>}
          />

          <Route path="/statistics" element={
            <ProtectedRoute isProtected={true}>
              <StatisticsMenu />
            </ProtectedRoute>}
          />

          <Route path="/extra" element={
            <ProtectedRoute isProtected={true}>
              <ExtraMenu />
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
