import React, { useEffect, useState } from "react";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import Title from "../component/Title";
import { useContext } from "react";
import { shopDataContext } from "../context/ShopContext";
import Card from "../component/Card";

function Collections() {
   let [showFilter, setShowFilter] = useState(false);
   let {products,search,showSearch} = useContext(shopDataContext)
   let [filterProduct,setFilterProduct] = useState([])
   let [category,setCategory] = useState([])
  let [subCategory,setsubCategory] = useState([])
  let [sortType,setSortType] = useState([])


  const toggleCategory = (e) =>{
    if(category.includes(e.target.value)){
      setCategory(prev => prev.filter(item => item !== e.target.value))

    }else{
      setCategory(prev => [...prev,e.target.value])

    }
  }
  const toggleSubCategory = (e) =>{
    if(subCategory.includes(e.target.value)){
      setsubCategory(prev => prev.filter(item => item !== e.target.value))

    }else{
      setsubCategory(prev => [...prev,e.target.value])
      
    }
  }
 
  const applyFilter = ()=>{
    let productCopy = products.slice()
    if(showSearch && search){
      productCopy = productCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }
    if(category.length > 0){
      productCopy = productCopy.filter(item => category.includes(item.category))
    }
     if(subCategory.length > 0){
      productCopy = productCopy.filter(item => subCategory.includes(item.subCategory))
    }
    setFilterProduct(productCopy)
  }

const sortProduct = (e)=>{
  let fbCopy = filterProduct.slice()
  switch(sortType){
    case 'low-high' :
      setFilterProduct(fbCopy.sort((a,b)=>(a.price - b.price)))
      break;
        case 'high-low' :
      setFilterProduct(fbCopy.sort((a,b)=>(b.price - a.price)))
      break;
      default:
        applyFilter()
        break;
  }
}
useEffect(()=>{
 sortProduct()

},[sortType])


  useEffect(()=>{
    setFilterProduct(products)
  },[products])

  useEffect(()=>{
    applyFilter()
  },[category,subCategory,search,showSearch])

  return (
    <div className="w-full min-h-screen bg-gradient-to-l from-[#141414] to-[#0c2025] flex flex-col md:flex-row pt-[70px] overflow-x-hidden pb-[110px]">
     
      <div
        className={`md:w-[30vw] lg:w-[20vw] w-full md:min-h-screen ${
          showFilter ? "h-auto" : "h-[8vh]"
        } p-5 border-b md:border-b-0 md:border-r border-gray-400 text-[#aaf5fa] md:fixed bg-[#0f1f23] md:bg-transparent z-20`}
      >
        <p
          className="text-[22px] font-semibold flex items-center justify-between cursor-pointer md:cursor-default"
          onClick={() => setShowFilter((prev) => !prev)}
        >
          FILTERS
          <span className="md:hidden">
            {showFilter ? <FaChevronDown /> : <FaChevronRight />}
          </span>
        </p>

       
        <div
          className={`transition-all duration-300 border-2 border-[#dedcdc] pl-5 py-3 mt-5 rounded-md bg-slate-600 ${
            showFilter ? "block" : "hidden"
          } md:block`}
        >
          <p className="text-[18px] text-[#f8fafa] mb-2">CATEGORIES</p>
         <div className='w-[230px] h-[120px]  flex items-start justify-center gap-[10px] flex-col'>
            <p className='flex items-center justify-center gap-[10px] text-[16px] font-light'> <input type="checkbox" value={'Men'} className='w-3' onChange={toggleCategory} /> Men</p>
            <p className='flex items-center justify-center gap-[10px] text-[16px] font-light'> <input type="checkbox" value={'Women'} className='w-3' onChange={toggleCategory} /> Women</p>
            <p className='flex items-center justify-center gap-[10px] text-[16px] font-light'> <input type="checkbox" value={'Kids'} onChange={toggleCategory} className='w-3' /> Kids</p>
          </div>
        </div>

       
        <div
          className={`transition-all duration-300 border-2 border-[#dedcdc] pl-5 py-3 mt-5 rounded-md bg-slate-600 ${
            showFilter ? "block" : "hidden"
          } md:block`}
        >
          <p className="text-[18px] text-[#f8fafa] mb-2">SUB-CATEGORIES</p>
         <div className='w-[230px] h-[120px]  flex items-start justify-center gap-[10px] flex-col'>
            <p className='flex items-center justify-center gap-[10px] text-[16px] font-light'> <input type="checkbox" value={'TopWear'} className='w-3' onChange={toggleSubCategory} /> TopWear</p>
            <p className='flex items-center justify-center gap-[10px] text-[16px] font-light'> <input type="checkbox" value={'BottomWear'} className='w-3' onChange={toggleSubCategory} /> BottomWear</p>
            <p className='flex items-center justify-center gap-[10px] text-[16px] font-light'> <input type="checkbox" value={'WinterWear'} onChange={toggleSubCategory} className='w-3' /> WinterWear</p>
          </div>
        </div>
      </div>

      
      <div className="flex-1 px-4 sm:px-6 md:px-10 py-6 md:ml-[30vw] lg:ml-[20vw]">
        <div className="flex flex-col sm:flex-row  items-center justify-between w-full gap-4 sm:gap-6">
          <Title text1="All" text2="COLLECTIONS" />

          <select
            className="bg-slate-600 w-full sm:w-[60%] md:w-[220px] h-[50px] px-3 text-white rounded-lg border-2 border-transparent hover:border-[#46d1f7] focus:border-[#46d1f7] focus:outline-none"
          onChange={(e)=>setSortType(e.target.value)} >
            <option value="relevant">Sort By: Relevant</option>
            <option value="low-high">Sort By: Low to High</option>
            <option value="high-low">Sort By: High to Low</option>
          </select>
        </div>
          <div className='w-full min-h-[70vh] flex items-center justify-center flex-wrap gap-[30px]'>
            {
              filterProduct.map((item,index)=>(
                <Card key ={index} id={item._id}  name ={item.name}  price ={item.price} image ={item.image1} />

              ))
            }
          </div>
      </div>
    </div>
  );
}

export default Collections;
