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
import Book from './Book';

function App() {
  return (
    <Provider>
      <BrowserRouter>
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
          <Route path="/book/:name" element={
            <ProtectedRoute isProtected={true}>
              <Book />
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
      </BrowserRouter>
    </Provider>
  );
}

export default App;
