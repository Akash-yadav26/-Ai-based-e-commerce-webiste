import React, { useContext, useEffect, useState } from 'react'
import Title from '../component/Title'
import { shopDataContext } from '../context/ShopContext'
import { authDataContext } from '../context/authContext'
import axios from 'axios'

function Order() {
    const [orders, setOrders] = useState([])
    const { serverUrl } = useContext(authDataContext)
    const { currency } = useContext(shopDataContext)

    const getOrders = async () => {
        try {
            const result = await axios.post(serverUrl + "/api/order/userorder", {}, { withCredentials: true })
            setOrders(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getOrders()
    }, [])

    return (
        <div className='w-[99vw] min-h-[100vh] p-[20px] overflow-hidden bg-gradient-to-l from-[#141414] to-[#0c2025]'>
            <div className='h-[8%] w-[100%] text-center mt-[80px]'>
                <Title text1={'MY'} text2={'ORDERS'} />
            </div>

            <div className='w-[100%] flex flex-col gap-[15px] mt-[20px]'>
                {orders.length === 0 && (
                    <p className='text-white text-center text-[18px] mt-[40px]'>No orders yet</p>
                )}
                {orders.map((order, index) => (
                    <div key={index} className='w-[100%] bg-[#51808048] rounded-2xl p-[20px] border-[1px] border-[#80808049]'>
                        <div className='flex items-center justify-between flex-wrap gap-[10px]'>
                            <div className='flex items-center gap-[15px] flex-wrap'>
                                {order.items.map((item, i) => (
                                    <div key={i} className='flex items-center gap-[10px]'>
                                        <img src={item.image1} alt="" className='w-[60px] h-[60px] rounded-md object-cover' />
                                        <div>
                                            <p className='text-white text-[16px]'>{item.name}</p>
                                            <p className='text-[#aaf4e7] text-[14px]'>{currency} {item.price} x {item.quantity} ({item.size})</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className='flex items-center gap-[20px]'>
                                <p className='text-[#9ff9f9] text-[18px] font-semibold'>{currency} {order.amount}</p>
                                <span className={`px-[15px] py-[5px] rounded-full text-[14px] font-medium
                                    ${order.status === 'Delivered' ? 'bg-green-900 text-green-300' :
                                        order.status === 'Shipped' ? 'bg-blue-900 text-blue-300' :
                                            'bg-yellow-900 text-yellow-300'}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                        <div className='flex items-center justify-between mt-[10px]'>
                            <p className='text-[#808080] text-[14px]'>{order.paymentMethod} • {order.payment ? 'Paid' : 'Pending'}</p>
                            <p className='text-[#808080] text-[14px]'>{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Order
