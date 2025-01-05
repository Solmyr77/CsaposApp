import React from 'react';
import Main from './Main';
import Search from './Search';
import Layout from './Layout';
import Profile from './Profile';
import Provider from './Provider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Pub from './Pub';
import Register from './Register';
import Login from './Login';

function App() {
  return (
    <Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Main />} />
            <Route path="/search" element={<Search />} />
          </Route>
          <Route path="/profile" element={<Profile />}/>
          <Route path="/pub" element={<Pub />}/>
          <Route path="/register" element={<Register />}/>
          <Route path="/login" element={<Login />}/>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
