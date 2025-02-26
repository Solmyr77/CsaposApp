import Main from './Main';
import Search from './Search';
import Layout from './Layout';
import Profile from './Profile';
import Provider from './Provider';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Pub from './Pub';
import Register from './Register';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import Notifications from './Notifications';
import Event from './Event';
import Tables from './Tables';
import ReserveTable from './ReserveTable';
import PubMenu from './PubMenu';
import Reservation from './Reservation';

function App() {
  return (
    <BrowserRouter>
          <Provider>
            <Routes>
              <Route path="/" element={
                <ProtectedRoute isProtected={true}>
                  <Layout />
                </ProtectedRoute>}>
                <Route index element={
                  <ProtectedRoute isProtected={true}>
                    <Main />
                  </ProtectedRoute>}/>
                <Route path="/search" element={
                  <ProtectedRoute isProtected={true}>
                    <Search />
                  </ProtectedRoute>}/>
              </Route>
              <Route path="/profile" element={
                <ProtectedRoute isProtected={true}>
                  <Profile />
                </ProtectedRoute>}/>
              <Route path="/pub/:name" element={
                <ProtectedRoute isProtected={true}>
                  <Pub />
                </ProtectedRoute>}/>
              <Route path="/notifications" element={
                <ProtectedRoute isProtected={true}>
                  <Notifications />
                </ProtectedRoute>}/>
              <Route path="/event" element={
                <ProtectedRoute isProtected={true}>
                  <Event />
                </ProtectedRoute>}/>
              <Route path="/tables/:name" element={
                <ProtectedRoute isProtected={true}>
                  <Tables />
                </ProtectedRoute>}/>
              <Route path="/reservetable/:name/table/:number" element={
                <ProtectedRoute isProtected={true}>
                  <ReserveTable />
                </ProtectedRoute>}/>
              <Route path="/reservation/:id" element={
                <ProtectedRoute isProtected={true}>
                  <Reservation />
                </ProtectedRoute>}/>
              <Route path="/pubmenu" element={
                <ProtectedRoute isProtected={true}>
                  <PubMenu />
                </ProtectedRoute>}/>
              <Route path="/register" element={
                <ProtectedRoute>
                  <Register />
                </ProtectedRoute>}/>
              <Route path="/login" element={
                <ProtectedRoute>
                  <Login />
                </ProtectedRoute>}/>
              <Route path="*" element={<Navigate to="/login"/>}/>
            </Routes>
          </Provider>
      </BrowserRouter>
  );
}

export default App;
