import React from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import axios from 'axios'
import { useContext } from 'react'
import { authDataContext } from '../context/AuthContext'
import { adminDataContext } from '../context/AdminContext'

function Nav() {
    let nevigate = useNavigate()
    let {serverUrl} = useContext(authDataContext)
    let {getAdmin} = useContext(adminDataContext)
    const logOut = async()=>{
        try {
            const result = await axios.get(serverUrl + "/api/auth/logout",{withCredentials:true})
            console.log(result.data)
            getAdmin()
            nevigate('/login')
        } catch (error) {
          console.log(error)  
        }
    }
  return (
    <div className='w-[100vw] h-[70px] bg-[#dcdbdbf8] z-10 fixed top-0 flex  items-center justify-between px-[30px] overflow-x-hidden shadow-md shadow-black'>
       <div className='w-[30%]  flex items-center justify-start   gap-[10px] cursor-pointer'onClick={()=>nevigate("/")}>
       <img src={logo} alt="" className='w-[50px]'/>
      
       </div>
        <button className="bg-[#ff3f6c] hover:bg-[#e6395d] text-white font-medium py-3 px-6 rounded-md text-sm tracking-wide transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFD8D8] focus:ring-opacity-50 cursor-pointer" onClick={logOut}>
  LogOut
</button>
    </div>
  )
}

export default Nav