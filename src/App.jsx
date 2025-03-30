import Login from './Login'
import TableMenu from './TableMenu'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute'
import Provider from './Provider';
import OrdersMenu from './OrdersMenu';
import StockMenu from './StockMenu';
import StatisticsMenu from './StatisticsMenu'
import ExtraMenu from './ExtraMenu';
import Layout from './Layout';
import TableView from './TableView';
import "./index.css";
import { TableProvider } from './TableProvider';
import ProductsMenu from './ProductsMenu';

function App() {
  return (
    <HashRouter>
      <Provider>
        <TableProvider> 
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

            <Route path="/products" element={
              <ProtectedRoute isProtected={true}>
                <Layout>
                  <ProductsMenu />
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
        </TableProvider>
      </Provider>
    </HashRouter>
  )
}

export default App
