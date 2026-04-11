import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { shopDataContext } from '../context/ShopContext'
import { FaStar } from "react-icons/fa";
import { FaStarHalfAlt } from "react-icons/fa";
import RelatedProduct from '../component/RelatedProduct';
import Loading from '../component/Loading';

function ProductDetail() {
    let {productId} = useParams()
    let {products,currency ,addtoCart ,loading} = useContext(shopDataContext)
    let [productData,setProductData] = useState(false)

    const [image, setImage] = useState('')
    const [image1, setImage1] = useState('')
    const [image2, setImage2] = useState('')
    const [image3, setImage3] = useState('')
    const [image4, setImage4] = useState('')
    const [size, setSize] = useState('')

    const fetchProductData = async () => {
      products.map((item) => {
        if (item._id === productId) {
          setProductData(item)
          console.log(productData)
          setImage1(item.image1)
          setImage2(item.image2)
          setImage3(item.image3)
          setImage4(item.image4)
          setImage(item.image1)
          return null;
        }
      })
    }

    useEffect(() => {
      fetchProductData()
    }, [productId, products])

    return productData ? (
    <div className='w-full overflow-x-hidden'>
     
        <div className='w-full min-h-screen bg-gradient-to-l from-[#141414] to-[#0c2025] flex flex-col lg:flex-row items-center justify-start gap-5 px-4 md:px-10 py-10'>
            
            
            <div className='w-full lg:w-1/2 flex flex-col lg:flex-row items-center justify-center mt-10 gap-6'>
                
               
                <div className='flex lg:flex-col items-center justify-center gap-4 flex-wrap'>
                    <div className='w-[60px] h-[60px] md:w-[100px] md:h-[110px] bg-slate-300 border border-[#80808049] rounded-md'>
                        <img src={image1} alt="" className='w-full h-full object-cover cursor-pointer rounded-md' onClick={()=>setImage(image1)}/>
                    </div>
                    <div className='w-[60px] h-[60px] md:w-[100px] md:h-[110px] bg-slate-300 border border-[#80808049] rounded-md'>
                        <img src={image2} alt="" className='w-full h-full object-cover cursor-pointer rounded-md' onClick={()=>setImage(image2)}/>
                    </div>
                    <div className='w-[60px] h-[60px] md:w-[100px] md:h-[110px] bg-slate-300 border border-[#80808049] rounded-md'>
                        <img src={image3} alt="" className='w-full h-full object-cover cursor-pointer rounded-md' onClick={()=>setImage(image3)}/>
                    </div>
                    <div className='w-[60px] h-[60px] md:w-[100px] md:h-[110px] bg-slate-300 border border-[#80808049] rounded-md'>
                        <img src={image4} alt="" className='w-full h-full object-cover cursor-pointer rounded-md' onClick={()=>setImage(image4)}/>
                    </div>
                </div>

               
                <div className='w-[85%] md:w-[70%] lg:w-[65%] border border-[#80808049] rounded-md overflow-hidden'>
                    <img src={image} alt="" className='w-full h-full object-contain rounded-md bg-[#ffffff05]' />
                </div>
            </div>

           
            <div className='w-full lg:w-1/2 flex flex-col items-start justify-start gap-3 mt-5 px-3 md:px-5'>
                <h1 className='text-[28px] md:text-[38px] font-semibold text-[aliceblue]'>{productData.name.toUpperCase()}</h1>

                <div className='flex items-center gap-1'>
                    <FaStar className='text-[20px] fill-[#FFD700]' />
                    <FaStar className='text-[20px] fill-[#FFD700]' />
                    <FaStar className='text-[20px] fill-[#FFD700]' />
                    <FaStar className='text-[20px] fill-[#FFD700]' />
                    <FaStarHalfAlt className='text-[20px] fill-[#FFD700]' />
                    <p className='text-[16px] md:text-[18px] font-semibold pl-[5px] text-[white]'>(124)</p>
                </div>

                <p className='text-[24px] md:text-[30px] font-semibold pl-[5px] text-[white]'>{currency} {productData.price}</p>

                <p className='w-[95%] md:w-[80%] text-[16px] md:text-[18px] font-semibold pl-[5px] text-[white]'>
                  {productData.description} and Stylish, breathable cotton shirt with a modern slim fit. Easy to wash, super comfortable, and designed for effortless style.
                </p>

                <div className='flex flex-col gap-3 my-[10px]'>
                    <p className='text-[20px] md:text-[25px] font-semibold pl-[5px] text-[white]'>Select Size</p>
                    <div className='flex flex-wrap gap-2'>
                        {productData.sizes.map((item, index) => (
                            <button 
                              key={index} 
                              className={`border py-2 px-4 bg-slate-300 rounded-md transition-all duration-200
                              ${item === size ? 'bg-black text-[#2f97f1] text-[18px] md:text-[20px]' : 'hover:bg-slate-400'}`} 
                              onClick={() => setSize(item)}>
                              {item}
                            </button>
                        ))}
                    </div>
                    <button 
                      className='text-[14px] md:text-[16px] active:bg-slate-500 cursor-pointer bg-[#495b61c9] py-[10px] px-[20px] rounded-2xl mt-[10px] border border-[#80808049] text-white shadow-md shadow-black' 
                      onClick={()=>addtoCart(productData._id , size)}>
                      {loading? <Loading/> : "Add to Cart"}
                    </button>
                </div>

                <div className='w-full h-[1px] bg-slate-700'></div>
                <div className='w-[90%] text-[14px] md:text-[16px] text-white space-y-1'>
                    <p>100% Original Product.</p>
                    <p>Cash on delivery is available on this product</p>
                    <p>Easy return and exchange policy within 7 days</p>
                </div>
            </div>
        </div>

      
        <div className='w-full min-h-[70vh] bg-gradient-to-l from-[#141414] to-[#0c2025] flex flex-col items-start justify-start overflow-x-hidden px-3 md:px-10 py-10'>
            <div className='flex gap-3 md:gap-5 px-2 md:px-5 mt-5 md:mt-0'>
                <p className='border px-4 py-2 md:px-5 md:py-3 text-sm text-white cursor-pointer hover:bg-[#2f97f1] hover:text-black transition-all'>
                  Description
                </p>
                <p className='border px-4 py-2 md:px-5 md:py-3 text-sm text-white cursor-pointer hover:bg-[#2f97f1] hover:text-black transition-all'>
                  Reviews (124)
                </p>
            </div>

            <div className='w-[90%] md:w-[80%] md:h-auto bg-[#3336397c] border text-white text-[13px] md:text-[15px] lg:text-[20px] px-[10px] md:px-[30px] mt-5 rounded-md'>
                <p className='w-full h-full flex items-center justify-center text-center py-5'>
                  Upgrade your wardrobe with this stylish slim-fit cotton shirt, available now on OneCart. Crafted from breathable, high-quality fabric, it offers all-day comfort and effortless style. Easy to maintain and perfect for any setting, this shirt is a must-have essential for those who value both fashion and function.
                </p>
            </div>

            <div className='w-full mt-10'>
                <RelatedProduct category={productData.category} subCategory={productData.subCategory} currentProductId={productData._id}/>
            </div>
        </div>
    </div>
  ) : <div className='opacity-0'></div>
}

export default ProductDetail
