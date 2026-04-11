
import React, { useContext, useState } from 'react'
import logo from '../assets/logo.png'
import { FaEye,FaEyeSlash } from "react-icons/fa";
import axios from 'axios'
import { authDataContext } from '../context/AuthContext';
import { adminDataContext } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';

function Login() {
   let [show,setshow] = useState(false)
   let[email,setEmail] = useState("")
   let[password,setPassword] = useState("")
  let {serverUrl} =  useContext(authDataContext)
  let {adminData,getAdmin} = useContext(adminDataContext)
   let nevigate = useNavigate()
const AdminLogin = async(e)=>{
   e.preventDefault() // prevent page form reload -> default behaviour of form to refersh screen after sumit it prevent form that
  try {
   const result = await  axios.post(serverUrl + "/api/auth/adminLogin",{email,password},{withCredentials:true})
    console.log(result.data);
    getAdmin()
    nevigate("/")
  }
  catch (error) {
    console.log(error)
  }
}

    return (
     <div className='w-[100vw] h-[100vh] bg-gradient-to-l from-[#c1a4a4] to-[#FFC1DA] text-white flex flex-col items-center justify-start '>
        <div className='w-[100%] h-[80px] flex items-center justify-start px-[30px] gap-[10px] cursor-pointer' >
          <img className='w-[70px] ' src={logo} alt=""/>
        </div>
        <div className='w-[100%] h-[100px] flex items-center justify-center flex-col gap-[10px]'>
          <span className='text-[25px] font-semibold text-black'>Login Page</span>
         <span className="text-black">
    Welcome to <span className="text-pink-500">Stitchlyn</span>,Login as Admin
  </span>
        </div>
        <div className='max-w-[600px] w-[90%] h-[400px] bg-[#EF88AD] border-[1px] border-[#96969635] backdrop:blur-2xl rounded-lg shadow-lg flex items-center justify-center '>
   <form action="" onSubmit={AdminLogin} className='w-[90%] h-[90%] flex flex-col items-center justify-start gap-[20px]'>
  <div className='w-[90%] h-[400px] flex flex-col items-center justify-center gap-[15px] relative'>
      <input type='text' className='w-[100%] h-[50px] border-[2px] border-[#96969635] backdrop:blur-sm rounded-lg shadow-lg bg-[#7D1C4A] placeholder-[#ffffffc7] px-[20px] font-semibold'placeholder='Email' required onChange={(e)=>setEmail(e.target.value) } value={email}/>
      <input type={show?"text":"password"} className='w-[100%] h-[50px] border-[2px] border-[#96969635] backdrop:blur-sm rounded-lg shadow-lg bg-[#7D1C4A] placeholder-[#ffffffc7] px-[20px] font-semibold'placeholder='Password' required onChange={(e)=>setPassword(e.target.value)} value={password}/>
     { !show && <FaEyeSlash className='w-[20px] h-[20px] cursor-pointer absolute right-[5%] bottom-[50%]'onClick={()=>setshow(prev => !prev)}  /> }
     { show && <FaEye className='w-[20px] h-[20px] cursor-pointer absolute right-[5%]  bottom-[50%]'onClick={()=>setshow(prev => !prev)} />}
      <button className='w-[100%] h-[50px] bg-[#3A0519] rounded-lg flex
      items-center justify-center mt-[20px] text-[17px] font-semibold  '>Login</button>
     </div>
   </form>
        </div>
      </div>
    
  )
}

export default Login