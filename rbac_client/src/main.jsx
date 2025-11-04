import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import router from './Routes/routes.jsx'
import AuthProvider from './Context/AuthProvider.jsx'
import { ApiProvider } from './Context/ApiContext.jsx'
import '@fortawesome/fontawesome-free/css/all.min.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
 <AuthProvider>
<ApiProvider>
      <RouterProvider router={router}>
   </RouterProvider>
</ApiProvider>
 </AuthProvider>
  </StrictMode>,
)
