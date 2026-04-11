import React from 'react'
import{Routes,Route} from 'react-router-dom'
import Order from './pages/Order'
import Home from './pages/Home'
import Login from './pages/Login'
import Lists from './pages/Lists'
import Add from './pages/Add'
import { useContext } from 'react'
import { adminDataContext } from './context/AdminContext'

function App() {
  let {adminData} = useContext(adminDataContext)
  return (
    <>
    {!adminData ? <Login/> : <>
<Routes>
    
  <Route path='/' element={<Home/>}  />
  <Route path='/add' element ={<Add/>} />
  <Route path='/lists' element ={<Lists/>} />
  <Route path='/login' element ={<Login/>} />
  <Route path='/order' element ={<Order/>} />
</Routes>
    </>
}
</>
  )
}

export default App