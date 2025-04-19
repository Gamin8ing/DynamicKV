// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import UserContext from './context/UserContext.jsx';
import AdminContext from './context/AdminContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserContext>
      <AdminContext>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AdminContext>
    </UserContext>
  </React.StrictMode>
);
