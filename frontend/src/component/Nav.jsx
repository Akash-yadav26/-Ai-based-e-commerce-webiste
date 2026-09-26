import React, { useState } from 'react'
import logo from '../assets/logo.png'
import { CiSearch } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { IoBagOutline } from "react-icons/io5";
import { useContext } from 'react';
import { userDataContext } from '../context/UserContext';
import { IoSearch } from "react-icons/io5";
import { motion } from "framer-motion";
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authDataContext } from '../context/authcontext';
import { IoMdHome } from "react-icons/io";
import { MdOutlineCollectionsBookmark } from "react-icons/md";
import { TiContacts } from "react-icons/ti";
import { shopDataContext } from '../context/ShopContext';


function Nav() {
    let {getCurrentUser,userData} = useContext(userDataContext)
    let {serverUrl} = useContext(authDataContext)
    const {showSearch,setShowSearch,search,setSearch,getCartCount} = useContext(shopDataContext)
    const [showprofile,setShowProfile] = useState(false)
    let nevigate = useNavigate()

  const handleLogout = async()=>{
    try {
      const result = await axios.get(serverUrl + "/api/auth/logout",{withCredentials:true})
      console.log(result.data);
      getCurrentUser()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='w-[100vw] h-[70px] bg-[white] fixed top-0 flex 
     items-center justify-between px-[30px] shadow-low shadow-sm z-[999]'>
      <div className='w-[20%] lg:w-[30%] flex items-center justify-start gap-[10px] ' onClick={()=> nevigate('/')}>
         <motion.img src={logo} alt="" className='w-[60px]'
         initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{
          scale: 1.1,
        }}
      />
        
      </div>
      <div className= 'w-[50%] lg:w-[40%] hidden md:flex'>
        <ul className="flex items-center  justify-center gap-[55px] text-base font-medium">
        <li className="relative cursor-pointer hover:text-[#254D70] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-[#254D70] after:transition-all after:duration-300 hover:after:w-full"onClick={()=> nevigate("/")}>Home</li>
        <li className="relative cursor-pointer hover:text-[#254D70] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-[#254D70] after:transition-all after:duration-300 hover:after:w-full" onClick={()=> nevigate("/collections")}>COLLECTIONS</li>
        <li className="relative cursor-pointer hover:text-[#254D70] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-[#254D70] after:transition-all after:duration-300 hover:after:w-full"onClick={()=> nevigate("/about")}>ABOUT</li>
        <li className="relative cursor-pointer hover:text-[#254D70] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-[#254D70] after:transition-all after:duration-300 hover:after:w-full"onClick={()=> nevigate("/contact")}>CONTACT</li>
      </ul>

      </div>
      <div className=' w-[30%] flex items-center justify-end gap-[20px] '>
 
    {!showSearch && <CiSearch className='w-[30px] h-[38px] text-[#000000]  cursor-pointer' onClick={()=>{setShowSearch(prev=>!prev);nevigate("/collections")}} />}
    {showSearch &&   <IoSearch className='w-[30px] h-[38px] text-[#000000]  cursor-pointer' onClick={()=>setShowSearch(prev=>!prev)} />}
    {!userData && < CiUser className='w-[30px] h-[38px] text-[#000000]  cursor-pointer' onClick={()=>setShowProfile(prev=>!prev)}/>}
    {userData && <div  className='w-[30px] h-[30px] bg-[#080808] text-[white] rounded-full flex items-center justify-center
     cursor-pointer' onClick={()=>setShowProfile(prev=>!prev)}>{userData?.name.slice(0,1)}</div>}

   <IoBagOutline className='w-[30px] h-[38px] text-[#000000]  cursor-pointer hidden md:block' />
   <p className='absolute w-[18px] h-[18px] items-center  justify-center bg-black px-[5px] py-[2px] text-white rounded-full text-[9px] top-[10px] right-[23px] hidden md:block'>{getCartCount()}</p>
   </div>
  {showSearch && (
  <div className='w-full h-[80px] bg-[#DDDAD0] absolute top-full left-0 flex items-center justify-center z-[9999] shadow-lg'>
    <div className="relative w-[80%] lg:w-[50%] h-[60%]">
      <CiSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-white w-6 h-6 cursor-pointer'/>
      <input 
        type="text" 
        className='w-full h-full bg-[#555879] rounded-[30px] pl-12 pr-4 placeholder:text-white text-white text-[18px] focus:outline-none' 
        placeholder='Search Here'  onChange={(e)=>{setSearch(e.target.value)}} value={search}
      />
    </div>
  </div>
)}


   {showprofile && <div className='absolute w-[220px] h-[150px] bg-[#000000d7] top-[110%] right-[4%] border-[1px] border-[#aaa9a9] rounded-[10px] z-10'>
    <ul className='w-[100%] h-[100%] flex items-start justify-around flex-col text-[17px] py-[10px] text-[white]'>
      {!userData && <li className='w-[100%] hover:bg-[#2f2f2f]  px-[15px] py-[10px] cursor-pointer' onClick={()=>{nevigate("/login"); setShowProfile(false);}}>Login</li>}
      {userData && <li className='w-[100%] hover:bg-[#2f2f2f]  px-[15px] py-[10px] cursor-pointer'onClick={()=>{handleLogout();setShowProfile(false)}}>LogOut</li>}
      <li className='w-[100%] hover:bg-[#2f2f2f]  px-[15px] py-[10px] cursor-pointer'>Orders</li>
      <li className='w-[100%] hover:bg-[#2f2f2f]  px-[15px] py-[10px] cursor-pointer' onClick={()=>{()=>nevigate("/about");setShowProfile(false)}}>About</li>
    </ul>
   </div>}

   <div className='w-[100vw] h-[90px] flex items-center justify-between px-[20px] text-[12px]
         fixed bottom-0 left-0 bg-[#191818] md:hidden  '>
       <button className='text-[white] flex items-center justify-center flex-col gap-[2px]' > <IoMdHome  className='w-[24px] h-[28px] text-[white] md:hidden' onClick={()=> nevigate("/")} /> Home</button>
       <button className='text-[white] flex items-center justify-center flex-col gap-[2px]' > <MdOutlineCollectionsBookmark  className='w-[24px] h-[28px] text-[white] md:hidden' onClick={()=> nevigate("/collections")} /> Collections</button>
       <button className='text-[white] flex items-center justify-center flex-col gap-[2px] '> <TiContacts  className='w-[24px] h-[28px] text-[white] md:hidden' onClick={()=> nevigate("/contact")}/>Contact</button>
       <button className='text-[white] flex items-center justify-center flex-col gap-[2px]'> <IoBagOutline className='w-[24px] h-[28px] text-[white] md:hidden'onClick={()=> nevigate("/cart")}/>Cart</button>
       <p className='absolute w-[18px] h-[18px] flex items-center justify-center bg-white px-[5px] py-[2px] text-black font-semibold  rounded-full text-[9px] top-[8px] right-[18px]'>{getCartCount()}</p>
   </div>
   </div>
  )
}

export default Nav