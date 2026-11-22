import React, { useContext, useEffect, useState } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'

const STATUS_OPTIONS = ['Order Placed', 'Packing', 'Shipped', 'Out For Delivery', 'Delivered']

function Order() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const { serverUrl } = useContext(authDataContext)

  const fetchAllOrders = async () => {
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + '/api/order/list', {}, { withCredentials: true })
      setOrders(result.data.reverse())
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.post(serverUrl + '/api/order/status', { orderId, status }, { withCredentials: true })
      fetchAllOrders()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [])

  return (
    <div className='w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-white overflow-x-hidden'>
      <Nav />
      <div className='w-[100%] flex items-start justify-start'>
        <Sidebar />
        <div className='w-[82%] lg:ml-[320px] md:ml-[230px] ml-[100px] mt-[80px] pb-[50px] px-[20px] flex flex-col gap-[20px]'>
          <h2 className='text-[28px] md:text-[36px] font-bold text-white mb-[10px]'>All Orders</h2>

          {loading && (
            <div className='text-[#9ff9f9] text-center py-[40px] text-[18px]'>Loading orders...</div>
          )}

          {!loading && orders.length === 0 && (
            <div className='text-white text-center py-[40px] text-[18px]'>No orders found.</div>
          )}

          {orders.map((order, index) => (
            <div key={index} className='w-[100%] bg-[#51808048] rounded-2xl p-[20px] border-[1px] border-[#80808049] flex flex-col gap-[15px]'>
              {/* Order Header */}
              <div className='flex items-center justify-between flex-wrap gap-[10px]'>
                <div className='flex flex-col gap-[4px]'>
                  <p className='text-[#808080] text-[13px]'>Order ID: <span className='text-[#9ff9f9]'>{order._id}</span></p>
                  <p className='text-[#808080] text-[13px]'>Date: {new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  <p className='text-[#808080] text-[13px]'>Payment: <span className={order.payment ? 'text-green-400' : 'text-yellow-400'}>{order.payment ? 'Paid' : 'Pending'}</span> • {order.paymentMethod}</p>
                </div>
                <div className='flex items-center gap-[15px]'>
                  <p className='text-[#9ff9f9] text-[20px] font-bold'>₹ {order.amount}</p>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className='bg-slate-700 border border-[#4d8890] text-white px-[10px] py-[8px] rounded-lg text-[14px] cursor-pointer hover:border-[#46d1f7] transition-colors'
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Items */}
              <div className='flex flex-wrap gap-[10px]'>
                {order.items.map((item, i) => (
                  <div key={i} className='flex items-center gap-[10px] bg-[#1a3a3a60] rounded-xl p-[10px] min-w-[200px]'>
                    <img src={item.image1} alt={item.name} className='w-[55px] h-[55px] rounded-lg object-cover' />
                    <div>
                      <p className='text-white text-[14px] font-medium'>{item.name}</p>
                      <p className='text-[#aaf4e7] text-[13px]'>₹{item.price} × {item.quantity}</p>
                      <p className='text-[#808080] text-[12px]'>Size: {item.size}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Address */}
              <div className='bg-[#1a3a3a60] rounded-xl p-[15px]'>
                <p className='text-[#9ff9f9] text-[14px] font-semibold mb-[6px]'>📦 Delivery Address</p>
                <p className='text-white text-[13px]'>
                  {order.address.firstName} {order.address.lastName}
                </p>
                <p className='text-[#c0c0c0] text-[13px]'>
                  {order.address.street}, {order.address.city}, {order.address.state} - {order.address.pinCode}
                </p>
                <p className='text-[#c0c0c0] text-[13px]'>{order.address.country}</p>
                <p className='text-[#c0c0c0] text-[13px]'>📞 {order.address.phone}</p>
                <p className='text-[#c0c0c0] text-[13px]'>✉️ {order.address.email}</p>
              </div>

              {/* Status Badge */}
              <div className='flex items-center gap-[10px]'>
                <span className={`px-[14px] py-[5px] rounded-full text-[13px] font-medium
                  ${order.status === 'Delivered' ? 'bg-green-900 text-green-300' :
                    order.status === 'Shipped' || order.status === 'Out For Delivery' ? 'bg-blue-900 text-blue-300' :
                    order.status === 'Packing' ? 'bg-purple-900 text-purple-300' :
                    'bg-yellow-900 text-yellow-300'}`}>
                  {order.status}
                </span>
                <span className='text-[#808080] text-[13px]'>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Order
