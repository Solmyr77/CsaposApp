import Login from './Login'
import TableMenu from './TableMenu'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute'
import Provider from './Provider';
import OrdersMenu from './OrdersMenu';
import ReceiptsMenu from './ReceiptsMenu';
import StockMenu from './StockMenu';
import StatisticsMenu from './StatisticsMenu'
import ExtraMenu from './ExtraMenu';
import Layout from './Layout';
import TableView from './TableView';
import "./index.css";

function App() {
  return (
    <HashRouter>
      <Provider>
        <Routes>
          <Route path="/tables/:number" element={
            <ProtectedRoute isProtected={true}>
              <Layout>
                <TableView />
              </Layout>
            </ProtectedRoute>}
          />

          <Route path="/tables" element={
            <ProtectedRoute isProtected={true}>
              <Layout>
                <TableMenu />
              </Layout>
            </ProtectedRoute>}
          />

          <Route path="/orders" element={
            <ProtectedRoute isProtected={true}>
              <Layout>
                <OrdersMenu />
              </Layout>
            </ProtectedRoute>}
          />

          <Route path="/receipts" element={
            <ProtectedRoute isProtected={true}>
              <Layout>
                <ReceiptsMenu />
              </Layout>
            </ProtectedRoute>}
          />

          <Route path="/stock" element={
            <ProtectedRoute isProtected={true}>
              <Layout>
                <StockMenu />
              </Layout>
            </ProtectedRoute>}
          />

          <Route path="/statistics" element={
            <ProtectedRoute isProtected={true}>
              <Layout>
                <StatisticsMenu />
              </Layout>
            </ProtectedRoute>}
          />

          <Route path="/extra" element={
            <ProtectedRoute isProtected={true}>
              <Layout>
                <ExtraMenu />
              </Layout>
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
