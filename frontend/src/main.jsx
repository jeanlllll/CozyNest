import React from 'react';
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux';
import { store } from './store/store';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes.jsx'
import { StrictMode } from 'react';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  // </StrictMode>
)



