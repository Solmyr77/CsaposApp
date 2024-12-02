import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from "react-router";
import Main from './Main';
import Footer from './Footer';
import Search from './Search';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />}/>
        <Route path="/search" element={<Search />}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
