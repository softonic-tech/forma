import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { OrderProvider } from './context/OrderContext.jsx';
import './styles.css';

document.documentElement.classList.add('js');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <OrderProvider>
        <App />
      </OrderProvider>
    </BrowserRouter>
  </StrictMode>
);
