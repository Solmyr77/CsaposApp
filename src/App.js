import React, { useContext } from 'react';
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

function App() {
  return (
    <Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<ProtectedRoute><Main /></ProtectedRoute>}/>
            <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>}/>
          </Route>
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
          <Route path="/pub/" element={<ProtectedRoute><Pub /></ProtectedRoute>}/>
          <Route path="/register" element={<Register />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="*" element={<Navigate to="/login"/>}/>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
