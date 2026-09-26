import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Authcontext from './context/Authcontext.jsx'
import UserContext from './context/UserContext.jsx'
import ShopContext from './context/ShopContext.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Authcontext>
  <UserContext>
  <ShopContext> 
   <App />
   <ToastContainer />
   </ShopContext> 
   </UserContext>
   </Authcontext>
  </BrowserRouter>
   
  
)
