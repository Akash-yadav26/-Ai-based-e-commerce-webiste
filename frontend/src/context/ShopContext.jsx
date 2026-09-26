import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext} from './Authcontext'
import axios from 'axios'
import { userDataContext } from './UserContext.jsx'
import { FaSadCry } from 'react-icons/fa'
export const shopDataContext = createContext()
function ShopContext({children}) {
 let [products,setProducts] = useState([])
 let {serverUrl} = useContext(authDataContext)
 let {userData} = useContext(userDataContext)
 let [cartItem,setCartItem] = useState({});
 let [search,setSearch] = useState('')
 let [showSearch,setShowSearch] = useState(false)
 let [loading,setLoading] = useState(false)
 let currency = "₹";
 let delivery_fee = 40;

 // Load cart from localStorage on component mount
 useEffect(() => {
   const savedCart = JSON.parse(localStorage.getItem('cartItem') || '{}');
   setCartItem(savedCart);
 }, []);

 // Save cart to localStorage whenever cartItem changes
 useEffect(() => {
   localStorage.setItem('cartItem', JSON.stringify(cartItem));
 }, [cartItem]);

 const getProducts = async ()=>{
    try {
        let result =  await axios.get(serverUrl + "/api/product/list")
        console.log(result.data);
        setProducts(result.data)
    } catch (error) {
       console.log(error) 
    }
 }

    const addtoCart = async (itemId , size) => {
       if (!size) {
         console.log("Select Product Size");
         return;
       }

       let cartData = structuredClone(cartItem); // Clone the product

       if (cartData[itemId]) {
         if (cartData[itemId][size]) {
           cartData[itemId][size] += 1;
         } else {
           cartData[itemId][size] = 1;
         }
       } else {
         cartData[itemId] = {};
         cartData[itemId][size] = 1;
       }
     
       setCartItem(cartData);
       
       // If user is authenticated, sync with backend
       if(userData){
         setLoading(true);
         try {
           await axios.post(serverUrl + '/api/cart/add',{itemId,size},{withCredentials: true})
           console.log("Product Added to server cart");
           setLoading(false);
         } catch (error) {
           console.log(error);
           setLoading(false);
         }
       }
     }
 const getUserCart = async()=>{
  try{
    const result = await axios.post(serverUrl + "/api/cart/get",{},{withCredentials: true})
    setCartItem(result.data)
  } catch (error) {
    console.log(error)
  }
 }
const updateQuantity = async (itemId , size , quantity) => {
      let cartData = structuredClone(cartItem);
    cartData[itemId][size] = quantity
    setCartItem(cartData)

    if (userData) {
      try {
        await axios.post(serverUrl + "/api/cart/update", { itemId, size, quantity }, { withCredentials: true })
      } catch (error) {
        console.log(error)
        
      }
    }
      
    }
 
 const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItem) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItem[items]) {
        try {
          if (cartItem[items][item] > 0) {
            totalAmount += itemInfo.price * cartItem[items][item];
          }
        } catch (error) {
          // product not found
        }
      }
    }
    return totalAmount;
  }

 const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItem) {
      for (const item in cartItem[items]) {
        try {
          if (cartItem[items][item] > 0) {
            totalCount += cartItem[items][item]
          }
        } catch (error) {

        }
      }
    }
    return totalCount
  }

useEffect(()=>{
getProducts()
},[])
useEffect(()=>{
  getUserCart()
}, [])

     let value={
        products,currency,delivery_fee,getProducts,search,setSearch,showSearch,setShowSearch,cartItem,addtoCart,getCartCount,getCartAmount,updateQuantity,setCartItem
    }
  return (
   

    <div>
        <shopDataContext.Provider value={value}>
            {children}
        </shopDataContext.Provider>
       
    </div>
  )
}

export default ShopContext