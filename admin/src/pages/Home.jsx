import React, { useContext, useEffect, useState } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'

function StatCard({ label, value, color, icon }) {
  return (
    <div className={`flex flex-col gap-[10px] p-[25px] rounded-2xl border border-[#80808049] bg-[#51808048] min-w-[180px] flex-1`}>
      <div className='text-[36px]'>{icon}</div>
      <p className={`text-[32px] font-bold ${color}`}>{value}</p>
      <p className='text-[#c0c0c0] text-[15px]'>{label}</p>
    </div>
  )
}

function Home() {
  const { serverUrl } = useContext(authDataContext)
  const [stats, setStats] = useState({ orders: 0, revenue: 0, products: 0, pending: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchDashboard = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        axios.post(serverUrl + '/api/order/list', {}, { withCredentials: true }),
        axios.get(serverUrl + '/api/product/list')
      ])

      const orders = ordersRes.data
      const products = productsRes.data

      const totalRevenue = orders
        .filter(o => o.payment)
        .reduce((acc, o) => acc + o.amount, 0)

      const pendingOrders = orders.filter(o => o.status !== 'Delivered').length

      setStats({
        orders: orders.length,
        revenue: totalRevenue,
        products: products.length,
        pending: pendingOrders
      })
      setRecentOrders(orders.slice(-5).reverse())
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  return (
    <div className='w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-white overflow-x-hidden'>
      <Nav />
      <div className='w-[100%] flex items-start justify-start'>
        <Sidebar />
        <div className='w-[82%] lg:ml-[320px] md:ml-[230px] ml-[100px] mt-[80px] pb-[50px] px-[20px] flex flex-col gap-[30px]'>
          <h2 className='text-[28px] md:text-[36px] font-bold text-white'>Dashboard</h2>

          {loading ? (
            <p className='text-[#9ff9f9]'>Loading...</p>
          ) : (
            <>
              {/* Stats */}
              <div className='flex flex-wrap gap-[20px]'>
                <StatCard icon='🛒' label='Total Orders' value={stats.orders} color='text-[#9ff9f9]' />
                <StatCard icon='💰' label='Total Revenue' value={`₹${stats.revenue.toLocaleString()}`} color='text-green-400' />
                <StatCard icon='📦' label='Total Products' value={stats.products} color='text-purple-400' />
                <StatCard icon='⏳' label='Pending Orders' value={stats.pending} color='text-yellow-400' />
              </div>

              {/* Recent Orders */}
              <div>
                <h3 className='text-[22px] font-semibold text-white mb-[15px]'>Recent Orders</h3>
                {recentOrders.length === 0 ? (
                  <p className='text-[#808080]'>No orders yet.</p>
                ) : (
                  <div className='flex flex-col gap-[12px]'>
                    {recentOrders.map((order, index) => (
                      <div key={index} className='flex items-center justify-between flex-wrap gap-[10px] bg-[#51808048] rounded-xl px-[20px] py-[15px] border border-[#80808049]'>
                        <div>
                          <p className='text-white text-[15px] font-medium'>
                            {order.address.firstName} {order.address.lastName}
                          </p>
                          <p className='text-[#808080] text-[13px]'>{new Date(order.date).toLocaleDateString('en-IN')}</p>
                        </div>
                        <div className='flex items-center gap-[20px]'>
                          <p className='text-[#9ff9f9] font-semibold'>₹{order.amount}</p>
                          <span className={`px-[12px] py-[4px] rounded-full text-[12px] font-medium
                            ${order.status === 'Delivered' ? 'bg-green-900 text-green-300' :
                              order.status === 'Shipped' || order.status === 'Out For Delivery' ? 'bg-blue-900 text-blue-300' :
                              'bg-yellow-900 text-yellow-300'}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
