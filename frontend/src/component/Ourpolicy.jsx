import React from 'react'
import Title from './Title'
import { RiExchangeFundsLine } from "react-icons/ri";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { BiSupport } from "react-icons/bi";

function OurPolicy() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start bg-gradient-to-l from-[#141414] to-[#0c2025] py-12 px-4 md:px-10">
      
     
      <div className="text-center mb-10">
        <Title text1="OUR" text2="POLICY" />
        <p className="text-blue-100 text-sm md:text-lg mt-2">
          Customer-Friendly Policies – Committed to Your Satisfaction and Safety.
        </p>
      </div>

     
      <div className="w-full flex flex-wrap items-center justify-center gap-8 md:gap-12">
        
    
        <div className="w-full sm:w-[80%] md:w-[45%] lg:w-[30%] bg-transparent flex flex-col items-center justify-center text-center gap-3 p-4">
          <RiExchangeFundsLine className="w-10 h-10 md:w-16 md:h-16 text-[#90b9ff]" />
          <p className="font-semibold text-[#a5e8f7] text-lg md:text-2xl">Easy Exchange Policy</p>
          <p className="text-[aliceblue] text-sm md:text-base font-medium">
            Exchange Made Easy – Quick, Simple, and Customer-Friendly Process.
          </p>
        </div>

        
        <div className="w-full sm:w-[80%] md:w-[45%] lg:w-[30%] bg-transparent flex flex-col items-center justify-center text-center gap-3 p-4">
          <TbRosetteDiscountCheckFilled className="w-10 h-10 md:w-16 md:h-16 text-[#90b9ff]" />
          <p className="font-semibold text-[#a5e8f7] text-lg md:text-2xl">7 Days Return Policy</p>
          <p className="text-[aliceblue] text-sm md:text-base font-medium">
            Shop with Confidence – 7 Days Easy Return Guarantee.
          </p>
        </div>

       
        <div className="w-full sm:w-[80%] md:w-[45%] lg:w-[30%] bg-transparent flex flex-col items-center justify-center text-center gap-3 p-4">
          <BiSupport className="w-10 h-10 md:w-16 md:h-16 text-[#90b9ff]" />
          <p className="font-semibold text-[#a5e8f7] text-lg md:text-2xl">Best Customer Support</p>
          <p className="text-[aliceblue] text-sm md:text-base font-medium">
            Trusted Customer Support – Your Satisfaction Is Our Priority.
          </p>
        </div>
      </div>
    </div>
  );
}

export default OurPolicy;
