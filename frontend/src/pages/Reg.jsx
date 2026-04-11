import React, { useContext, useState } from 'react'
import Logo from '../assets/logo.png'
import {useNavigate} from 'react-router-dom'
import google from '../assets/google.png'
import axios from 'axios'
import { FaEye,FaEyeSlash } from "react-icons/fa";
import { authDataContext } from '../context/Authcontext';
import { signInWithPopup } from 'firebase/auth'
import {auth,provider} from '../../utils/Firebase.js'
import { userDataContext } from '../context/UserContext.jsx'


function Reg() {
  let [show,setshow] = useState(false)
  let {serverUrl} = useContext(authDataContext)
  let[name,setName] = useState("")
  let[email,setEmail] = useState("")
  let[password,setPassword] = useState("")
  let {userdata,getCurrentUser} = useContext(userDataContext)
  let nevigate = useNavigate()
const handleSignup = async(e)=>{
  e.preventDefault()
  try {
    const result = await axios.post(serverUrl + '/api/auth/registration',{
      name,email,password
    },{withCredentials:true})
     getCurrentUser()
        nevigate("/")
    console.log(result.data)
    
  } catch (error) {
    console.log(error)
  }
}

const googleSignup = async()=>{

  try {
      const response = await signInWithPopup(auth,provider)
      let user = response.user
      let name = user.displayName
      let email = user.email
      const result = await axios.post(serverUrl + '/api/auth/googlelogin',{
       name, email
      },{withCredentials:true})
      getCurrentUser()
      nevigate("/")
      console.log(result.data)
  } catch (error) {
    console.error("googleLogin error:", error); // ✅ log actual error
  return res.status(500).json({ message: "googleLogin error", error: error.message });
        
  }

}

  return (
   <div className='w-[100vw] h-[100vh] bg-gradient-to-l from-[#c1a4a4] to-[#FFC1DA] text-white flex flex-col items-center justify-start '>
      <div className='w-[100%] h-[80px] flex items-center justify-start px-[30px] gap-[10px] cursor-pointer' onClick={()=>nevigate("/")}>
        <img className='w-[70px] ' src={Logo} alt=""/>
      </div>
      <div className='w-[100%] h-[100px] flex items-center justify-center flex-col gap-[10px]'>
        <span className='text-[25px] font-semibold text-black'>Registration Page</span>
       <span className="text-black">
  Welcome to <span className="text-pink-500">Stitchlyn</span>, Place your order
</span>
      </div>
      <div className='max-w-[600px] w-[90%] h-[500px] bg-[#EF88AD] border-[1px] border-[#96969635] backdrop:blur-2xl rounded-lg shadow-lg flex items-center justify-center '>
 <form action="" onSubmit={handleSignup} className='w-[90%] h-[90%] flex flex-col items-center justify-start gap-[20px]'>
<div className='w-[90%] h-[50px] bg-[#7D1C4A] rounded-lg flex items-center justify-center gap-[10px] py-[20px] cursor-pointer'onClick={googleSignup}>
<img className='w-[20px]' src={google}/>
Register with Google
</div>
<div className='w-[100%] h-[20px] flex items-center justify-center gap-[10px]'>
<div className='w-[40%] h-[1px] bg-[#96969635]'></div> OR <div  className='w-[40%] h-[1px] bg-[#96969635]'></div>
</div>
<div className='w-[90%] h-[400px] flex flex-col items-center justify-center gap-[15px] relative'>

  <input type='text' className='w-[100%] h-[50px] border-[2px] border-[#96969635] backdrop:blur-sm rounded-lg
   shadow-lg bg-[#7D1C4A] placeholder-[#ffffffc7] px-[20px] font-semibold'placeholder='UserName'
    required onChange={(e)=>{setName(e.target.value )}}value={name}/>


    <input type='text' className='w-[100%] h-[50px] border-[2px] border-[#96969635] backdrop:blur-sm rounded-lg 
    shadow-lg bg-[#7D1C4A] placeholder-[#ffffffc7] px-[20px] font-semibold'placeholder='Email' required
    onChange={(e)=>{setEmail(e.target.value )}}value={email}/>


    <input type={show?"text":"password"} className='w-[100%] h-[50px] border-[2px] border-[#96969635] 
    backdrop:blur-sm rounded-lg shadow-lg bg-[#7D1C4A] placeholder-[#ffffffc7] px-[20px] font-semibold'
    placeholder='Password' required onChange={(e)=>{setPassword(e.target.value )}}value={password}/>


   { !show && <FaEyeSlash className='w-[20px] h-[20px] cursor-pointer absolute right-[5%]'onClick={()=>setshow(prev => !prev)}  /> }
   { show && <FaEye className='w-[20px] h-[20px] cursor-pointer absolute right-[5%]'onClick={()=>setshow(prev => !prev)} />}

    <button className='w-[100%] h-[50px] bg-[#3A0519] rounded-lg flex
    items-center justify-center mt-[20px] text-[17px] font-semibold  '>Create Account</button>
    <p className='flex gap-[10px]'>You have any account?<span
     className='text-[#3A0519] text-[17px] font-semibold cursor-pointer'onClick={()=>nevigate("/login")}>Login</span></p>
</div>
 </form>
      </div>
    </div>
  )
}

export default Reg;