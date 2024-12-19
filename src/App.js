import React from 'react';
import Main from './Main';
import Search from './Search';
import Layout from './Layout';
import Provider from './Provider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Main />} />
            <Route path="/search" element={<Search />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
