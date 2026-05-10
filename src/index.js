import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { ShopProvider } from './context/ShopContext';
import { UiProvider } from './context/UiContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ShopProvider>
        <UiProvider>
          <App />
        </UiProvider>
      </ShopProvider>
    </BrowserRouter>
  </React.StrictMode>
);
